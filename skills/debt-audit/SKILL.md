---
name: debt-audit
description: Run all five debt dimensions (code, doc, test, dep, design) and synthesize a cross-cutting report. Surfaces systemic hotspots — modules with debt in multiple dimensions. Use when planning a tech-health effort or preparing for a major release.
allowed-tools: Read, Grep, Glob, Bash, Skill, AskUserQuestion
user-invocable: true
---

# Debt Audit

Run every debt dimension and find the places where debt compounds.

## Philosophy

> "Where does our debt concentrate, and what's the single highest-leverage place to repay?"

Running each dimension separately is fine, but patterns emerge only when you look across them. A module flagged by code-debt, test-debt, AND design-debt isn't three separate problems — it's one neglected area. The umbrella's job is surfacing that.

## Scope

User may specify a path, glob, or directory. Whole-project scans are valid but can be long. If not specified, ask: *"Which directory should the audit cover? (Project root is fine for small codebases; a subsystem for larger ones.)"*

## Config Integration

Follow `references/config-migration.md` for preflight.

Read `.assistant-config.md` for:
- **Debt Scope** — any dimensions permanently out of scope
- **Acknowledged Debt**

## Dimension Selection

Before running, show the user the five dimensions and allow per-run exclusion via `AskUserQuestion`:

> Will check: code, doc, test, dep, design. Exclude any for this run? (none / list)

Respect `.assistant-config.md` **Debt Scope** exclusions as defaults.

## Process

### 1. Run each dimension

For each selected dimension, invoke the dimension skill via the `Skill` tool, passing the same scope:

- `code-debt <scope>`
- `doc-debt <scope>`
- `test-debt <scope>`
- `dep-debt <scope>`
- `design-debt <scope>`

Capture each sub-report as text.

### 2. Parse sub-reports

For each report, extract (per the parsing contract in `references/debt-output-format.md`):

- Dimension name
- Every `file:line` entry under `### Findings`
- The single Impact/Effort/Priority triple per location group
- Each Ready-to-file item as a complete block

Build a **location map:**

```
{
  "src/auth/handlers.ts": {
    "code": [...findings],
    "test": [...findings],
    "design": [...findings]
  },
  "src/orders/": {
    "dep": [...findings]
  }
}
```

### 3. Score hotspots

- **Systemic hotspot:** any location appearing in three or more dimensions.
- **Deep debt zone:** any location with five or more findings in one dimension.

### 4. Surface themes

Prose summary of cross-cutting patterns. Examples:
- "The `auth/` module has unresolved TODOs from 2024, two skipped tests, and inconsistent error handling — this is your highest-debt area."
- "Dep debt concentrates in legacy packages (`request`, `moment`); addressing those would cover most of this dimension."
- "Design drift shows up mostly in handlers; the services layer is consistent."

### 5. Prioritize

Top ten items across all dimensions, ranked by a combined score:
- Impact (H=3, M=2, L=1)
- Priority (P2=3, P3=2, P4=1)
- Hotspot bonus: +2 if the location is a systemic hotspot

Break ties by lower Effort first (S before M before L).

## Output format

```markdown
## Debt Audit: <path>

**Config loaded:** .assistant-config.md
**Dimensions run:** code, doc, test, dep, design
**Dimensions skipped:** <none or list>

### TL;DR
<Two or three sentences: total count, top hotspot, recommended first move.>

### Systemic hotspots
<Locations with debt in three or more dimensions. For each, name the dimensions and the top finding. If none, state that.>

**<location>** — flagged by <dimensions>
- <top finding per dimension>

### Top 10 items (across all dimensions)

1. **[<dimension>] <Title>** — Impact <H/M/L> · Effort <S/M/L> · Priority <P>
   - Location: `<file:line>`
   - Why: <one-line rationale>
   - Ready-to-file: <see sub-report or include inline>

(Items 2-10)

### Per-dimension summary

| Dimension | Findings | Top item |
|---|---|---|
| Code | <n> | <one-line> |
| Doc | <n> | <one-line> |
| Test | <n> | <one-line> |
| Dep | <n> | <one-line> |
| Design | <n> | <one-line> |

### Full per-dimension reports

For full findings, re-run the individual skill:
- `/code-debt <scope>`
- `/doc-debt <scope>`
- `/test-debt <scope>`
- `/dep-debt <scope>`
- `/design-debt <scope>`

Sub-reports are NOT duplicated here. The cross-cutting view above is the umbrella's value.
```

## What Makes This Different From Running Each Skill Separately

Running each skill gives you five lists. The umbrella gives you:
1. The **same finding seen from multiple angles** (a hotspot)
2. The **shortest path to impact** (top ten, ranked across dimensions)
3. A **story about the codebase**, not just a catalog

If a user wants the raw catalog, they can run each skill directly. The umbrella is for *deciding where to start*.
