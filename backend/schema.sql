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

-- Stripe billing — safe to re-run against an existing table.
alter table users add column if not exists stripe_customer_id text;
alter table users add column if not exists stripe_subscription_id text;

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
