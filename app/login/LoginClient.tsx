"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: e1 } = await supabase.auth.signUp({ email, password });
        if (e1) throw e1;
        if (data.user) {
          await supabase.from("profiles").upsert({ id: data.user.id, email, is_onboarded: false });
        }
        router.push("/onboarding");
        return;
      }
      const { data, error: e2 } = await supabase.auth.signInWithPassword({ email, password });
      if (e2) throw e2;
      if (!data.user) throw new Error("No user returned");
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_onboarded")
        .eq("id", data.user.id)
        .maybeSingle();
      router.push(profile?.is_onboarded ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-md bg-navy flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-medium text-gray-900">CTO Intelligence Flywheel</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-serif text-gray-900 mb-1">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === "signin" ? "Access your intelligence vault" : "Set up your account"}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-capblue focus:ring-2 focus:ring-capblue/20"
                placeholder="you@capgemini.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-capblue focus:ring-2 focus:ring-capblue/20"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white rounded-lg py-2.5 text-sm font-medium hover:bg-navy/90 transition disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-capblue hover:underline">
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have one?{" "}
                <button onClick={() => setMode("signin")} className="text-capblue hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
