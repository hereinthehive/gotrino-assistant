---
name: dep-debt
description: Surface dependency debt — outdated packages, abandoned/deprecated libs, unused deps, version drift across manifests. Static analysis only (no package manager calls). Use before upgrades, audits, or when planning tech renewal.
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Dep Debt

Surface dependency debt and point at the packages most likely to bite.

## Philosophy

> "Which dependencies will bite us, and when?"

Every dependency is a bet: that it'll keep working, stay maintained, not have vulnerabilities. Old bets decay. Some libs went abandoned years ago; some pinned versions missed a major release; some packages are installed and imported nowhere. Dep-debt is the audit of those bets.

Not a replacement for `npm audit` / `pip-audit`. This skill reads manifests statically and spots patterns. For vulnerability scans, use the ecosystem tool — this skill tells you *where to look*.

## Scope

User may specify a directory. Default: project root. For monorepos, scan all manifests found.

## Config Integration

Follow `references/config-migration.md` for preflight.

Read `.assistant-config.md` for:
- **Stack** (which manifests are expected)
- **Acknowledged Debt** (deps acknowledged as pinned-intentionally)

## Stack Detection

Glob for all supported manifests (see `references/dep-debt-manifests.md`). In a monorepo, expect multiple.

## Process

### 1. Understand context

List all manifests found. Read each. Note declared deps, versions, lockfile presence.

### 2. Scan

- **Outdated / pre-1.0 versions:** compare declared versions to signals in the reference.
- **Abandoned packages:** match against the known-deprecated list.
- **Unused deps:** for each declared dep, Grep the source for `import`/`require`/`from X import`. If no match, flag as "appears unused; verify build scripts".
- **Version drift:** in monorepos, compare the same dep across manifests.

### 3. Group by manifest

Organize findings per manifest file. A monorepo with three packages should produce three location groups, not one flat list.

### 4. Assess impact

- **High:** abandoned packages on runtime critical paths, deps with known major security incidents
- **Medium:** pre-1.0 versions of stable libs, version drift
- **Low:** dev deps slightly behind, small unused deps

## Reference

- `references/dep-debt-manifests.md`
- `references/debt-output-format.md`
- `references/config-migration.md`

## Output format

Follow `references/debt-output-format.md` exactly.

## What Makes This Different From `npm outdated`

`npm outdated` lists versions. This skill tells you which version drift actually matters — `lodash` three minor versions behind is unlikely to bite; `request` being abandoned for four years is a landmine. Judgment on top of data.
