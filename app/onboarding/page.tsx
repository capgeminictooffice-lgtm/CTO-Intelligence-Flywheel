"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";
import { ROLES, INDUSTRIES, GEOGRAPHIES } from "@/lib/modules";
import { X, Upload } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [clients, setClients] = useState<string[]>([]);
  const [clientInput, setClientInput] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [geographies, setGeographies] = useState<string[]>([]);
  const [priorities, setPriorities] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addClient(value: string) {
    const v = value.trim().replace(/,$/, "");
    if (v && !clients.includes(v)) setClients([...clients, v]);
    setClientInput("");
  }

  function toggleArray(arr: string[], setArr: (v: string[]) => void, value: string) {
    setArr(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  }

  async function finish() {
    setSubmitting(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[onboarding] session present:", !!session, "access_token len:", session?.access_token?.length);
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr) {
        console.error("[onboarding] auth.getUser error:", authErr);
        throw authErr;
      }
      if (!user) {
        console.error("[onboarding] no user returned — redirecting to /login");
        router.push("/login");
        return;
      }
      console.log("[onboarding] authenticated as:", user.id, user.email);

      // Probe: does the row already exist and can we read it? (exercises RLS SELECT)
      const { data: existing, error: readErr } = await supabase
        .from("profiles")
        .select("id, is_onboarded")
        .eq("id", user.id)
        .maybeSingle();
      console.log("[onboarding] existing profile row:", existing, "readErr:", readErr);

      const update = {
        name,
        role,
        clients,
        industries,
        geographies,
        client_name: clients[0] || null,
        industry: industries[0] || null,
        geography: geographies[0] || null,
        priorities,
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      };

      let profileData;
      let e1;
      if (existing) {
        const res = await supabase.from("profiles").update(update).eq("id", user.id).select();
        profileData = res.data;
        e1 = res.error;
      } else {
        const res = await supabase
          .from("profiles")
          .insert({ id: user.id, email: user.email, ...update })
          .select();
        profileData = res.data;
        e1 = res.error;
      }
      if (e1) {
        console.error("[onboarding] profiles.upsert error:", {
          message: e1.message,
          code: e1.code,
          details: e1.details,
          hint: e1.hint,
          payload: update,
        });
        throw e1;
      }
      console.log("[onboarding] profile saved:", profileData);

      const insertedDocIds: string[] = [];
      for (const f of files) {
        const path = `${user.id}/${Date.now()}-${f.name}`;
        const { error: e2 } = await supabase.storage.from("documents").upload(path, f);
        if (e2) {
          console.error("[onboarding] storage.upload error:", {
            message: e2.message,
            name: e2.name,
            file: f.name,
            path,
          });
          continue;
        }
        const { data: insertedDoc, error: e3 } = await supabase
          .from("documents")
          .insert({
            user_id: user.id,
            filename: f.name,
            file_type: f.type,
            storage_path: path,
          })
          .select()
          .single();
        if (e3) {
          console.error("[onboarding] documents.insert error:", {
            message: e3.message,
            code: e3.code,
            details: e3.details,
            hint: e3.hint,
            file: f.name,
          });
          continue;
        }
        if (insertedDoc?.id) insertedDocIds.push(insertedDoc.id);
      }

      // Fire-and-forget RAG ingestion so the user isn't blocked on the onboarding screen.
      // The pipeline takes 30-90s per PDF (Haiku contextualization + OpenAI embeddings).
      for (const documentId of insertedDocIds) {
        fetch("/api/documents/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId }),
        }).catch((err) => console.warn("[onboarding] ingest kickoff failed:", err));
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("[onboarding] finish() failed:", err);
      const sbErr = err as { message?: string; code?: string; details?: string; hint?: string };
      const msg = sbErr.message
        ? `${sbErr.message}${sbErr.hint ? ` (${sbErr.hint})` : ""}${sbErr.code ? ` [${sbErr.code}]` : ""}`
        : "Failed to save";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const canNext =
    (step === 1 && name.trim()) ||
    (step === 2 && role) ||
    step === 3 ||
    step === 4;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div
              className="h-1.5 bg-capblue rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">What&apos;s your name?</h1>
            <p className="text-gray-500 mb-6">We&apos;ll personalise your intelligence feed.</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-capblue focus:ring-2 focus:ring-capblue/20"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">What&apos;s your role?</h1>
            <p className="text-gray-500 mb-6">Pick the one that fits best.</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-xl border px-4 py-4 text-left text-sm transition ${
                    role === r
                      ? "border-capblue bg-capblue/5 text-navy"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Your context</h1>
            <p className="text-gray-500 mb-6">Where do you operate? You can leave anything blank.</p>

            <div className="mb-6">
              <label className="text-sm text-gray-700 mb-2 block font-medium">Clients</label>
              <div className="rounded-lg border border-gray-200 px-3 py-2 flex flex-wrap gap-2 items-center">
                {clients.map((c) => (
                  <span key={c} className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center gap-1">
                    {c}
                    <button onClick={() => setClients(clients.filter((x) => x !== c))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={clientInput}
                  onChange={(e) => setClientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addClient(clientInput);
                    }
                  }}
                  onBlur={() => clientInput && addClient(clientInput)}
                  placeholder="Type and press Enter"
                  className="flex-1 min-w-[120px] py-1 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-700 mb-2 block font-medium">Industries</label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                      industries.includes(i) ? "border-capblue bg-capblue/5" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={industries.includes(i)}
                      onChange={() => toggleArray(industries, setIndustries, i)}
                      className="accent-capblue"
                    />
                    {i}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block font-medium">Geographies</label>
              <div className="flex flex-wrap gap-2">
                {GEOGRAPHIES.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleArray(geographies, setGeographies, g)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${
                      geographies.includes(g)
                        ? "border-capblue bg-capblue text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Your priorities</h1>
            <p className="text-gray-500 mb-6">What are you focused on? You can paste a doc too.</p>
            <textarea
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              rows={5}
              placeholder="AI-driven regulatory compliance, cloud modernization, cost optimization..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-capblue focus:ring-2 focus:ring-capblue/20"
            />
            <label className="mt-4 block">
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center cursor-pointer hover:border-capblue transition">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <div className="text-sm text-gray-700">Drag files or click to upload</div>
                <div className="text-xs text-gray-400 mt-1">PDF, DOCX, PPTX up to 50MB · multiple files allowed · optional</div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.docx,.pptx"
                  onChange={(e) => {
                    const picked = Array.from(e.target.files ?? []);
                    if (picked.length === 0) return;
                    setFiles((prev) => {
                      const seen = new Set(prev.map((f) => `${f.name}-${f.size}`));
                      return [...prev, ...picked.filter((f) => !seen.has(`${f.name}-${f.size}`))];
                    });
                    e.target.value = "";
                  }}
                />
              </div>
            </label>
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((f, idx) => (
                  <span
                    key={`${f.name}-${idx}`}
                    className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center gap-2 max-w-full"
                  >
                    <span className="truncate max-w-[220px]">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <div className="mt-6 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="text-sm text-gray-500 disabled:opacity-30"
          >
            ← Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className="bg-navy text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={submitting}
              className="bg-navy text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Finish setup"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
