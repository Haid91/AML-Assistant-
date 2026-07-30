-- Run this once in the Supabase SQL editor (or via psql) before starting the backend.

create table if not exists users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  premium boolean not null default false,
  created_at timestamptz not null default now()
);
