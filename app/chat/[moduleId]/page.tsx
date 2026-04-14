import { redirect, notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { getModule } from "@/lib/modules";
import ChatClient from "./ChatClient";

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ prompt?: string; conversation?: string }>;
}) {
  const { moduleId } = await params;
  const sp = await searchParams;

  const mod = getModule(moduleId);
  if (!mod) notFound();

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile?.is_onboarded) redirect("/onboarding");

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, created_at, module")
    .eq("user_id", user.id)
    .eq("module", moduleId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <ChatClient
      module={mod}
      profile={profile}
      conversations={conversations || []}
      initialPrompt={sp.prompt}
      initialConversationId={sp.conversation}
    />
  );
}
