// iAB production Supabase connection — PUBLIC, browser-safe values only.
// Allowed here: the Project URL and the publishable key (sb_publishable_…). Access is limited by Row Level Security.
// NEVER put a secret key (sb_secret_…), service-role key, legacy anon/JWT key, database or email password in this file.
// Invalid or missing values fail closed: sign-in, recovery and verification are disabled, with no manual override.
(function () {
  var url = 'https://meyodifbsxibnvhjsnvf.supabase.co';
  var publishableKey = 'sb_publishable_6VCpjsElnN3B0CFSQxj25w_q1RPLneq'; // publishable key only (sb_publishable_…)
  var ok = /^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(url) && /^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(publishableKey);
  window.IAB_SUPABASE = Object.freeze({
    ok: ok, url: ok ? url : '', publishableKey: ok ? publishableKey : '',
    // redacted fingerprint for display (never the full key)
    fingerprint: ok ? 'sb_publishable_…' + publishableKey.slice(-4) : 'not configured',
    authOptions: { auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true } }
  });
})();
