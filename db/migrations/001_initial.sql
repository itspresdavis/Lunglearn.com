-- Lung Learn relational schema. Not applied to any hosted database.
-- Row-level security comments describe the policy to enable when this moves to Supabase.
-- The running application uses the file store in src/server/store.ts until DATABASE_URL is wired.

create table users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('learner', 'admin', 'editor', 'reviewer', 'support')),
  mfa_secret bytea,
  mfa_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table sessions (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  mfa_until timestamptz
);
create index sessions_user_id_idx on sessions(user_id);

create table subscriptions (
  id text primary key,
  user_id text not null unique references users(id) on delete cascade,
  plan text not null check (plan in ('student', 'standard', 'institutional')),
  status text not null check (status in ('active', 'past_due', 'canceled', 'incomplete')),
  price_cents integer not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  period_ends_at timestamptz,
  standard_price_consent_at timestamptz,
  verification_status text not null
);
create index subscriptions_status_idx on subscriptions(status);

create table verifications (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  method text not null check (method in ('document', 'attestation')),
  status text not null,
  enrollment_start date,
  enrollment_end date,
  evidence_has_dates boolean not null,
  reviewer_id text references users(id),
  decided_at timestamptz,
  delete_after timestamptz,
  ciphertext_removed boolean not null default false,
  file_kind text,
  note text not null default '',
  created_at timestamptz not null default now()
);
-- Document bytes stay in private object storage, never in this table and never in a public bucket.

create table audits (
  id text primary key,
  at timestamptz not null,
  actor_id text,
  action text not null,
  detail text not null
);
create index audits_at_idx on audits(at);

create table reports (
  id text primary key,
  at timestamptz not null,
  href text not null,
  message text not null,
  user_id text,
  status text not null
);

create table notes (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  title text not null,
  body text not null,
  updated_at timestamptz not null
);

create table bookmarks (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  href text not null,
  title text not null
);

create table flashcards (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  front text not null,
  back text not null,
  source_href text,
  ease numeric not null,
  interval_days integer not null,
  repetitions integer not null,
  due_on date not null
);
create index flashcards_due_idx on flashcards(user_id, due_on);

create table progress (
  user_id text not null references users(id) on delete cascade,
  lesson_slug text not null,
  completed_at timestamptz not null,
  primary key (user_id, lesson_slug)
);

create table classrooms (
  id text primary key,
  owner_id text not null references users(id),
  name text not null,
  code text not null unique
);

create table enrollments (
  classroom_id text not null references classrooms(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  primary key (classroom_id, user_id)
);

create table assignments (
  id text primary key,
  classroom_id text not null references classrooms(id) on delete cascade,
  title text not null,
  href text not null,
  due_on date
);

create table inquiries (
  id text primary key,
  organization text not null,
  email text not null,
  seats integer not null,
  note text not null,
  at timestamptz not null
);

create table expenses (
  id text primary key,
  category text not null,
  cents integer not null,
  note text not null,
  actual boolean not null
);

create table stripe_events (
  id text primary key
);

create table anatomical_structures (
  id text primary key,
  name text not null,
  fma text,
  uberon text,
  sex text not null,
  mesh_name text,
  layers text[] not null,
  editorial_status text not null
);
create index anatomical_structures_name_idx on anatomical_structures(name);

-- Enable row-level security on every user-owned table before exposing the database
-- through a browser client. Suggested policies:
-- notes, bookmarks, flashcards, progress: user_id = auth.uid()
-- verifications: user can insert own row; only reviewer role can select file metadata
-- subscriptions: user can select own row; service role updates from the webhook
-- audits, expenses, stripe_events: service role only
