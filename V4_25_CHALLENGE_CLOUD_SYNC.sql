-- Enchanted Bookshop V4.25 — Reading Challenge Cloud Sync
-- Run ONCE in Supabase SQL Editor before using V4.25 cloud sync.

create table if not exists public.enchanted_reading_challenges (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false
);

create index if not exists enchanted_reading_challenges_user_id_idx
  on public.enchanted_reading_challenges(user_id);

alter table public.enchanted_reading_challenges enable row level security;

drop policy if exists "challenge_select_own" on public.enchanted_reading_challenges;
create policy "challenge_select_own" on public.enchanted_reading_challenges
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "challenge_insert_own" on public.enchanted_reading_challenges;
create policy "challenge_insert_own" on public.enchanted_reading_challenges
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "challenge_update_own" on public.enchanted_reading_challenges;
create policy "challenge_update_own" on public.enchanted_reading_challenges
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "challenge_delete_own" on public.enchanted_reading_challenges;
create policy "challenge_delete_own" on public.enchanted_reading_challenges
for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on table public.enchanted_reading_challenges to authenticated;
