alter table public.profiles
  add column if not exists s2s_voice_id text,
  add column if not exists voice_clone_count integer not null default 0,
  add column if not exists voice_clone_updated_at timestamptz;
