-- iAB Certificate Generator — seed data
insert into courses (code, official_name, aliases) values
  ('LTI',  'Introduction to Long Term Insurance',
   array['LT-INS','Long Term Insurance']),
  ('STI',  'Introduction to Short Term Insurance: Personal Lines',
   array['ST-PL','Short Term Insurance','Short-Term Insurance']),
  ('HCBA', 'Introduction to Healthcare & Healthcare Benefits Administration',
   array['MCA','Healthcare Benefits Administration','Healthcare and Healthcare Benefits Administration']),
  ('WMT',  'Introduction to Wealth Management',
   array['WLM','Wealth Management'])
on conflict (code) do nothing;

-- After creating your first auth user (Dashboard > Authentication > Add user),
-- grant them the Administrator role (replace the UUID):
-- insert into staff_profiles (user_id, full_name, role)
-- values ('00000000-0000-0000-0000-000000000000', 'Your Name', 'Administrator');
