-- Enchanted Bookshop V4 — Series Brain sync upgrade
create table if not exists public.enchanted_series (
 id text primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 data jsonb not null,
 updated_at timestamptz not null default now(),
 deleted boolean not null default false
);
create index if not exists enchanted_series_user_id_idx on public.enchanted_series(user_id);
alter table public.enchanted_series enable row level security;
drop policy if exists "Users can read own enchanted series" on public.enchanted_series;
create policy "Users can read own enchanted series" on public.enchanted_series for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own enchanted series" on public.enchanted_series;
create policy "Users can insert own enchanted series" on public.enchanted_series for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own enchanted series" on public.enchanted_series;
create policy "Users can update own enchanted series" on public.enchanted_series for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own enchanted series" on public.enchanted_series;
create policy "Users can delete own enchanted series" on public.enchanted_series for delete using (auth.uid() = user_id);
grant select, insert, update, delete on table public.enchanted_series to authenticated;
