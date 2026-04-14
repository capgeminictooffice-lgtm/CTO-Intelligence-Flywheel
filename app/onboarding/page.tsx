// Server-component wrapper — forces dynamic rendering so Next.js doesn't try to
// prerender the client-side Supabase construction at build time.
import OnboardingClient from "./OnboardingClient";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  return <OnboardingClient />;
}
