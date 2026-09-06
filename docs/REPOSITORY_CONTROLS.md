# Repository controls

Owner: engineering lead (named appointment pending). Review on repository transfer, permission changes, and quarterly.

The local repository has no remote configured. These controls are required on the eventual private GitHub repository; they are not represented as already enabled.

1. Protect `main`: pull requests only, one independent approving reviewer, dismiss stale approvals, resolve conversations, disallow force pushes/deletion, require up-to-date quality and secret-history jobs. Restrict bypass to a documented, audited incident path.
2. Assign a real engineering team to `CODEOWNERS`, with separate security/data ownership for migrations, authorization, workflow files, and payment adapters. A made-up GitHub handle is not used as enforcement.
3. Use conventional commit messages and semantic release tags. Preserve task-specific acceptance evidence.
4. Use GitHub environments for preview/staging/production; production requires named human approval. Preview runs never receive production secrets or real recipients.
5. Pin direct dependencies and actions. Review all transitive license changes, advisories, provenance, and changes before merging Dependabot updates. No automatic production promotion.
6. Enable secret scanning/push protection where available. CI scans full Git history with redacted output. A detected secret must be revoked, rotated, and investigated, not just deleted.
7. License-review exceptions require package/version, license, justification, named reviewer, approval date, and expiry. No exceptions are presently granted.
8. Commit generated Supabase types only after generating from the exact migration state in CI; verify drift. Generated files are never evidence that a migration or RLS test ran.

The automated allowlist covers the permissive, weak-copyleft, attribution, and binary-runtime licenses currently used by the locked web toolchain, including MIT/ISC/BSD/Apache/MPL/LGPL and CC-BY metadata. Any unrecognized license still blocks CI and requires explicit review; this is separate from package-specific exceptions.

CI writes build and browser evidence, but it has not been dispatched. Container/action pin updates and all remote controls require verification when the repository is connected.
