# Incomplete database source — do not apply

The schema file in this directory was preserved when the parallel worker reached its usage limit. It is deliberately outside `supabase/migrations`.

The file defines draft tables and revokes ordinary API access. The follow-up access policies, authenticated RPCs, storage rules, lifecycle procedures, atomic numbering/rate-limit functions, generated types and pgTAP evidence are **not implemented**. No database has been started and no migration has been applied.

Before promoting any source into the executable migrations directory, complete the field/access/state dictionary required by Tasks 04 and 11, review every table/function exposure, add two-tenant tests and obtain passing remote migration/RLS evidence. Do not connect this draft to a customer-facing route or treat enabled RLS with no policies as a functioning application.
