// Server-component wrapper. Its only job is to export `dynamic = 'force-dynamic'`
// so Next.js skips prerendering at build time (the actual page is a client
// component that constructs a Supabase client on mount — it needs runtime
// env vars that aren't guaranteed to be present during `next build`).
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginClient />;
}
