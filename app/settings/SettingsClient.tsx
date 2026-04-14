"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Upload, Trash2 } from "lucide-react";
import { createBrowserSupabase, type Profile } from "@/lib/supabase";
import { ROLES, INDUSTRIES, GEOGRAPHIES } from "@/lib/modules";

type Document = {
  id: string;
  filename: string;
  file_type: string | null;
  storage_path: string;
  uploaded_at: string;
};

type Memory = {
  id: string;
  fact: string;
  category: string | null;
  source_conversation_id: string | null;
  extracted_at: string;
};

export default function SettingsClient({
  profile,
  documents,
  memories,
}: {
  profile: Profile;
  documents: Document[];
  memories: Memory[];
}) {
  const supabase = createBrowserSupabase();
  const [role, setRole] = useState(profile.role || "");
  const [clients, setClients] = useState<string[]>(profile.clients || []);
  const [clientInput, setClientInput] = useState("");
  const [industries, setIndustries] = useState<string[]>(profile.industries || []);
  const [geographies, setGeographies] = useState<string[]>(profile.geographies || []);
  const [priorities, setPriorities] = useState(profile.priorities || "");
  const [autoMemory, setAutoMemory] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(profile.updated_at);
  const [docList, setDocList] = useState(documents);
  const [memList, setMemList] = useState(memories);
  const [saving, setSaving] = useState(false);

  function addClient(v: string) {
    const x = v.trim().replace(/,$/, "");
    if (x && !clients.includes(x)) setClients([...clients, x]);
    setClientInput("");
  }

  function toggle(arr: string[], setArr: (v: string[]) => void, value: string) {
    setArr(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        role,
        clients,
        industries,
        geographies,
        client_name: clients[0] || null,
        industry: industries[0] || null,
        geography: geographies[0] || null,
        priorities,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);
    setSaving(false);
    if (!error) setSavedAt(new Date().toISOString());
  }

  async function uploadDoc(file: File) {
    const path = `${profile.id}/${Date.now()}-${file.name}`;
    const { error: e1 } = await supabase.storage.from("documents").upload(path, file);
    if (e1) return;
    const { data } = await supabase
      .from("documents")
      .insert({ user_id: profile.id, filename: file.name, file_type: file.type, storage_path: path })
      .select()
      .single();
    if (data) setDocList([data, ...docList]);
  }

  async function deleteDoc(d: Document) {
    await supabase.storage.from("documents").remove([d.storage_path]);
    await supabase.from("documents").delete().eq("id", d.id);
    setDocList(docList.filter((x) => x.id !== d.id));
  }

  async function deactivateMemory(id: string) {
    await supabase.from("memories").update({ is_active: false }).eq("id", id);
    setMemList(memList.filter((m) => m.id !== id));
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-12">
        <section>
          <h1 className="text-3xl font-serif text-gray-900 mb-1">Context vault</h1>
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {savedAt ? new Date(savedAt).toLocaleString() : "—"}
          </p>

          <div className="space-y-5">
            <Field label="Role">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>

            <Field label="Clients">
              <div className="rounded-lg border border-gray-200 px-3 py-2 flex flex-wrap gap-2">
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
                  placeholder="Add client"
                  className="flex-1 min-w-[120px] py-1 text-sm focus:outline-none"
                />
              </div>
            </Field>

            <Field label="Industries">
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
                      onChange={() => toggle(industries, setIndustries, i)}
                      className="accent-capblue"
                    />
                    {i}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Geographies">
              <div className="flex flex-wrap gap-2">
                {GEOGRAPHIES.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggle(geographies, setGeographies, g)}
                    className={`rounded-full border px-4 py-1.5 text-sm ${
                      geographies.includes(g) ? "border-capblue bg-capblue text-white" : "border-gray-200"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Priorities">
              <textarea
                value={priorities}
                onChange={(e) => setPriorities(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </Field>

            <button
              onClick={save}
              disabled={saving}
              className="bg-navy text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Your documents</h2>
          <div className="space-y-2 mb-4">
            {docList.length === 0 && <p className="text-sm text-gray-400">No documents yet.</p>}
            {docList.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{d.filename}</div>
                  <div className="text-xs text-gray-400">
                    {d.file_type || "file"} · {new Date(d.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
                <button onClick={() => deleteDoc(d)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <label className="block">
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center cursor-pointer hover:border-capblue">
              <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <div className="text-sm text-gray-700">Upload a document</div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadDoc(f);
                }}
              />
            </div>
          </label>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif text-gray-900">Auto-memory</h2>
            <button
              onClick={() => setAutoMemory(!autoMemory)}
              className={`relative w-11 h-6 rounded-full transition ${autoMemory ? "bg-capblue" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${
                  autoMemory ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          <div className="space-y-2">
            {memList.length === 0 && <p className="text-sm text-gray-400">No memories extracted yet.</p>}
            {memList.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between border border-gray-200 rounded-lg px-4 py-3 gap-3"
              >
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{m.fact}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {m.category && (
                      <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                        {m.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(m.extracted_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button onClick={() => deactivateMemory(m.id)} className="text-gray-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
      {children}
    </div>
  );
}
