-- ============================================================================
-- KNOWLEDGE BASE SCHEMA
-- ----------------------------------------------------------------------------
-- Run this ONCE in the Supabase SQL editor. It:
--   1. Enables the pgvector extension
--   2. Creates the document_chunks table
--   3. Creates an IVFFlat index on the embedding column for fast retrieval
--   4. Sets up RLS so user chunks are private (global chunks = user_id NULL)
-- ============================================================================

create extension if not exists vector;

create table if not exists public.document_chunks (
  id            bigserial primary key,
  source        text not null,           -- "global" or "user_upload"
  doc_id        text not null,           -- e.g. "technovision-part1" or a document.id UUID
  doc_title     text,                    -- human-readable title for citations
  user_id       uuid references auth.users(id) on delete cascade,  -- NULL = global
  chunk_index   int not null,
  section       text,                    -- best-effort section heading
  context       text,                    -- contextual retrieval prefix (Haiku-generated)
  content       text not null,           -- the actual chunk text
  embedding     vector(1536),            -- OpenAI text-embedding-3-small
  created_at    timestamptz default now()
);

create index if not exists document_chunks_embedding_idx
  on public.document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists document_chunks_user_id_idx on public.document_chunks(user_id);
create index if not exists document_chunks_doc_id_idx on public.document_chunks(doc_id);

alter table public.document_chunks enable row level security;

drop policy if exists "read global + own chunks" on public.document_chunks;
create policy "read global + own chunks" on public.document_chunks
  for select to authenticated
  using (user_id is null or user_id = auth.uid());

drop policy if exists "insert own chunks" on public.document_chunks;
create policy "insert own chunks" on public.document_chunks
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "delete own chunks" on public.document_chunks;
create policy "delete own chunks" on public.document_chunks
  for delete to authenticated
  using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- RPC: match_document_chunks
-- Hybrid-ready similarity search. Returns top-k chunks by cosine distance,
-- filtered to (global OR user's own chunks). Called from the /api/chat route.
-- ----------------------------------------------------------------------------
create or replace function public.match_document_chunks(
  query_embedding vector(1536),
  match_count int default 8,
  filter_user_id uuid default null
)
returns table (
  id bigint,
  source text,
  doc_id text,
  doc_title text,
  section text,
  context text,
  content text,
  similarity float
)
language sql stable as $$
  select
    c.id,
    c.source,
    c.doc_id,
    c.doc_title,
    c.section,
    c.context,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.document_chunks c
  where c.embedding is not null
    and (c.user_id is null or c.user_id = filter_user_id)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
