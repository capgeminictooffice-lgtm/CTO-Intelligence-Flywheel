import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { MODULES } from "@/lib/modules";
import { Settings, Zap, ArrowRight, Radar, Brain, Lightbulb, Bot } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Radar,
  Brain,
  Lightbulb,
  Bot,
};

const QUICK_ACTIONS = [
  { label: "Morning — brief me", module: "m4", prompt: "Morning — brief me" },
  { label: "What's trending in AI?", module: "m1", prompt: "What's trending in AI right now?" },
  { label: "Prep me for my next meeting", module: "m4", prompt: "Prep me for my next meeting" },
  { label: "Scan my industry", module: "m1", prompt: "Scan my industry for the latest moves" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile?.is_onboarded) redirect("/onboarding");

  const firstName = (profile.name || "there").split(" ")[0];
  const initials = (profile.name || "U")
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const clientsLabel =
    !profile.clients || profile.clients.length === 0
      ? "General"
      : profile.clients.length === 1
        ? profile.clients[0]
        : "Multi-client";
  const industriesCount = profile.industries?.length ?? 0;
  const geosLabel = profile.geographies?.join(", ") || "Global";

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-navy flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900">CTO Intelligence Flywheel</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-gray-500 hover:text-gray-900">
              <Settings className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-navy text-white text-xs flex items-center justify-center font-medium">
                {initials}
              </div>
              <span className="text-sm text-gray-700">{profile.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">
            {greeting()}, {firstName}
          </h1>
          <p className="text-gray-500">
            {profile.role} · {clientsLabel} · {industriesCount} industries · {geosLabel}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {MODULES.map((m) => {
            const Icon = ICONS[m.icon] || Radar;
            return (
              <Link
                key={m.id}
                href={`/chat/${m.id}`}
                className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <div className="h-1" style={{ background: m.color }} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${m.color}15`, color: m.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{m.name}</h2>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{m.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.workflows.slice(0, 5).map((w) => (
                      <span
                        key={w.id}
                        className="text-xs bg-gray-50 text-gray-600 rounded-full px-2 py-0.5"
                      >
                        {w.name}
                      </span>
                    ))}
                    {m.workflows.length > 5 && (
                      <span className="text-xs text-gray-400 px-2 py-0.5">
                        +{m.workflows.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <section>
          <div className="text-xs uppercase text-gray-400 tracking-wide mb-3">Quick actions</div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((q) => (
              <Link
                key={q.label}
                href={`/chat/${q.module}?prompt=${encodeURIComponent(q.prompt)}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-capblue hover:text-capblue transition"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
