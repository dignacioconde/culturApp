---
name: cultura-security-privacy-review
description: Perform a security and privacy review for CulturaApp. Use for auth, Supabase RLS, secrets, .env handling, privacy/GDPR-style personal data concerns, dependency risk, XSS, unsafe HTML, prompt/agent skill safety, deploy exposure, or pre-release security checks. Do not use for cosmetic UI review unless trust, privacy, or data exposure is affected.
---

# Cultura Security Privacy Review

## Purpose

Find real security and privacy risks in CulturaApp without importing heavy process. Prioritize user data isolation, secret hygiene, safe agent instructions, and safe deployment practices.

## When to use this skill

- The task mentions security, privacy, GDPR, RLS, auth, secrets, Supabase anon/service role keys, dependency audit, XSS, prompt injection, agent skills, deploy exposure, or production readiness.
- A change touches `.env*`, `src/supabaseClient.js`, auth flows, hooks, SQL policies, docs that mention credentials, or `.agents`/`.claude` skill files.
- The user asks for a secure code review or pre-release security check.

## When not to use this skill

- The task is purely visual, editorial, or product planning with no security/privacy impact.
- The user asks for offensive testing, exploitation, credential probing, or unauthorized scanning.
- The request requires reading private secrets without a clear need and explicit user approval.

## Inputs to inspect

- `AGENTS.md` security notes, SQL/RLS schema, and environment variable rules.
- `.gitignore`, `package.json`, `package-lock.json`, and dependency changes.
- `src/supabaseClient.js`, `src/hooks/**`, `src/pages/Auth/**`, and data-consuming pages.
- `.agents/skills/**/SKILL.md`, `.claude/skills/**`, `.opencode/agents/**` when agent safety is in scope.
- Deploy docs in `README.md`, `TECHDOC.md`, or Vercel-related files.

## Procedure

1. Scope the review to changed files or the user-specified area.
2. Search locally for secrets and unsafe patterns without printing secret values: `.env`, service role strings, private keys, tokens, `localStorage`, `dangerouslySetInnerHTML`, `innerHTML`, `eval`, shell execution, external URLs, and direct data access.
3. Verify `.env.local` and real secrets are ignored and not documented verbatim.
4. Confirm Supabase anon key assumptions: anon key can be client-side, service role key cannot.
5. Check RLS policies and `user_id` usage for every user-owned data path.
6. Review auth flows for clear error handling and no manual session storage.
7. Review privacy: avoid unnecessary personal data, do not expose other users' clients, projects, incomes, expenses, email, or profile data.
8. Review XSS and injection risk: no unsafe HTML, no untrusted HTML rendering, no string-built SQL beyond Supabase filter syntax, no dynamic code execution.
9. For skills and agent configs, check for prompt injection, hidden instructions, commands that exfiltrate files, destructive actions, or requests to ignore policies.
10. For dependencies, prefer `npm audit` only if the user asks or the environment supports it; do not install tools. Use `package-lock.json` and package diffs for local assessment.
11. Report only risks grounded in this repo. Avoid generic enterprise controls unless they directly reduce risk.

## Output format

Start with findings:

- Severity.
- File and line when possible.
- Risk.
- Evidence.
- Recommended fix.
- Verification needed.

Then include residual risk and any checks not performed.

## Severity / priority model

- CRITICAL: cross-user data exposure, auth bypass, exposed service role key, real secret committed, destructive agent instruction, or exploitable XSS.
- HIGH: RLS gap, ambiguous ownership filter, unsafe remote/deploy configuration, sensitive personal data exposure, or risky dependency with reachable impact.
- MEDIUM: hardening issue, privacy minimization gap, weak validation with plausible abuse, risky skill wording, or missing security verification.
- LOW: hygiene, documentation clarity, non-blocking dependency awareness.

## Quality bar

- Findings are specific, reproducible, and tied to CulturaApp.
- No secret values are printed.
- Recommendations preserve RLS and least privilege.
- Agent/skill safety is treated as supply-chain surface.
- The review distinguishes blockers from residual risks.

## Common mistakes to avoid

- Recommending RLS disablement to work around a bug.
- Treating Supabase anon key as a secret.
- Reading or exposing `.env.local` unnecessarily.
- Importing external scanner scripts or running remote audit tools without approval.
- Filing broad OWASP checklists with no repo evidence.
- Ignoring skill/prompt files as a security surface.

## Safety notes

Do not perform unauthorized scanning, credential verification, external uploads, or secret probing. Do not run destructive commands. Ask for explicit confirmation before any remote check, production operation, or command that may disclose private repository data to third-party services.
