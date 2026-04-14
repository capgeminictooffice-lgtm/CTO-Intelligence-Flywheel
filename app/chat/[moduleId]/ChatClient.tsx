"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Paperclip,
  FileText,
  Radar,
  Brain,
  Lightbulb,
  Bot,
} from "lucide-react";
import type { Module } from "@/lib/modules";
import type { Profile } from "@/lib/supabase";
import { createBrowserSupabase } from "@/lib/supabase";
import { useChatStore } from "@/lib/store";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = { Radar, Brain, Lightbulb, Bot };

type Conversation = { id: string; title: string | null; created_at: string; module: string };

export default function ChatClient({
  module: mod,
  profile,
  conversations,
  initialPrompt,
  initialConversationId,
}: {
  module: Module;
  profile: Profile;
  conversations: Conversation[];
  initialPrompt?: string;
  initialConversationId?: string;
}) {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const Icon = ICONS[mod.icon] || Radar;

  const {
    messages,
    streaming,
    appendMessage,
    appendToLastAssistant,
    setLastAssistantModel,
    setLastAssistantFiles,
    setStreaming,
    setMessages,
    conversationId,
    setConversationId,
    reset,
  } = useChatStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [workflow, setWorkflow] = useState(mod.workflows[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [attachedDocs, setAttachedDocs] = useState<{ filename: string }[]>([]);

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingFile(file.name);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(path, file);
      if (upErr) throw upErr;
      const { data: insertedDoc, error: insErr } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          filename: file.name,
          file_type: file.type,
          storage_path: path,
        })
        .select()
        .single();
      if (insErr) throw insErr;
      setAttachedDocs((prev) => [...prev, { filename: file.name }]);
      // Kick off RAG ingestion in the background so future workflows can retrieve from it.
      if (insertedDoc?.id) {
        fetch("/api/documents/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: insertedDoc.id }),
        }).catch((err) => console.warn("[chat] ingest kickoff failed:", err));
      }
    } catch (err) {
      console.error("[chat] upload failed:", err);
      alert(`Upload failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setUploadingFile(null);
    }
  }

  const clientsList = profile.clients || [];
  const industriesList = profile.industries || [];
  const geographiesList = profile.geographies || [];
  const multipleClients = clientsList.length > 1;
  const multipleIndustries = industriesList.length > 1;
  const multipleGeos = geographiesList.length > 1;
  const showSelectors = multipleClients || multipleIndustries || multipleGeos;

  const [selClient, setSelClient] = useState(clientsList[0] || "All");
  const [selIndustry, setSelIndustry] = useState(industriesList[0] || "All");
  const [selGeo, setSelGeo] = useState(geographiesList[0] || "All");

  useEffect(() => {
    reset();
    if (initialConversationId) {
      setConversationId(initialConversationId);
      supabase
        .from("conversations")
        .select("messages")
        .eq("id", initialConversationId)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.messages) setMessages(data.messages);
        });
    }
    if (initialPrompt) setInput(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    appendMessage({ role: "user", content: text });
    appendMessage({ role: "assistant", content: "" });
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: mod.id,
          workflow,
          message: text,
          conversationId,
          context: {
            client: selClient !== "All" ? selClient : undefined,
            industry: selIndustry !== "All" ? selIndustry : undefined,
            geography: selGeo !== "All" ? selGeo : undefined,
          },
        }),
      });

      const newConvId = res.headers.get("x-conversation-id");
      if (newConvId && !conversationId) setConversationId(newConvId);
      const modelUsed = res.headers.get("x-model");
      if (modelUsed) setLastAssistantModel(modelUsed);

      if (!res.body) throw new Error("No stream body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Buffer so we can detect the <<<FILES>>>...<<<END>>> sentinel even if
      // it arrives split across chunks. Everything before the sentinel is rendered
      // as assistant text; the sentinel payload is parsed as JSON-encoded files.
      let buffer = "";
      let sentinelStarted = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        if (!sentinelStarted) {
          const idx = buffer.indexOf("<<<FILES>>>");
          if (idx === -1) {
            // No sentinel in sight yet — flush all but the last ~12 chars (in case the
            // sentinel marker straddles chunk boundaries) and keep the tail buffered.
            const safeFlush = buffer.length > 12 ? buffer.slice(0, -12) : "";
            if (safeFlush.length > 0) {
              appendToLastAssistant(safeFlush);
              buffer = buffer.slice(safeFlush.length);
            }
          } else {
            // Flush everything up to the sentinel, then enter sentinel mode.
            const pre = buffer.slice(0, idx);
            if (pre.length > 0) appendToLastAssistant(pre);
            buffer = buffer.slice(idx + "<<<FILES>>>".length);
            sentinelStarted = true;
          }
        }

        if (sentinelStarted) {
          const endIdx = buffer.indexOf("<<<END>>>");
          if (endIdx !== -1) {
            const json = buffer.slice(0, endIdx);
            buffer = buffer.slice(endIdx + "<<<END>>>".length);
            try {
              const parsed = JSON.parse(json) as { files?: { filename: string; base64: string; media_type: string }[] };
              if (parsed.files && parsed.files.length > 0) {
                setLastAssistantFiles(parsed.files);
              }
            } catch (err) {
              console.warn("[chat] failed to parse files sentinel:", err);
            }
            break;
          }
        }
      }

      // Flush any trailing text that wasn't part of a sentinel.
      if (!sentinelStarted && buffer.length > 0) {
        appendToLastAssistant(buffer);
      }
    } catch (err) {
      appendToLastAssistant(`\n\n_Error: ${err instanceof Error ? err.message : "stream failed"}_`);
    } finally {
      setStreaming(false);
    }
  }

  function newConversation() {
    reset();
  }

  const groupedConvos = groupConversations(conversations);

  return (
    <div className="h-screen flex bg-white text-gray-900">
      {sidebarOpen && (
        <aside className="w-64 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> All modules
            </Link>
            <div className="mt-3 flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${mod.color}15`, color: mod.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{mod.name}</div>
                <div className="text-xs text-gray-400">{mod.workflows.length} workflows</div>
              </div>
            </div>
            <button
              onClick={newConversation}
              className="mt-3 w-full flex items-center gap-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2"
            >
              <Plus className="w-4 h-4" /> New conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {Object.entries(groupedConvos).map(([group, items]) => (
              <div key={group} className="px-3 py-2">
                <div className="text-xs uppercase text-gray-400 tracking-wide px-1 mb-1">{group}</div>
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => router.push(`/chat/${mod.id}?conversation=${c.id}`)}
                    className="w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-gray-50 truncate"
                  >
                    {c.title || "Untitled"}
                  </button>
                ))}
              </div>
            ))}

            <div className="border-t border-gray-100 mt-2 px-3 py-3">
              <div className="text-xs uppercase text-gray-400 tracking-wide mb-2">Available workflows</div>
              {mod.workflows.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    setWorkflow(w.id);
                    setInput(w.name + ": ");
                  }}
                  className={`w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-gray-50 ${
                    workflow === w.id ? "text-capblue font-medium" : "text-gray-700"
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-100 px-4 py-2 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-900">
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {showSelectors ? (
              <div className="flex items-center gap-2">
                {multipleClients && (
                  <Selector value={selClient} onChange={setSelClient} options={["All", ...clientsList]} />
                )}
                {multipleIndustries && (
                  <Selector value={selIndustry} onChange={setSelIndustry} options={["All", ...industriesList]} />
                )}
                {multipleGeos && (
                  <Selector value={selGeo} onChange={setSelGeo} options={["All", ...geographiesList]} />
                )}
              </div>
            ) : (
              <span className="text-gray-600">
                Context loaded: {clientsList[0] || "General"} · {industriesList[0] || "All industries"} ·{" "}
                {geographiesList[0] || "Global"}
              </span>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8">
          {messages.length === 0 ? (
            <div className="max-w-xl mx-auto text-center mt-16">
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${mod.color}15`, color: mod.color }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-gray-900 mb-2">{mod.name}</h2>
              <p className="text-gray-500 mb-6">{mod.description}</p>
              <div className="flex flex-col gap-2">
                {mod.workflows.slice(0, 3).map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setWorkflow(w.id);
                      setInput(w.name);
                    }}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-capblue text-left"
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  {m.role === "user" ? (
                    <div className="bg-navy text-white rounded-2xl px-4 py-2.5 max-w-[80%] text-sm whitespace-pre-wrap">
                      {m.content}
                    </div>
                  ) : (
                    <div className="flex gap-3 max-w-[85%]">
                      <div
                        className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center"
                        style={{ background: `${mod.color}15`, color: mod.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <div
                          className={`bg-gray-50 rounded-2xl px-4 py-3 text-sm markdown ${
                            streaming && i === messages.length - 1 ? "blink-cursor" : ""
                          }`}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || " "}</ReactMarkdown>
                        </div>
                        {m.files && m.files.length > 0 && (
                          <div className="mt-2 ml-1 flex flex-wrap gap-2">
                            {m.files.map((f, fi) => (
                              <button
                                key={fi}
                                onClick={() => downloadBase64File(f.filename, f.base64, f.media_type)}
                                className="flex items-center gap-2 border border-gray-200 hover:border-capblue rounded-lg px-3 py-1.5 text-xs text-gray-700 hover:text-capblue transition bg-white"
                                title={`Download ${f.filename}`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span className="font-medium">{f.filename}</span>
                                <span className="text-gray-400">
                                  ({Math.round((f.base64.length * 0.75) / 1024)} KB)
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                        {m.model && (
                          <div className="text-[10px] text-gray-400 mt-1 ml-1 font-mono">{m.model}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="max-w-3xl mx-auto">
            {(attachedDocs.length > 0 || uploadingFile) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachedDocs.map((d, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-xs rounded-full px-3 py-1 flex items-center gap-1"
                  >
                    📎 {d.filename}
                    <button
                      onClick={() => setAttachedDocs(attachedDocs.filter((_, j) => j !== i))}
                      className="text-gray-500 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {uploadingFile && (
                  <span className="bg-gray-100 text-xs rounded-full px-3 py-1 text-gray-500">
                    Uploading {uploadingFile}...
                  </span>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.pptx"
              onChange={handleFilePick}
              className="hidden"
            />
            <div className="flex items-end gap-2 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-capblue">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-gray-900 mb-1.5"
                title="Attach a document to your context vault"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder={`Ask ${mod.name}...`}
                className="flex-1 resize-none focus:outline-none text-sm py-1.5 max-h-24"
              />
              <button
                onClick={send}
                disabled={streaming || !input.trim()}
                className="bg-navy text-white rounded-lg p-2 disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">
              Your context vault is active. All responses are personalized.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function downloadBase64File(filename: string, base64: string, mediaType: string) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mediaType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Selector({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function groupConversations(convos: Conversation[]) {
  const groups: Record<string, Conversation[]> = { Today: [], Yesterday: [], "This week": [], Earlier: [] };
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  for (const c of convos) {
    const age = now - new Date(c.created_at).getTime();
    if (age < day) groups.Today.push(c);
    else if (age < 2 * day) groups.Yesterday.push(c);
    else if (age < 7 * day) groups["This week"].push(c);
    else groups.Earlier.push(c);
  }
  return Object.fromEntries(Object.entries(groups).filter(([, v]) => v.length > 0));
}
