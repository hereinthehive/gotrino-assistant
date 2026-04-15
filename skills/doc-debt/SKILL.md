---
name: doc-debt
description: Surface documentation debt — stale READMEs, missing public API docs, broken internal links, undocumented env vars. Use when onboarding gets friction, before a release, or when an API has evolved without matching doc updates.
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Doc Debt

Surface documentation that no longer matches reality, and public surfaces that were never documented.

## Philosophy

> "What would a new contributor misunderstand from our docs?"

Docs rot quietly. A version number that drifted from the manifest, a link to a wiki that was retired, a function parameter added to the code but never to the docs — each is small, but together they tell new contributors the project doesn't take its own documentation seriously.

Not a linter. The value is spotting *divergence between docs and code*, not formatting.

## Scope

User may specify a file path, glob, or directory. If not specified, ask: *"Which directory should I audit? (A README or a `docs/` folder is typical.)"*

## Config Integration

Follow `references/config-migration.md` for preflight.

Read `.assistant-config.md` for:
- **Docs location** (set by `/teach-charter`)
- **Acknowledged Debt** entries for this dimension
- **Stack** (determines which manifest to cross-reference for version drift)

## Stack Detection

Glob for manifest files to find the canonical version number:
- `package.json` — the `version` field
- `pyproject.toml` — `[project] version`
- `Gemfile` / `Gemfile.lock`
- `go.mod`
- `Cargo.toml` — `[package] version`

Use this for version-drift checks.

## Process

### 1. Understand context

Read the project's main README. Identify declared version, install commands, usage examples, linked resources. Note what the README claims is true.

### 2. Scan

For each signal in `references/doc-debt-checklist.md`:
- **Version drift:** compare versions in docs vs. manifest.
- **Broken internal links:** Glob for markdown files, Grep for `](./` and `](../`, verify targets exist.
- **Missing public API docs:** Grep for exported symbols in source, cross-reference against README/docs.
- **Undocumented env vars:** Grep for `process.env`, `os.environ`, `ENV[` in source, cross-reference against docs.
- **Stale dates:** Grep for year patterns (`20\d\d`) in changelogs and release notes.

### 3. Group by location

Organize by document (README, docs/api.md, etc.) or by source module where the gap lives.

### 4. Assess impact

- **High:** affects onboarding (install, quickstart, first-run docs)
- **Medium:** affects day-to-day usage (API reference, examples)
- **Low:** internal notes, archived sections

## Reference

- `references/doc-debt-checklist.md`
- `references/debt-output-format.md`
- `references/config-migration.md`

## Output format

Follow `references/debt-output-format.md` exactly.

## What Makes This Different From a Linter

Linters check formatting. This skill checks *fidelity*:
- Is the version in the README the version we actually ship?
- Does the function signature in the docs match the function in the code?
- Do the links go anywhere?

A doc with perfect markdown formatting and wrong facts is worse than a doc with imperfect formatting and right facts. This skill surfaces the former.
