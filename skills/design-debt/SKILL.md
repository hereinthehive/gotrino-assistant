---
name: design-debt
description: Surface design-level debt — inconsistent patterns (error handling, naming, response shapes), architectural drift from declared principles, duplicated business logic. Use when the codebase feels harder to reason about than it used to.
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Design Debt

Surface drift — the gap between how the codebase was meant to be structured and how it actually is.

## Philosophy

> "Is our system getting harder to reason about because of drift?"

Design debt is quiet. No test fails, no lint warns. But new contributors ask more questions, changes take longer, bugs appear in "how do these modules talk to each other." Design-debt finds the drift before it compounds.

Not a refactoring plan. The value is spotting *inconsistency*, not prescribing a fix. The team decides whether to realign or to formalize the new pattern.

## Scope

User may specify a directory. Default: ask which part of the codebase to focus on. This skill works best on a bounded slice (a module, a layer), not whole-codebase scans.

## Config Integration

Follow `references/config-migration.md` for preflight.

Read `.assistant-config.md` for:
- **Architecture Principles** (optional — ground truth if declared)
- **Stack**
- **Acknowledged Debt**

If no architecture principles are declared, infer the dominant pattern from the code and flag deviations.

## Stack Detection

Language/framework context matters (Express vs. Next.js handlers have different norms). Detect via manifest as in other dimensions.

## Process

### 1. Understand context

Read a representative handful of files in the scope. Identify:
- The dominant structural pattern (e.g. "handlers are thin, delegate to services")
- The dominant error-handling style (e.g. "try/catch, JSON envelope")
- The dominant naming convention

### 2. Scan

- **Error handling inconsistency:** read all handlers (or equivalent). Compare error shapes.
- **Response shape inconsistency:** same, for success responses.
- **Naming inconsistency:** Glob filenames, Grep function names.
- **Architectural drift:** Grep for imports that cross declared boundaries (e.g. services importing handlers, handlers doing direct DB calls).
- **Duplicated logic:** Grep for similar function signatures across files.

### 3. Group by concern

Group by the type of inconsistency (error handling, naming, architecture, duplication). Each concern gets a location list.

### 4. Assess impact

- **High:** drift in load-bearing layers (auth, data access) — bugs likely
- **Medium:** inconsistent patterns in routine code — slows review
- **Low:** cosmetic naming drift

## Reference

- `references/design-debt-signals.md`
- `references/debt-output-format.md`
- `references/config-migration.md`

## Output format

Follow `references/debt-output-format.md` exactly.

## What Makes This Different From a Linter

Linters enforce rules the team already agreed on. This skill surfaces *disagreement the team didn't realize they had*. Two developers wrote handlers differently because no one was watching — not because either was wrong. The skill makes the drift visible so the team can decide.
