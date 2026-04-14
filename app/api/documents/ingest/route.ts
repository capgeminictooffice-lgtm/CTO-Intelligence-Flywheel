// POST /api/documents/ingest
// Body: { documentId: string }
// Reads the document row, downloads the PDF from Supabase Storage, runs the
// chunk → contextualize → embed → insert pipeline. The user is authenticated
// via cookies; RLS guarantees they can only ingest their own rows.
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { ingestUserDocument } from "@/src/knowledge/ingest-user-doc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // allow up to 5 min — contextual chunking takes time

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { documentId?: string };
  if (!body.documentId) {
    return NextResponse.json({ error: "documentId required" }, { status: 400 });
  }

  const { data: doc, error: lookupErr } = await supabase
    .from("documents")
    .select("id, filename, file_type, storage_path")
    .eq("id", body.documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (lookupErr || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const result = await ingestUserDocument(supabase, user.id, doc);
  return NextResponse.json(result);
}
