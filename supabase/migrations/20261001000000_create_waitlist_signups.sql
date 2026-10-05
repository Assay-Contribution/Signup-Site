create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'clarity-landing-page',
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_lowercase check (email = lower(email)),
  constraint waitlist_signups_email_unique unique (email)
);

alter table public.waitlist_signups enable row level security;

revoke all on table public.waitlist_signups from anon, authenticated;
grant insert on table public.waitlist_signups to service_role;