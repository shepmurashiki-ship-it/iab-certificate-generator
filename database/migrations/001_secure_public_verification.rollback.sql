-- Rollback for 001 — restores the exact pre-migration functions and grants (snapshot taken 2026-11-26).
-- The verification_token column is KEPT by default: dropping it would make QR codes issued after 001 show limited detail.
-- Uncomment the last block only if no certificate has been issued since 001 was applied.

drop function if exists public.verify_certificate(text, text);
create or replace function public.verify_certificate(p_reference text) returns jsonb
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
grant execute on function public.verify_certificate(text) to public, anon, authenticated, service_role;

grant execute on function public.reserve_certificate_reference(text, integer, text, date) to public, anon, authenticated, service_role;

grant all on table
  public.staff_profiles, public.courses, public.learners, public.import_batches,
  public.reference_counters, public.certificates, public.certificate_events, public.application_settings
  to anon, authenticated;  -- includes TRUNCATE/REFERENCES/TRIGGER/MAINTAIN removed by 001

-- alter table public.certificates drop constraint if exists certificates_verification_token_format;
-- alter table public.certificates drop column if exists verification_token;
