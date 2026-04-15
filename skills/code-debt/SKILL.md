---
name: code-debt
description: Surface code-level debt — TODO/FIXME markers, deprecated APIs, dead code, oversized units, magic numbers. Use when reviewing a module, planning cleanup work, or before a release. Not a linter — observes patterns and assesses impact.
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Code Debt

Surface code-level debt and understand what it's costing the project.

## Philosophy

> "What does our code still owe us that we haven't paid?"

Every TODO is a promise. Every deprecated call is a migration the team chose to defer. Every commented-out block is a decision someone hasn't made. Code-debt names those debts so the team can decide which to pay.

Not a linter. A linter asks "does this match a rule?" This skill asks "what have we left unfinished, and what's it costing us?"

## Scope

The user may specify a file path, glob pattern, or directory. If not specified, ask: *"Which path or module would you like to analyze?"*

## Config Integration

Follow the migration preflight in `references/config-migration.md`.

After preflight, read `.assistant-config.md` for:
- **Debt Scope** overrides (`code-debt.max-function-lines`, etc.)
- **Acknowledged Debt** entries for this dimension (skip these)
- **Architecture Principles** (optional context for judgment)

If no config exists, use heuristic defaults from `references/code-debt-patterns.md`.

## Stack Detection

Glob for manifest files to infer language conventions:
- `package.json` → JavaScript/TypeScript
- `pyproject.toml` / `requirements.txt` → Python
- `Gemfile` → Ruby
- `go.mod` → Go
- `Cargo.toml` → Rust

Show detected stack in the output header. If unclear, proceed with language-agnostic patterns only.

## Process

### 1. Understand context

Read a representative file or two from the scope to understand the codebase's style. Note whether the project already tracks debt in comments (e.g. `TODO(#1234)` with issue refs) — those are tracked items, not untracked debt.

### 2. Scan

Use Grep for each pattern category. See `references/code-debt-patterns.md` for the full list. Collect raw findings with `file:line` locations.

For **rename/identifier drift**, scan the whole project tree — not just source. Config files, `.gitignore`, agent definitions, CI configs, and docs commonly hold the old name after a source-only rename. The point of this check is the blast radius.

### 3. Group by location

Organize findings by module/directory, not by pattern type. A file with a TODO, a deprecated import, and a magic number is one location with three findings — not three scattered items.

### 4. Assess impact

For each location group, judge:
- **Impact** (H/M/L): does this debt block changes, risk bugs, or just offend taste?
- **Effort** (S/M/L): roughly how much work to pay it down?
- **Priority** (P2/P3/P4): feed into triage via `/triage`.

## Reference

- `references/code-debt-patterns.md` — what counts, what doesn't
- `references/debt-output-format.md` — required output format
- `references/config-migration.md` — config migration preflight

## Output format

Follow `references/debt-output-format.md` exactly. The umbrella skill parses this format.

## What Makes This Different From a Linter

A linter would flag every TODO as noise. This skill:

1. Sees patterns — one tracked TODO vs. ten untracked ones in the same file
2. Assesses impact — a magic number in a config is different from one in an auth check
3. Groups by location — three debts in one module is a hotspot, not three separate items
4. Produces triage-ready output — each location comes with suggested impact/effort/priority, ready for `/triage` or pasting into a tracker

The value is **judgment**, not detection.
