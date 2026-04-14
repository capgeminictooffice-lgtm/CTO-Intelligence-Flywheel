import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/onboarding");

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false });

  const { data: memories } = await supabase
    .from("memories")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("extracted_at", { ascending: false });

  return <SettingsClient profile={profile} documents={documents || []} memories={memories || []} />;
}
