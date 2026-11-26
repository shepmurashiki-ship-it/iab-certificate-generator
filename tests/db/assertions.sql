-- Assertions for migration 001 on the LOCAL test cluster (synthetic data). Re-runnable.
\set ON_ERROR_STOP on
\o /dev/null
\set tok 'AbCdEfGhIjKlMnOpQrStUv'
\set r1 'IAB/CERT/LTI/2026MAR/202607/0001'
\set r2 'IAB/CERT/STI/2026MAR/202607/0001'
\set r3 'IAB/CERT/WMT/2026MAR/202607/0001'
\set r4 'IAB/CERT/HCBA/2026MAR/202607/0001'
\set r5 'IAB/CERT/LTI/2026MAR/202607/0002'

create schema if not exists t;
create or replace function t.ok(cond boolean, label text) returns void language plpgsql as $$
begin if not coalesce(cond, false) then raise exception 'FAIL: %', label; end if; raise notice 'ok - %', label; end $$;
create or replace function t.denied(q text, label text) returns void language plpgsql as $$
begin execute q; raise exception 'FAIL (not denied): %', label;
exception when insufficient_privilege then raise notice 'ok - denied: %', label; end $$;
create or replace function t.as_user(uid text) returns void language sql as
  $$ select set_config('request.jwt.claim.sub', uid, false) $$;
grant usage on schema t to public;
grant execute on all functions in schema t to public;
set client_min_messages = notice;

-- ---------- issuer issues certificates through RLS ----------
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000b');
select t.ok(public.reserve_certificate_reference('LTI', 2026, 'MAR', '2026-07-01') ? 'reference', 'issuer can reserve a reference');
insert into public.certificates (certificate_reference, file_safe_reference, base_reference, revision_number, sequence_number, registration_id,
  full_name_at_issue, id_type_at_issue, id_number_at_issue, course_code_at_issue, course_name_at_issue, intake_month, intake_year,
  award_date, issue_date, status, verification_token, payment_status, overall_mark)
values
  (:'r1', 'f', :'r1', 0, 1, 'T-001', 'Testa Fixture Person', 'Omang No.', '000000001', 'LTI', 'Introduction to Long Term Insurance', 'MAR', 2026, '2026-06-30', '2026-07-01', 'Issued', :'tok', 'Paid', 77),
  (:'r2', 'f', :'r2', 0, 1, 'T-002', 'Legacy Fixture', null, null, 'STI', 'Introduction to Short Term Insurance: Personal Lines', 'MAR', 2026, null, '2026-07-01', 'Issued', null, 'Paid', 60),
  (:'r3', 'f', :'r3', 0, 1, 'T-003', 'Revoked Fixture', null, null, 'WMT', 'Introduction to Wealth Management', 'MAR', 2026, null, '2026-07-01', 'Revoked', 'RevokedTokenRevokedTok1', 'Paid', 60),
  (:'r4', 'f', :'r4', 0, 1, 'T-004', 'Draft Fixture', null, null, 'HCBA', 'Introduction to Healthcare & Healthcare Benefits Administration', 'MAR', 2026, null, '2026-07-01', 'Draft', 'DraftTokenDraftTokenDr', 'Paid', 60),
  (:'r5', 'f', :'r5', 0, 2, 'T-005', 'Super Seded', null, null, 'LTI', 'Introduction to Long Term Insurance', 'MAR', 2026, null, '2026-07-01', 'Superseded', 'SupersededTokenSupers1', 'Paid', 60),
  (:'r5' || '-R1', 'f', :'r5', 1, 2, 'T-005', 'Super Seded Fixed', null, null, 'LTI', 'Introduction to Long Term Insurance', 'MAR', 2026, null, '2026-07-01', 'Issued', 'CorrectedTokenCorrect1', 'Paid', 60)
on conflict do nothing;
select t.ok((select count(*) from public.certificates) = 6, 'issuer reads certificates');
select t.denied('truncate public.certificates', 'issuer TRUNCATE');
reset role;

-- ---------- anonymous public verification ----------
set role anon; select t.as_user('');
select t.ok(public.verify_certificate(:'r1', :'tok') @> '{"result":"found","detail":"full","status":"Issued","learner_name":"Testa Fixture Person","course":"Introduction to Long Term Insurance","award_date":"2026-06-30","issue_date":"2026-07-01"}', 'QR (ref+token) -> full public detail');
select t.ok((select array_agg(k order by k) from jsonb_object_keys(public.verify_certificate(:'r1', :'tok')) k)
  <@ array['award_date','certificate_reference','course','detail','issue_date','learner_initials','learner_name','result','status'], 'only approved fields returned');
