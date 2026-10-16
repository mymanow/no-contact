-- No Contact clone — migration 0001_init
-- Supabase Postgres. Toutes les heures en timestamptz (UTC). Accès : RLS partout.
-- Tables utilisateur : policy owner = auth.uid(). Tables de contenu : lecture pour tout utilisateur connecté, écriture service_role.

create extension if not exists pgcrypto;
create extension if not exists pg_cron;

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- profils & histoire
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',            -- IANA, mis à jour par l'app à chaque ouverture
  locale text not null default 'en',
  checkin_reminder_local time default '21:00',     -- heure locale du rappel
  coach_tone text not null default 'gentle' check (coach_tone in ('gentle','tough')),
  app_lock_enabled boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.relationship_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  breakup_type text check (breakup_type in ('breakup','situationship','toxic','divorce','on_off','other')),
  relationship_length text check (relationship_length in ('lt_3m','3_12m','1_3y','3_10y','gt_10y')),
  who_ended text check (who_ended in ('me','them','mutual','unclear')),
  ended_on date,
  ex_nickname text,                                -- jamais le vrai nom requis
  shared_obligations text[] not null default '{}', -- 'kids','work','lease','none'
  story_notes text,
  coach_summary text,                              -- résumé maintenu par le coach (mémoire longue)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pacte & compteur
-- ---------------------------------------------------------------------------
create table public.pledges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_days int not null default 30 check (goal_days between 1 and 3650),
  rules jsonb not null default '{}',               -- {"block_number":true,"no_social_checking":true,"exceptions":["kids"]}
  status text not null default 'active' check (status in ('active','completed','abandoned')),
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index pledges_one_active_per_user on public.pledges (user_id) where status = 'active';
create index on public.pledges (user_id, created_at desc);

create table public.streak_attempts (
  id uuid primary key default gen_random_uuid(),
  pledge_id uuid not null references public.pledges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  end_reason text check (end_reason in ('relapse','completed','pledge_changed')),
  relapse_kind text check (relapse_kind in ('texted','called','met','replied','social_stalking','other')),
  reflection jsonb not null default '{}',          -- réponses de Reset & Reflect
  created_at timestamptz not null default now(),
  constraint ended_after_start check (ended_at is null or ended_at >= started_at),
  constraint reason_when_ended check ((ended_at is null) = (end_reason is null))
);
create unique index streak_one_open_per_pledge on public.streak_attempts (pledge_id) where ended_at is null;
create index on public.streak_attempts (user_id, started_at desc);

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_date date not null,                        -- date dans le fuseau de l'utilisateur au moment du check-in
  mood smallint not null check (mood between 1 and 5),
  urge_level smallint not null check (urge_level between 0 and 10),
  triggers text[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, local_date)
);

create table public.milestones_earned (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  streak_attempt_id uuid not null references public.streak_attempts(id) on delete cascade,
  days int not null check (days > 0),
  earned_at timestamptz not null default now(),
  unique (streak_attempt_id, days)
);
create index on public.milestones_earned (user_id, earned_at desc);

-- ---------------------------------------------------------------------------
-- panic
-- ---------------------------------------------------------------------------
create table public.panic_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  entry_point text not null default 'button' check (entry_point in ('button','notification','widget','checkin','coach')),
  tools_used text[] not null default '{}',
  urge_before smallint check (urge_before between 0 and 10),
  urge_after smallint check (urge_after between 0 and 10),
  outcome text check (outcome in ('resisted','relapsed','unknown')),
  client_id uuid unique                            -- idempotence pour la sync offline
);
create index on public.panic_sessions (user_id, started_at desc);

-- ---------------------------------------------------------------------------
-- contre-nostalgie
-- ---------------------------------------------------------------------------
create table public.red_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'red_flag' check (kind in ('red_flag','dealbreaker','ick','reason')),
  body text not null check (length(body) between 1 and 2000),
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.red_flags (user_id, kind, position);

create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('screenshot','photo','video','voice','text')),
  storage_path text,                               -- vault/{user_id}/{id}.{ext}, bucket privé
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes <= 104857600),
  duration_ms int,
  caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_has_file check (media_type = 'text' or storage_path is not null)
);
create index on public.vault_items (user_id, created_at desc);

create table public.unsent_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) between 1 and 10000),
  skin text not null default 'default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.unsent_messages (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- coach IA
