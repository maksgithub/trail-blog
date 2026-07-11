-- ============================================
-- Trail Blog: схема бази даних для Supabase
-- Виконати в Supabase Dashboard -> SQL Editor
-- ============================================

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_uk text not null,
  title_en text,
  excerpt_uk text,
  excerpt_en text,
  content_uk text,
  content_en text,
  category text not null default 'hike' check (category in ('hike','bike','camp','other')),
  days int,
  distance_km numeric,
  route jsonb,          -- [[lat,lng], ...]
  waypoints jsonb,      -- [{lat,lng,title,photo_url}]
  photos jsonb default '[]'::jsonb, -- [{url,caption}]
  cover_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 50),
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  fingerprint text not null,
  created_at timestamptz not null default now(),
  unique (post_id, fingerprint)
);

-- ============ RLS ============
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;

-- Пости: всі бачать опубліковані, адмін (будь-який залогінений) — все
create policy "public read published posts" on posts
  for select using (published or auth.role() = 'authenticated');
create policy "admin insert posts" on posts
  for insert with check (auth.role() = 'authenticated');
create policy "admin update posts" on posts
  for update using (auth.role() = 'authenticated');
create policy "admin delete posts" on posts
  for delete using (auth.role() = 'authenticated');

-- Коментарі: читають усі, пишуть усі (без реєстрації), видаляє адмін
create policy "public read comments" on comments
  for select using (true);
create policy "public insert comments" on comments
  for insert with check (true);
create policy "admin delete comments" on comments
  for delete using (auth.role() = 'authenticated');

-- Лайки: читають усі, ставлять усі
create policy "public read likes" on likes
  for select using (true);
create policy "public insert likes" on likes
  for insert with check (true);

-- Тогл лайка (постав/забери) без права масового видалення
create or replace function toggle_like(p_post_id uuid, p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  existing uuid;
begin
  select id into existing from likes
    where post_id = p_post_id and fingerprint = p_fingerprint;
  if existing is not null then
    delete from likes where id = existing;
    return false; -- лайк знято
  else
    insert into likes (post_id, fingerprint) values (p_post_id, p_fingerprint);
    return true; -- лайк поставлено
  end if;
end;
$$;

grant execute on function toggle_like(uuid, text) to anon, authenticated;

-- ============ Storage: бакет для фото ============
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'photos');
create policy "admin upload photos" on storage.objects
  for insert with check (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "admin update photos" on storage.objects
  for update using (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "admin delete photos" on storage.objects
  for delete using (bucket_id = 'photos' and auth.role() = 'authenticated');
