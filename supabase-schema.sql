begin;
create extension if not exists pgcrypto;
create extension if not exists citext;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now(); return new; end $$;

create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 username citext not null unique check(char_length(username::text) between 3 and 30),
 display_name text not null check(char_length(display_name) between 1 and 80),
 bio text not null default '' check(char_length(bio)<=300),
 site_url text, avatar_url text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
declare u text; n text;
begin
 u:=regexp_replace(lower(coalesce(nullif(new.raw_user_meta_data->>'username',''),split_part(new.email,'@',1))),'[^a-z0-9_]','','g');
 if char_length(u)<3 then u:='dino_'||left(replace(new.id::text,'-',''),8); end if;
 if exists(select 1 from public.profiles where username=u) then u:=left(u,21)||'_'||left(replace(new.id::text,'-',''),8); end if;
 n:=coalesce(nullif(new.raw_user_meta_data->>'display_name',''),u);
 insert into public.profiles(id,username,display_name) values(new.id,u,left(n,80)); return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create table if not exists public.posts(
 id uuid primary key default gen_random_uuid(), author_id uuid not null references public.profiles(id) on delete cascade,
 category text not null check(category in('Ideia','Pergunta','Descoberta','Estou criando','Preciso de ajuda')),
 title text not null check(char_length(title) between 1 and 160), description text not null check(char_length(description) between 1 and 5000),
 link_url text, pinned boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists posts_feed_idx on public.posts(pinned desc,created_at desc);
create index if not exists posts_category_idx on public.posts(category,created_at desc);
drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts for each row execute function public.set_updated_at();

create table if not exists public.comments(
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade,
 author_id uuid not null references public.profiles(id) on delete cascade, content text not null check(char_length(content) between 1 and 1000),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments(post_id,created_at);
drop trigger if exists comments_updated_at on public.comments;
create trigger comments_updated_at before update on public.comments for each row execute function public.set_updated_at();

create table if not exists public.saved_posts(
 user_id uuid not null references public.profiles(id) on delete cascade, post_id uuid not null references public.posts(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(user_id,post_id)
);

create table if not exists public.community_memberships(
 community_slug text not null check(community_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
 user_id uuid not null references public.profiles(id) on delete cascade,
 joined_at timestamptz not null default now(), primary key(community_slug,user_id)
);
create table if not exists public.community_interests(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 community_name text not null check(char_length(community_name) between 3 and 80),
 purpose text not null check(char_length(purpose) between 10 and 500),
 topics text[] not null check(cardinality(topics) between 1 and 5),
 status text not null default 'received' check(status in('received','reviewing','planned','declined')),
 created_at timestamptz not null default now()
);
create unique index if not exists community_interests_user_name_idx on public.community_interests(user_id,lower(community_name));

alter table public.profiles enable row level security; alter table public.posts enable row level security;
alter table public.comments enable row level security; alter table public.saved_posts enable row level security;
alter table public.community_memberships enable row level security; alter table public.community_interests enable row level security;
create policy profiles_read on public.profiles for select to authenticated using(true);
create policy profiles_update_own on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy posts_read on public.posts for select to authenticated using(true);
create policy posts_insert_own on public.posts for insert to authenticated with check(author_id=auth.uid() and pinned=false);
create policy posts_update_own on public.posts for update to authenticated using(author_id=auth.uid()) with check(author_id=auth.uid() and pinned=false);
create policy posts_delete_own on public.posts for delete to authenticated using(author_id=auth.uid());
create policy comments_read on public.comments for select to authenticated using(true);
create policy comments_insert_own on public.comments for insert to authenticated with check(author_id=auth.uid());
create policy comments_delete_own on public.comments for delete to authenticated using(author_id=auth.uid());
create policy saved_read_own on public.saved_posts for select to authenticated using(user_id=auth.uid());
create policy saved_insert_own on public.saved_posts for insert to authenticated with check(user_id=auth.uid());
create policy saved_delete_own on public.saved_posts for delete to authenticated using(user_id=auth.uid());
create policy community_memberships_read_own on public.community_memberships for select to authenticated using(user_id=auth.uid());
create policy community_memberships_insert_own on public.community_memberships for insert to authenticated with check(user_id=auth.uid());
create policy community_memberships_delete_own on public.community_memberships for delete to authenticated using(user_id=auth.uid());
create policy community_interests_read_own on public.community_interests for select to authenticated using(user_id=auth.uid());
create policy community_interests_insert_own on public.community_interests for insert to authenticated with check(user_id=auth.uid());
create or replace function public.community_member_count(requested_slug text) returns bigint language sql stable security definer set search_path='' as $$
 select count(*) from public.community_memberships where community_slug=requested_slug;
$$;
revoke all on function public.community_member_count(text) from public;
grant execute on function public.community_member_count(text) to anon,authenticated;
grant usage on schema public to anon,authenticated; grant select on public.profiles,public.posts,public.comments to authenticated;
grant update on public.profiles to authenticated; grant insert,update,delete on public.posts to authenticated;
grant insert,delete on public.comments to authenticated; grant select,insert,delete on public.saved_posts to authenticated;
grant select,insert,delete on public.community_memberships to authenticated; grant select,insert on public.community_interests to authenticated;
commit;
