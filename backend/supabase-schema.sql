-- TagalogDrama production schema for Supabase/Postgres.
-- Run this in the Supabase SQL Editor after creating a project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.series (
  id text primary key,
  title text not null,
  description text,
  genre text[] not null default '{}',
  tag text,
  created_at timestamptz not null default now()
);

create table if not exists public.episodes (
  id text primary key,
  series_id text not null references public.series(id) on delete cascade,
  episode_number integer not null,
  title text not null,
  access_type text not null check (access_type in ('free_ad','subscription')),
  video_asset_id text,
  duration_seconds integer,
  created_at timestamptz not null default now(),
  unique(series_id, episode_number)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('daily','weekly','monthly')),
  status text not null check (status in ('incomplete','active','past_due','unpaid','cancelled','expired')),
  provider text not null default 'paymongo',
  provider_subscription_id text unique,
  provider_checkout_session_id text unique,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null default 'paymongo',
  provider_checkout_session_id text unique,
  provider_payment_id text unique,
  reference_number text,
  plan text not null check (plan in ('daily','weekly','monthly')),
  amount_centavos bigint not null check (amount_centavos > 0),
  currency text not null default 'PHP',
  livemode boolean not null default false,
  status text not null check (status in ('paid','failed','refunded','pending')),
  paid_at timestamptz,
  raw_event_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_webhook_events (
  event_id text primary key,
  event_type text not null,
  livemode boolean not null,
  provider text not null default 'paymongo',
  status text not null default 'received' check (status in ('received','processed','ignored','failed')),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_message text
);

create table if not exists public.watch_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id text not null references public.episodes(id) on delete cascade,
  seconds_watched integer not null default 0 check (seconds_watched >= 0),
  updated_at timestamptz not null default now(),
  primary key(user_id, episode_id)
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id text not null references public.series(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, series_id)
);

create table if not exists public.ad_unlocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id text not null references public.episodes(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key(user_id, episode_id)
);

alter table public.profiles enable row level security;
alter table public.series enable row level security;
alter table public.episodes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.watch_progress enable row level security;
alter table public.favorites enable row level security;
alter table public.ad_unlocks enable row level security;

create policy "public can read series" on public.series for select using (true);
create policy "public can read episodes" on public.episodes for select using (true);
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "users read own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
create policy "users read own payments" on public.payments for select using (auth.uid() = user_id);
create policy "users read own progress" on public.watch_progress for select using (auth.uid() = user_id);
create policy "users write own progress" on public.watch_progress for insert with check (auth.uid() = user_id);
create policy "users update own progress" on public.watch_progress for update using (auth.uid() = user_id);
create policy "users read own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "users add own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "users remove own favorites" on public.favorites for delete using (auth.uid() = user_id);
create policy "users read own ad unlocks" on public.ad_unlocks for select using (auth.uid() = user_id);

create index if not exists episodes_series_idx on public.episodes(series_id, episode_number);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id, status);
create index if not exists progress_user_updated_idx on public.watch_progress(user_id, updated_at desc);
create index if not exists payments_user_created_idx on public.payments(user_id, created_at desc);
create index if not exists payment_events_status_idx on public.payment_webhook_events(status, received_at desc);
