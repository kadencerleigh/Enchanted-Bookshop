-- Enchanted Bookshop V3 sync table
-- Run this once in the Supabase SQL Editor.

create table if not exists public.enchanted_books (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false
);

create index if not exists enchanted_books_user_id_idx
  on public.enchanted_books(user_id);

alter table public.enchanted_books enable row level security;

drop policy if exists "Users can read own enchanted books" on public.enchanted_books;
create policy "Users can read own enchanted books"
on public.enchanted_books for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own enchanted books" on public.enchanted_books;
create policy "Users can insert own enchanted books"
on public.enchanted_books for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own enchanted books" on public.enchanted_books;
create policy "Users can update own enchanted books"
on public.enchanted_books for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own enchanted books" on public.enchanted_books;
create policy "Users can delete own enchanted books"
on public.enchanted_books for delete
using (auth.uid() = user_id);