select t.ok(public.verify_certificate(:'r1', :'tok')::text !~* '000000001|example\.invalid|Omang|Paid|77|00000000-', 'no PII / payment / marks / ids');
select t.ok(public.verify_certificate(lower(' ' || :'r1' || ' '), :'tok') ->> 'result' = 'found', 'reference normalised (case/space)');
select t.ok(public.verify_certificate(:'r1') @> '{"result":"found","detail":"limited","learner_initials":"T. F. P."}' and public.verify_certificate(:'r1') ->> 'learner_name' is null, 'reference only -> limited (initials, no name)');
select t.ok(public.verify_certificate(:'r2') @> '{"detail":"limited","learner_initials":"L. F."}', 'legacy certificate without token -> limited');
select t.ok(public.verify_certificate(:'r1', 'WrongTokenWrongTokenWr') = '{"result":"not_found"}', 'wrong token -> not_found');
select t.ok(public.verify_certificate(:'r2', 'AnyTokenAnyTokenAnyTok') = '{"result":"not_found"}', 'token on token-less cert -> not_found');
select t.ok(public.verify_certificate(:'r1', 'bad token!') = '{"result":"not_found"}', 'malformed token -> not_found');
select t.ok(public.verify_certificate('IAB/CERT/LTI/2026MAR/202607/9999') = '{"result":"not_found"}', 'fabricated reference -> not_found');
select t.ok(public.verify_certificate('%') = '{"result":"not_found"}', 'wildcard % -> not_found');
select t.ok(public.verify_certificate('IAB/CERT/LTI/2026MAR/202607/%') = '{"result":"not_found"}', 'partial wildcard -> not_found');
select t.ok(public.verify_certificate('IAB/CERT/LTI/2026MAR/202607/0001'' or ''1''=''1') = '{"result":"not_found"}', 'injection attempt -> not_found');
select t.ok(public.verify_certificate(repeat('A', 5000)) = '{"result":"not_found"}', 'oversized input -> not_found');
select t.ok(public.verify_certificate(null) = '{"result":"not_found"}', 'null -> not_found');
select t.ok(public.verify_certificate(:'r4', 'DraftTokenDraftTokenDr') = '{"result":"not_found"}', 'draft never visible');
select t.ok(public.verify_certificate(:'r3', 'RevokedTokenRevokedTok1') ->> 'status' = 'Revoked', 'revoked status shown');
select t.ok(public.verify_certificate(:'r5', 'SupersededTokenSupers1') ->> 'status' = 'Superseded', 'superseded status shown');
select t.ok(public.verify_certificate(:'r5' || '-R1', 'CorrectedTokenCorrect1') ->> 'learner_name' = 'Super Seded Fixed', 'corrected revision verifies');

-- ---------- anonymous: no table access, no reference allocation ----------
select t.denied(format('select * from public.%I', x), 'anon SELECT ' || x) from unnest(array['learners','certificates','staff_profiles','certificate_events','application_settings','reference_counters','courses','import_batches']) x;
select t.denied('insert into public.certificates (certificate_reference) values (''x'')', 'anon INSERT');
select t.denied('update public.certificates set status = ''Revoked''', 'anon UPDATE');
select t.denied('delete from public.certificates', 'anon DELETE');
select t.denied('truncate public.learners', 'anon TRUNCATE');
select t.denied('select public.reserve_certificate_reference(''LTI'', 2026, ''MAR'', ''2026-07-01'')', 'anon reserve reference');
select t.denied('select * from auth.users', 'anon auth.users');
reset role;

-- ---------- signed in but not staff ----------
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000d');
select t.ok((select count(*) from public.certificates) = 0 and (select count(*) from public.learners) = 0
  and (select count(*) from public.staff_profiles) = 0 and (select count(*) from public.application_settings) = 0
  and (select count(*) from public.reference_counters) = 0 and (select count(*) from public.certificate_events) = 0, 'non-staff user sees no rows');
select t.denied('insert into public.learners (registration_id, full_name) values (''x'', ''y'')', 'non-staff INSERT (RLS)');
do $$ declare n int; begin update public.certificates set status = 'Revoked'; get diagnostics n = row_count;
  perform t.ok(n = 0, 'non-staff UPDATE affects nothing'); end $$;
reset role;

-- ---------- viewer: read-only ----------
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000c');
select t.ok((select count(*) from public.certificates) = 6, 'viewer reads register');
select t.denied('insert into public.certificate_events (event_type) values (''Issued'')', 'viewer INSERT (RLS)');
do $$ begin perform public.reserve_certificate_reference('LTI', 2026, 'MAR', '2026-07-01'); raise exception 'FAIL: viewer reserved';
exception when raise_exception then if sqlerrm like 'FAIL%' then raise; end if; raise notice 'ok - viewer cannot reserve references'; end $$;
reset role;
\echo 'db assertions: PASS'
