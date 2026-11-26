#!/bin/sh
# Applies schema + policies + seed + migrations to a throwaway local PostgreSQL cluster with a Supabase role shim,
# then checks idempotency, RLS/grants and verify_certificate(), rollback, and re-apply. Synthetic data only.
# Needs: PostgreSQL 15+ binaries (initdb, pg_ctl, psql) with pgcrypto.   Usage: sh tests/db-migration.test.sh
set -eu
repo=$(cd "$(dirname "$0")/.." && pwd); cd "$repo"
tmp=$(mktemp -d); port=55432
trap 'pg_ctl -D "$tmp/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
initdb -D "$tmp/data" -U postgres -A trust >/dev/null
pg_ctl -D "$tmp/data" -o "-p $port -k $tmp -c listen_addresses=" -l "$tmp/log" -w start >/dev/null
P() { psql -X -q -v ON_ERROR_STOP=1 -h "$tmp" -p $port -U postgres -d postgres "$@"; }
M=database/migrations/001_secure_public_verification
P -f tests/db/supabase-shim.sql
P -f database/schema.sql -f database/policies.sql -f database/seed.sql -f tests/db/fixtures.sql
P -f $M.sql; P -f $M.sql 2>/dev/null                       # idempotent (2nd run only emits 'already exists' notices)
P -f tests/db/assertions.sql 2>"$tmp/a1" || { cat "$tmp/a1"; exit 1; }; sed 's/^psql:[^ ]* NOTICE:  /  /' "$tmp/a1"
P -f $M.rollback.sql
P -tAc "select 'rollback restores old signature: ' || (verify_certificate('x') is null)::text"
P -f $M.sql 2>/dev/null
P -f tests/db/assertions.sql 2>"$tmp/a2" || { cat "$tmp/a2"; exit 1; }; echo "re-applied after rollback: $(grep -c 'ok - ' "$tmp/a2") checks pass"
echo 'PASS: db migration 001'
