-- iAB Certificate Generator — database functions
-- NOTE: these are ALSO included in schema.sql; run this file only if you skipped them there.

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
