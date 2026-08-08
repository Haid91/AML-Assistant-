-- Run this once in the Supabase SQL editor (or via psql) before starting the backend.

create table if not exists users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  premium boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists program_drafts (
  id uuid primary key,
  user_id uuid not null unique references users(id),
  business_name text,
  intake jsonb not null,
  draft_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  token uuid primary key,
  email text not null,
  created_at timestamptz not null default now()
);

-- Separate from program_drafts (which is one-row-per-user) so a user can
-- have both an AML/CTF Program draft and a Privacy Pack draft at once.
create table if not exists privacy_drafts (
  id uuid primary key,
  user_id uuid not null unique references users(id),
  business_name text,
  intake jsonb not null,
  draft_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Append-only — one row per attempt, unlike the *_drafts tables above which
-- are one-row-per-user — so a user's score history over multiple retakes
-- can be shown.
create table if not exists mock_exam_attempts (
  id uuid primary key,
  user_id uuid not null references users(id),
  score integer not null,
  total integer not null,
  passed boolean not null,
  chapter_breakdown jsonb,
  created_at timestamptz not null default now()
);

-- One row per user — tracks the recurring Tranche 2 compliance obligations
-- (program/risk-assessment review, independent evaluation, staff training,
-- privacy policy review, and which financial year's Annual Compliance
-- Report has been lodged) rather than one-time generated documents.
create table if not exists compliance_checklist (
  id uuid primary key,
  user_id uuid not null unique references users(id),
  program_review_date date,
  independent_eval_date date,
  staff_training_date date,
  privacy_review_date date,
  acr_lodged_year integer,
  updated_at timestamptz not null default now()
);

-- Multiple rows per user — an ongoing client risk-tracking register.
-- Deliberately metadata-only: no fields for names, DOB, ID numbers, or
-- addresses, so AmlIntel never becomes a holder of its subscribers'
-- clients' identifying CDD data. reference_label is free text the
-- business chooses (a matter number, initials, whatever they're
-- comfortable with) — the UI warns against entering identity documents.
create table if not exists client_risk_entries (
  id uuid primary key,
  user_id uuid not null references users(id),
  reference_label text not null,
  risk_rating text not null,
  cdd_type text not null,
  onboarded_date date,
  last_review_date date,
  next_review_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Added after client_risk_entries already existed in production — the
-- create-table-if-not-exists above won't backfill new columns onto an
-- existing table, so this needs its own explicit alter (same pattern as
-- the stripe_customer_id/stripe_subscription_id columns above).
alter table client_risk_entries add column if not exists case_status text not null default 'none';

-- Append-only investigation log per client_risk_entries row — distinct from
-- that table's own free-text `notes` (a mutable one-line summary). Each row
-- here is a timestamped, deletable-but-not-editable entry, so a firm can
-- show "here's what we did and when" rather than an overwritable note.
-- user_id is denormalized from the parent entry (same pattern as
-- sanctions_watchlist below) so ownership checks stay a single-table filter.
create table if not exists client_risk_case_notes (
  id uuid primary key,
  entry_id uuid not null references client_risk_entries(id) on delete cascade,
  user_id uuid not null references users(id),
  note text not null,
  created_at timestamptz not null default now()
);
create index if not exists client_risk_case_notes_entry_idx on client_risk_case_notes (entry_id);

-- Multiple rows per user — synced AI Assistant chat sessions, replacing
-- localStorage-only history so it survives clearing browser data or
-- switching devices.
create table if not exists chat_sessions (
  id uuid primary key,
  user_id uuid not null references users(id),
  title text not null,
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Append-only — a parallel history log for program_drafts/privacy_drafts,
-- which remain one-row-per-user "current" pointers. Every successful
-- /program-draft or /privacy-draft generation also inserts a row here so
-- prior versions aren't lost when a draft is regenerated.
create table if not exists document_versions (
  id uuid primary key,
  user_id uuid not null references users(id),
  doc_type text not null,
  business_name text,
  intake jsonb not null,
  draft_text text,
  created_at timestamptz not null default now()
);

-- Stripe billing — safe to re-run against an existing table.
alter table users add column if not exists stripe_customer_id text;
alter table users add column if not exists stripe_subscription_id text;
-- Which priced tier the user's active Stripe subscription is on (e.g.
-- 'premium' | 'professional') — null means never determined (pre-dates this
-- column, or never subscribed via Stripe at all, e.g. the PREMIUM_EMAILS
-- owner override). Only ever set from the Stripe webhook, derived from the
-- subscription's actual price, so it can't drift from what was really paid.
alter table users add column if not exists plan text;

-- Periodically refreshed local copies of public government sanctions lists
-- (DFAT Consolidated List, OFAC SDN List) for the Sanctions Screening tool.
-- Not one-row-per-user — a shared reference dataset the backend repopulates
-- on a schedule (see backend/sanctions.js). Each refresh fully replaces the
-- rows for its source in one transaction so a failed fetch never leaves a
-- half-updated list in place.
create extension if not exists pg_trgm;

create table if not exists sanctions_entries (
  id uuid primary key,
  source text not null, -- 'dfat' | 'ofac'
  entry_type text not null, -- 'individual' | 'entity' | 'vessel'
  primary_name text not null,
  aliases jsonb not null default '[]',
  aliases_text text not null default '', -- flattened aliases for trigram search
  dob text,
  nationality text,
  program_or_reference text,
  raw jsonb not null,
  list_updated_at timestamptz,
  fetched_at timestamptz not null default now()
);

create index if not exists sanctions_entries_name_trgm on sanctions_entries using gin (primary_name gin_trgm_ops);
create index if not exists sanctions_entries_aliases_trgm on sanctions_entries using gin (aliases_text gin_trgm_ops);
create index if not exists sanctions_entries_source_idx on sanctions_entries (source);

-- Append-only — one row per Anthropic API call, so real Claude API spend per
-- subscriber can be measured instead of estimated. Stores raw token counts
-- rather than a precomputed dollar cost, since Anthropic's per-token pricing
-- can change — cost is derived at query time (see getAiUsageSummary in
-- db.js) so historical rows stay accurate if the rate constants are updated.
create table if not exists ai_usage_log (
  id uuid primary key,
  user_id uuid not null references users(id),
  route text not null, -- 'chat' | 'program-draft' | 'privacy-draft' | 'smr-draft'
  model text not null,
  input_tokens integer not null,
  output_tokens integer not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_usage_log_user_idx on ai_usage_log (user_id);
create index if not exists ai_usage_log_created_idx on ai_usage_log (created_at);

-- Explicit opt-in extension of Sanctions Screening — unlike
-- client_risk_entries (deliberately metadata-only, no real names), this
-- table DOES store a real name, because the user explicitly chose "keep
-- monitoring this" after a one-off screen already required entering it.
-- Re-checked against refreshed sanctions data on the same cycle as
-- sanctions_entries; last_match_count lets the refresh job detect a NEW
-- hit (count increased) rather than re-alerting on an already-known match.
create table if not exists sanctions_watchlist (
  id uuid primary key,
  user_id uuid not null references users(id),
  name text not null,
  notes text,
  last_match_count integer not null default 0,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists sanctions_watchlist_user_idx on sanctions_watchlist (user_id);

-- These tables are only ever accessed via the backend's direct Postgres
-- connection (connects as the table-owning role, which bypasses RLS
-- regardless of policies) — never via Supabase's PostgREST Data API. RLS is
-- enabled with no policies specifically so that API is fully deny-by-default,
-- closing off a public data-exposure path this app never intended to use.
alter table users enable row level security;
alter table program_drafts enable row level security;
alter table sessions enable row level security;
alter table privacy_drafts enable row level security;
alter table mock_exam_attempts enable row level security;
alter table compliance_checklist enable row level security;
alter table client_risk_entries enable row level security;
alter table client_risk_case_notes enable row level security;
alter table chat_sessions enable row level security;
alter table ai_usage_log enable row level security;
alter table sanctions_watchlist enable row level security;
alter table document_versions enable row level security;
alter table sanctions_entries enable row level security;
