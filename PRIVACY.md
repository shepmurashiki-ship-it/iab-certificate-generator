# Privacy — iAB Certificate Generator

- This application handles learner personal information (names, identity numbers, results)
  solely to issue and manage official iAB certificates.
- Production records are stored in the configured secured Supabase database, protected by
  authentication and Row Level Security policies. Access is restricted to authorised iAB staff roles.
- Generated certificate PDFs contain personal information and must be handled securely.
- Staff must NOT commit results workbooks, generated certificate PDFs, ZIP exports or any
  learner data to GitHub. This repository contains application code and artwork only.
- The public verification page exposes only: certificate reference, learner name, course,
  intake, issue date and status — never identity numbers, marks or contact details.
- Every issue, download, reprint, correction and revocation is recorded in an audit trail.
- No analytics or third-party tracking is included.
- Report suspected incidents to admin@iab.co.bw.
