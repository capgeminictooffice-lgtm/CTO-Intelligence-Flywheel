import { createBrowserClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserSupabase() {
  return createBrowserClient(URL, ANON);
}

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  clients: string[] | null;
  industries: string[] | null;
  geographies: string[] | null;
  client_name: string | null;
  industry: string | null;
  geography: string | null;
  priorities: string | null;
  client_context: string | null;
  preferences: Record<string, unknown> | null;
  is_onboarded: boolean | null;
  created_at: string;
  updated_at: string;
};
