alter table public.profiles
  add column if not exists customer_portal_url text;
