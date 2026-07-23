-- iAB Certificate Generator — Row Level Security policies
-- Run AFTER schema.sql.

alter table staff_profiles       enable row level security;
alter table courses              enable row level security;
alter table learners             enable row level security;
alter table import_batches       enable row level security;
alter table reference_counters   enable row level security;
alter table certificates         enable row level security;
alter table certificate_events   enable row level security;
alter table application_settings enable row level security;

-- Staff can read their own profile; admins read/manage all
create policy "own profile" on staff_profiles for select using (user_id = auth.uid());
create policy "admin read profiles" on staff_profiles for select using (current_staff_role() = 'Administrator');
create policy "admin manage profiles" on staff_profiles for all
  using (current_staff_role() = 'Administrator') with check (current_staff_role() = 'Administrator');

-- All authenticated staff may read reference data
create policy "staff read courses"  on courses  for select using (current_staff_role() is not null);
create policy "admin manage courses" on courses for all
  using (current_staff_role() = 'Administrator') with check (current_staff_role() = 'Administrator');

create policy "staff read learners" on learners for select using (current_staff_role() is not null);
create policy "issuer write learners" on learners for insert
  with check (current_staff_role() in ('Administrator','Certificate Issuer'));
create policy "issuer update learners" on learners for update
  using (current_staff_role() in ('Administrator','Certificate Issuer'));

create policy "staff read batches" on import_batches for select using (current_staff_role() is not null);
create policy "issuer write batches" on import_batches for insert
  with check (current_staff_role() in ('Administrator','Certificate Issuer'));

-- Counters are touched ONLY via reserve_certificate_reference (security definer); no direct writes
create policy "staff read counters" on reference_counters for select using (current_staff_role() is not null);

create policy "staff read certificates" on certificates for select using (current_staff_role() is not null);
create policy "issuer insert certificates" on certificates for insert
  with check (current_staff_role() in ('Administrator','Certificate Issuer'));
create policy "issuer update certificates" on certificates for update
  using (current_staff_role() in ('Administrator','Certificate Issuer'));
-- No deletes: certificates are never deleted, only superseded or revoked.

create policy "staff read events" on certificate_events for select using (current_staff_role() is not null);
create policy "staff write events" on certificate_events for insert
  with check (current_staff_role() in ('Administrator','Certificate Issuer'));

create policy "staff read settings" on application_settings for select using (current_staff_role() is not null);
create policy "admin update settings" on application_settings for update
  using (current_staff_role() = 'Administrator');

-- ---------- Storage: PRIVATE certificates bucket ----------
-- Create the bucket first (Dashboard > Storage > New bucket: "certificates", PRIVATE)
-- or: insert into storage.buckets (id, name, public) values ('certificates','certificates', false);
create policy "staff read certificate pdfs" on storage.objects for select
  using (bucket_id = 'certificates' and current_staff_role() is not null);
create policy "issuer upload certificate pdfs" on storage.objects for insert
  with check (bucket_id = 'certificates' and current_staff_role() in ('Administrator','Certificate Issuer'));
