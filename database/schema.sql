-- iAB Certificate Generator — Supabase schema
-- Run in the Supabase SQL editor (or psql) in this order:
--   1. schema.sql   2. policies.sql   3. seed.sql
-- migrations.sql re-lists these as ordered migrations for existing projects.

create extension if not exists "pgcrypto";

-- ---------- Roles ----------
create type staff_role as enum ('Administrator', 'Certificate Issuer', 'Viewer');
create type certificate_status as enum ('Draft', 'Issued', 'Superseded', 'Revoked', 'Generation Failed');
create type certificate_event_type as enum ('Created','Issued','Downloaded','Reprinted','Corrected','Superseded','Revoked','Restored','Generation Failed');

-- ---------- Staff profiles (linked to auth.users) ----------
create table staff_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        staff_role not null default 'Viewer',
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Courses ----------
create table courses (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  official_name text not null,
  aliases       text[] not null default '{}',
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- Learners ----------
create table learners (
  id              uuid primary key default gen_random_uuid(),
  registration_id text not null,
  full_name       text not null,
  first_names     text,
  surname         text,
  id_type         text check (id_type in ('Omang No.', 'Passport No.')),
  id_number       text,          -- ALWAYS text: preserves leading zeros / letters
  email           text,
  telephone       text,
  intake_month    text,          -- 3-letter uppercase code, e.g. MAR
  intake_year     int,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (registration_id, intake_year, intake_month)
);

-- ---------- Import batches ----------
create table import_batches (
  id                    uuid primary key default gen_random_uuid(),
  original_filename     text not null,
  worksheet_name        text,
  row_count             int,
  eligible_count        int,
  blocked_count         int,
  imported_by           uuid references auth.users(id),
  imported_at           timestamptz not null default now(),
  mapping_configuration jsonb,
  import_status         text not null default 'Completed'
);

-- ---------- Reference counters ----------
create table reference_counters (
  id            uuid primary key default gen_random_uuid(),
  course_code   text not null,
  intake_year   int  not null,
  intake_month  text not null,
  last_sequence int  not null default 0,
  updated_at    timestamptz not null default now(),
  unique (course_code, intake_year, intake_month)
);

-- ---------- Certificates ----------
create table certificates (
  id                        uuid primary key default gen_random_uuid(),
  certificate_reference     text not null unique,
  file_safe_reference       text not null,
  base_reference            text not null,
  revision_number           int not null default 0,
  sequence_number           int not null,
  registration_id           text not null,
  learner_id                uuid references learners(id),
  full_name_at_issue        text not null,
  id_type_at_issue          text,
  id_number_at_issue        text,
  course_id                 uuid references courses(id),
  course_code_at_issue      text not null,
  course_name_at_issue      text not null,
  intake_month              text not null,
  intake_year               int not null,
  award_date                date,
  issue_date                date not null,
  generated_at              timestamptz not null default now(),
  formative_mark            numeric,
  original_exam_mark        numeric,
  resit_mark                numeric,
  effective_exam_mark       numeric,
  overall_mark              numeric,
  payment_status            text,
  eligibility_override      boolean not null default false,
  override_reason           text,
  status                    certificate_status not null default 'Draft',
  template_version          text,
  generated_by              uuid references auth.users(id),
  pdf_storage_path          text,
  pdf_hash                  text,
  reprint_count             int not null default 0,
  last_reprinted_at         timestamptz,
  supersedes_certificate_id uuid references certificates(id),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- One ACTIVE certificate per learner+course+intake (Issued only)
create unique index uniq_active_certificate
  on certificates (registration_id, course_code_at_issue, intake_year, intake_month)
  where status = 'Issued';

create index idx_certificates_name on certificates (full_name_at_issue);
create index idx_certificates_reg  on certificates (registration_id);

-- ---------- Certificate events (audit) ----------
create table certificate_events (
  id              uuid primary key default gen_random_uuid(),
  certificate_id  uuid references certificates(id) on delete cascade,
  event_type      certificate_event_type not null,
  performed_by    uuid references auth.users(id),
  event_date      timestamptz not null default now(),
  reason          text,
  previous_values jsonb,
  new_values      jsonb,
  metadata        jsonb
);
create index idx_events_cert on certificate_events (certificate_id, event_date desc);

-- ---------- Application settings (single row) ----------
create table application_settings (
  id                 int primary key default 1 check (id = 1),
  official_name      text not null default 'Insurance Academy of Botswana',
  brand_name         text not null default 'iAB',
  tagline            text not null default 'Study. Learn. Earn.',
  address            text default 'Unit 1, Plot 102, Light Industrial, Commerce Park, Gaborone, Botswana',
  telephone          text default '+267 311 7200',
  email              text default 'info@iab.co.bw',
  website            text default 'https://iab.co.bw',
  company_reg        text default 'BW0000132853',
  bqa_etp            text default 'ETP0198',
  tvet_no            text default 'TVET 000700',
  hrdc_wording       text default 'HRDC ACCREDITED',
  reference_format   text default 'IAB/CERT/{COURSE}/{INTAKE}/{ISSUE_MONTH}/{SEQUENCE}',
  template_version   text default 'CERT-2026-NAVYGOLD-1',
  qr_enabled         boolean default true,
  verify_url         text default 'https://iab.co.bw/verify',
  signatories        jsonb default '[]',
  seal_asset_path    text,
  logo_asset_path    text,
  eligibility_rules  jsonb default '{"overall_min":50,"exam_min":40}',
  payment_rules      jsonb default '{"eligible":["Paid","Fully Paid","Settled"],"blocked":["Outstanding Fees","Unpaid","In Arrears"],"review":["Updated","Pending","Unknown"]}',
  updated_at         timestamptz not null default now()
);
insert into application_settings (id) values (1);

-- ---------- Helper: current role ----------
create or replace function current_staff_role() returns staff_role
language sql stable security definer set search_path = public as $$
  select role from staff_profiles where user_id = auth.uid() and active
$$;

-- ---------- Transaction-safe reference reservation ----------
create or replace function reserve_certificate_reference(
  p_course_code text,
  p_intake_year int,
  p_intake_month text,
  p_issue_date date
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_role staff_role;
  v_code text := upper(trim(p_course_code));
  v_month text := upper(trim(p_intake_month));
  v_seq int;
  v_ref text;
begin
  v_role := current_staff_role();
  if v_role is null or v_role = 'Viewer' then
    raise exception 'Not authorised to reserve certificate references';
  end if;
  if v_code not in (select code from courses where active) then
    raise exception 'Unknown course code: %', v_code;
  end if;
  if v_month !~ '^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$' then
    raise exception 'Invalid intake month code: %', v_month;
  end if;

  insert into reference_counters (course_code, intake_year, intake_month, last_sequence)
  values (v_code, p_intake_year, v_month, 0)
  on conflict (course_code, intake_year, intake_month) do nothing;

  -- Row lock guarantees no two sessions get the same number
  update reference_counters
     set last_sequence = last_sequence + 1, updated_at = now()
   where course_code = v_code and intake_year = p_intake_year and intake_month = v_month
   returning last_sequence into v_seq;

  v_ref := 'IAB/CERT/' || v_code || '/' || p_intake_year || v_month || '/'
        || to_char(p_issue_date, 'YYYYMM') || '/' || lpad(v_seq::text, 4, '0');

  return jsonb_build_object(
    'reference', v_ref,
    'sequence', v_seq,
    'course_code', v_code,
    'intake_year', p_intake_year,
    'intake_month', v_month,
    'issue_year', extract(year from p_issue_date)::int,
    'issue_month', extract(month from p_issue_date)::int
  );
end $$;

-- ---------- Public verification (safe, minimal fields only) ----------
create or replace function verify_certificate(p_reference text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'certificate_reference', certificate_reference,
    'learner_name', full_name_at_issue,
    'course', course_name_at_issue,
    'intake', intake_year || intake_month,
    'issue_date', issue_date,
    'status', status
  )
  from certificates
  where certificate_reference = trim(p_reference)
  limit 1
$$;