-- ---------------------------------------------------------------------------
create table public.coach_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tone text not null check (tone in ('gentle','tough')),
  origin text not null default 'tab' check (origin in ('tab','panic','unsent','checkin','analysis')),
  title text,
  last_message_at timestamptz,
  summarized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.coach_threads (user_id, last_message_at desc);

create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.coach_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system_notice')),
  content text not null,
  audio_path text,
  safety_flag text check (safety_flag in ('crisis','abuse','none')) default 'none',
  input_tokens int,
  output_tokens int,
  client_id uuid unique,                           -- idempotence : double envoi = un seul message
  created_at timestamptz not null default now()
);
create index on public.coach_messages (thread_id, created_at);
create index on public.coach_messages (user_id, created_at desc);

create table public.ai_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  coach_messages int not null default 0,
  analyses int not null default 0,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  primary key (user_id, usage_date)
);

create table public.conversation_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('screenshot','paste','import')),
  input_storage_path text,                         -- supprimé après analyse sauf si l'utilisateur garde
  input_excerpt text,
  status text not null default 'pending' check (status in ('pending','done','failed')),
  result jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.conversation_analyses (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- se soigner : journal, outils, articles, programmes, défis (contenu = service_role)
-- ---------------------------------------------------------------------------
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text,
  body text not null,
  mood smallint check (mood between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.journal_entries (user_id, created_at desc);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  need text not null check (need in ('calm','ground','release','distract','sleep','urge')),
  kind text not null check (kind in ('breathing','grounding','somatic','affirmation','audio','video','prompt')),
  title jsonb not null,                            -- {"en":"...","fr":"..."}
  config jsonb not null default '{}',              -- rythme de respiration, durée, asset
  is_premium boolean not null default false,
  available_offline boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.tools (need, position);

create table public.tool_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, tool_id)
);
create index on public.tool_favorites (tool_id);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  locale text not null default 'en',
  title text not null,
  body_md text not null,
  tags text[] not null default '{}',
  reading_minutes smallint,
  is_premium boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.articles using gin (tags);
create index on public.articles (locale, published_at desc);

create table public.article_reads (
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, article_id)
);
create index on public.article_reads (article_id);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null,
  stage text not null check (stage in ('shock','withdrawal','anger','reflection','rebuild')),
  is_premium boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.program_steps (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  day_index int not null check (day_index >= 0),
  kind text not null check (kind in ('read','tool','journal','action','checkin')),
  ref_id uuid,                                     -- article, tool… selon kind
  title jsonb not null,
  unique (program_id, day_index, kind)
);
create index on public.program_steps (program_id, day_index);

create table public.program_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete restrict,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, program_id)
);
create index on public.program_enrollments (program_id);

create table public.step_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  step_id uuid not null references public.program_steps(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, step_id)
);
create index on public.step_completions (step_id);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null,
  target int not null check (target > 0),
  metric text not null check (metric in ('checkins','panic_resisted','journal','tools','days')),
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.challenge_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  progress int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, challenge_id)
);
create index on public.challenge_progress (challenge_id);

-- ---------------------------------------------------------------------------
-- abonnements, consentements, push, webhooks
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  entitlement text not null default 'premium',
  product_id text,
  store text check (store in ('app_store','play_store','promotional')),
  period text check (period in ('weekly','monthly','quarterly','yearly','lifetime')),
  status text not null check (status in ('trialing','active','grace','billing_issue','cancelled','expired')),
  expires_at timestamptz,
  rc_app_user_id text,
  updated_at timestamptz not null default now()
);
create index on public.subscriptions (status, expires_at);

create table public.webhook_events (
  id text primary key,                             -- id d'événement RevenueCat : un doublon = conflit = ignoré
  source text not null check (source in ('revenuecat')),
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create table public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null check (consent_type in ('terms','privacy','ai_processing','analytics','sensitive_data')),
  version text not null,
  granted boolean not null,
  created_at timestamptz not null default now(),
  unique (user_id, consent_type, version)
);

