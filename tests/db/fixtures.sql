-- Synthetic fixtures for the LOCAL test cluster only (no real people).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@example.invalid'),
  ('00000000-0000-0000-0000-00000000000b', 'issuer@example.invalid'),
  ('00000000-0000-0000-0000-00000000000c', 'viewer@example.invalid'),
  ('00000000-0000-0000-0000-00000000000d', 'nostaff@example.invalid');
insert into staff_profiles (user_id, full_name, role) values
  ('00000000-0000-0000-0000-00000000000a', 'Test Admin', 'Administrator'),
  ('00000000-0000-0000-0000-00000000000b', 'Test Issuer', 'Certificate Issuer'),
  ('00000000-0000-0000-0000-00000000000c', 'Test Viewer', 'Viewer');
insert into learners (registration_id, full_name, id_type, id_number, email, telephone, intake_month, intake_year)
values ('T-001', 'Testa Fixture Person', 'Omang No.', '000000001', 'learner@example.invalid', '+000', 'MAR', 2026);
