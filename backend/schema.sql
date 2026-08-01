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