create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expo_token text not null unique,
  platform text not null check (platform in ('ios','android')),
  last_seen_at timestamptz not null default now()
);
create index on public.push_tokens (user_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profiles','relationship_stories','pledges','check_ins','red_flags','vault_items',
    'unsent_messages','coach_threads','conversation_analyses','journal_entries','tools','articles'] loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- profil créé à l'inscription (y compris anonyme)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  -- tables possédées : l'utilisateur lit/écrit ses lignes
  foreach t in array array['relationship_stories','pledges','check_ins','panic_sessions','red_flags','vault_items',
    'unsent_messages','coach_threads','journal_entries','tool_favorites','article_reads',
    'program_enrollments','step_completions','challenge_progress','push_tokens','user_consents'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy owner_all on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;

  -- lecture seule pour l'utilisateur, écriture par fonctions serveur (service_role / security definer)
  foreach t in array array['streak_attempts','milestones_earned','coach_messages','conversation_analyses',
    'ai_usage_daily','subscriptions'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy owner_read on public.%I for select to authenticated using (user_id = auth.uid())', t);
  end loop;

  -- contenu : lecture pour tout utilisateur connecté
  foreach t in array array['tools','articles','programs','program_steps','challenges'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy content_read on public.%I for select to authenticated using (true)', t);
  end loop;
end $$;

alter table public.profiles enable row level security;
create policy profile_owner on public.profiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

alter table public.webhook_events enable row level security;   -- aucune policy : service_role uniquement

-- le pacte n'est pas modifiable en direct sur status (passe par les RPC)
revoke update (status) on public.pledges from authenticated;

-- ---------------------------------------------------------------------------
-- RPC : transitions d'état atomiques
-- ---------------------------------------------------------------------------
create or replace function public.has_premium(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = uid and status in ('trialing','active','grace','billing_issue')
      and (expires_at is null or expires_at > now())
  );
$$;

create or replace function public.start_pledge(p_goal_days int, p_rules jsonb, p_started_at timestamptz default now())
returns uuid language plpgsql security definer set search_path = public as $$
declare v_pledge uuid; v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_started_at > now() + interval '5 minutes' or p_started_at < now() - interval '365 days' then
    raise exception 'invalid start date';
  end if;
  -- un nouveau pacte remplace l'ancien
  update public.streak_attempts sa set ended_at = now(), end_reason = 'pledge_changed'
    from public.pledges p
    where sa.pledge_id = p.id and p.user_id = v_uid and p.status = 'active' and sa.ended_at is null;
  update public.pledges set status = 'abandoned' where user_id = v_uid and status = 'active';

  insert into public.pledges (user_id, goal_days, rules) values (v_uid, p_goal_days, coalesce(p_rules, '{}'))
    returning id into v_pledge;
  insert into public.streak_attempts (pledge_id, user_id, started_at) values (v_pledge, v_uid, p_started_at);
  return v_pledge;
end $$;

-- Reset & Reflect : ferme la tentative en cours, en ouvre une nouvelle, garde l'historique.
create or replace function public.record_relapse(p_kind text, p_reflection jsonb, p_happened_at timestamptz default now())
returns uuid language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_pledge uuid; v_attempt uuid; v_new uuid;
begin
  select p.id into v_pledge from public.pledges p where p.user_id = v_uid and p.status = 'active' for update;
  if v_pledge is null then raise exception 'no active pledge'; end if;

  select id into v_attempt from public.streak_attempts
    where pledge_id = v_pledge and ended_at is null for update;
  if v_attempt is null then raise exception 'no open streak'; end if;

  update public.streak_attempts
    set ended_at = greatest(started_at, least(p_happened_at, now())),
        end_reason = 'relapse', relapse_kind = p_kind, reflection = coalesce(p_reflection, '{}')
    where id = v_attempt;

  insert into public.streak_attempts (pledge_id, user_id, started_at)
    values (v_pledge, v_uid, now()) returning id into v_new;
  return v_new;
end $$;

grant execute on function public.start_pledge(int, jsonb, timestamptz) to authenticated;
grant execute on function public.record_relapse(text, jsonb, timestamptz) to authenticated;
grant execute on function public.has_premium(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- stockage : bucket privé "vault" et "analysis-inputs", chemins {user_id}/...
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('vault', 'vault', false, 104857600), ('analysis-inputs', 'analysis-inputs', false, 20971520)
on conflict (id) do nothing;

create policy vault_owner on storage.objects for all to authenticated
  using (bucket_id in ('vault','analysis-inputs') and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id in ('vault','analysis-inputs') and (storage.foldername(name))[1] = auth.uid()::text);
