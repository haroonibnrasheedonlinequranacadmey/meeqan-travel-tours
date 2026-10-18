-- Meeqan Travel & Tours CRM — Phase 1 core schema
-- Run only after reviewing in Supabase SQL Editor. This script is designed for a fresh project.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'agent' check (role in ('admin','manager','agent','finance','read_only')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.current_user_role() returns text language sql stable security definer set search_path=public as $$ select role from public.profiles where id=auth.uid() and is_active=true $$;
create or replace function public.is_crm_staff() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and is_active=true) $$;
alter table public.profiles enable row level security;
drop policy if exists "Staff can read profiles" on public.profiles;
create policy "Staff can read profiles" on public.profiles for select to authenticated using (public.is_crm_staff());
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');
