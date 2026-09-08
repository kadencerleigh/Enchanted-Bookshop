-- Enchanted Bookshop V4.7.11 — Work Intelligence Sync
-- Run ONCE in Supabase SQL Editor before using V4.7.11 sync.

create table if not exists public.enchanted_work_intelligence (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false
);

alter table public.enchanted_work_intelligence enable row level security;

drop policy if exists "work_intel_select_own" on public.enchanted_work_intelligence;
create policy "work_intel_select_own" on public.enchanted_work_intelligence
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "work_intel_insert_own" on public.enchanted_work_intelligence;
create policy "work_intel_insert_own" on public.enchanted_work_intelligence
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "work_intel_update_own" on public.enchanted_work_intelligence;
create policy "work_intel_update_own" on public.enchanted_work_intelligence
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "work_intel_delete_own" on public.enchanted_work_intelligence;
create policy "work_intel_delete_own" on public.enchanted_work_intelligence
for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on table public.enchanted_work_intelligence to authenticated;
