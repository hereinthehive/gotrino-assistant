# Debt Skills — Design Spec

**Date:** 2026-04-15
**Status:** Approved for implementation planning
**Author:** Brainstormed with user (gotrino-assistant plugin)

## Goal

Add a family of "debt audit" skills to the gotrino-assistant plugin. Each skill surfaces a specific dimension of project debt and produces triage-ready findings. An umbrella skill runs all dimensions and synthesizes a cross-cutting report.

## Non-goals

- Not a linter. Skills observe patterns and assess context; they do not enforce rules.
- Not automated repair. Skills surface debt; `/triage` and the user decide what to do.
- Not coverage for every possible debt type. The six dimensions below are the first set; more can be added later.

## Skills to create

| Skill | Purpose |
|---|---|
| `code-debt` | Finds TODO/FIXME/HACK markers, deprecated API calls, dead code, commented-out blocks, oversized functions, magic numbers. Thresholds (function length, file length) are heuristic defaults; overridable in `.assistant-config.md`. |
| `doc-debt` | Finds stale READMEs, missing docs for public APIs, broken internal links, outdated examples, undocumented env vars |
| `test-debt` | Finds skipped/xit'd tests, untested public APIs (visible via Grep — e.g. exported symbols with no matching test file), missing edge cases, flaky patterns (retries, sleeps, timeouts). Does not run coverage tools; analysis is pattern-based. |
| `dep-debt` | Finds outdated packages, unused deps, known security advisories, version drift across manifests, duplicate deps |
| `design-debt` | Finds inconsistent patterns, duplicated logic, architectural drift. Reads `.assistant-config.md` "Architecture Principles" section if declared; otherwise compares against dominant patterns observed in the codebase. |
| `debt-audit` | Umbrella — invokes the five dimension skills, synthesizes cross-cutting findings, surfaces systemic hotspots |

## Architecture

### Skill shape (dimension skills)

Every dimension skill follows the existing audit pattern:

```yaml
---
name: <dim>-debt
description: <one-line purpose + when-to-use>
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---
```

`Bash` is added (new for this plugin) to support the config migration rename. Its use is scoped to the migration preflight only; the skill body does not invoke it for analysis.

Body sections, in order:

1. **Philosophy** — a central question, not a checklist. Example for `code-debt`: *"What does our code still owe us that we haven't paid?"*
2. **Config Integration** — reads `.assistant-config.md`; if absent, performs migration preflight (see below).
3. **Scope** — accepts path, glob, or directory; asks if not provided.
4. **Stack detection** — globs for manifest files, infers stack, shows detected result, accepts user override.
5. **Process** — four steps: understand context → scan → group by location → assess impact.
6. **Reference** — pointer to `references/<dim>-*.md`.
7. **Output format** — triage-ready markdown (see below).
8. **What Makes This Different From a Linter** — closing section emphasizing pattern understanding over detection.

### Umbrella skill (`debt-audit`)

Runs each dimension skill via the `Skill` tool. Captures outputs. Synthesizes.

Before running: shows the five dimensions and asks whether to exclude any for this run.

Synthesis passes:

1. **Locate findings.** Parse `file:line` entries from each sub-report into a location map.
2. **Score hotspots.** A module appearing in three or more dimensions is a "systemic hotspot." A module with five or more findings in one dimension is a "deep debt zone."
3. **Surface themes.** Describe cross-cutting patterns in plain language.
4. **Prioritize.** Rank the top ten items across all dimensions by combined impact.

## Output format (dimension skills)

```markdown
## <Dimension> Debt: [path]

**Config loaded:** .assistant-config.md
**Stack:** [detected or declared]
**Scope:** [what was scanned]

### TL;DR
[Two or three sentences: count, theme, hotspot]

### Findings
[Grouped by location, not by type.]

**[module/path]** — [count] items
- `file:line` — [what + why it's debt]
- `file:line` — [what + why it's debt]

**Suggested triage:** Impact [H/M/L] · Effort [S/M/L] · Priority [P2/P3/P4]

### Cross-cutting themes
[Patterns spanning multiple locations]

### Ready-to-file items
[Top three to five findings as triage-ready blocks — title, description, acceptance criteria]

### What's acceptable
[Acknowledged items from config, noted but not flagged]
```

## Output format (umbrella)

```markdown
## Debt Audit: [path]

### TL;DR
[Headline: total count, top hotspot, recommended first move]

### Systemic hotspots
[Modules with debt in three or more dimensions]

### Top 10 items (across all dimensions)
[Ranked, triage-ready]

### Per-dimension summary
| Dimension | Count | Highest priority |
|---|---|---|
| Code | [n] | [link to top item] |
| ...

### Full per-dimension reports
[References to each sub-skill's output, not duplicated inline]
```

## Config changes

### Rename `.inclusion-config.md` to `.assistant-config.md`

The plugin is the **Gotrino Assistant**, not a pure inclusion tool. The config file is the assistant's project-scoped memory. Rename it to match.

### New sections in `.assistant-config.md`

- **Stack** — languages, frameworks, test runners, package managers. Populated by `/teach-charter` through detection + confirmation.
- **Debt Scope** — which dimensions matter for this project, which are out of scope. Optional per-dimension heuristic overrides (e.g. `code-debt.max-function-lines: 80`).
- **Architecture Principles** — optional free-text section declaring patterns the project follows (e.g. "handlers in `src/api/`, business logic in `src/services/`"). Used by `design-debt` as ground truth.
- **Acknowledged Debt** — specific findings the team has reviewed and accepted. Skills skip these.

### Migration strategy

**Silent rename on first skill run.** Every config-reading skill performs this preflight:

1. If `.assistant-config.md` exists: read it, proceed.
2. If `.assistant-config.md` missing and `.inclusion-config.md` exists: `mv .inclusion-config.md .assistant-config.md`, log one line (`Migrated: .inclusion-config.md → .assistant-config.md`), proceed.
3. If neither exists: prompt user or auto-detect per the skill's convention.

**Dual-read fallback** stays in place for one release as a safety net if the rename fails, then is removed.

## Stack detection

Each skill that needs stack context globs for known manifest files on invocation:

| Manifest | Stack |
|---|---|
| `package.json` | Node / JavaScript / TypeScript |
| `Gemfile` | Ruby |
| `pyproject.toml` / `requirements.txt` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `composer.json` | PHP |

On detection, the skill shows what it found and proceeds. If the project has declared stack in `.assistant-config.md`, the declared value wins and detection is skipped.

## Dimension selection (umbrella)

Before running, `debt-audit` lists the five dimensions and asks whether to exclude any:

> Will check: code, doc, test, dep, design. Exclude any for this run? (none / list)

This is a per-run convenience. Permanent exclusions belong in `.assistant-config.md` under **Debt Scope**.

## `/teach-charter` changes

1. Writes new configs to `.assistant-config.md`.
2. Detects legacy `.inclusion-config.md` and migrates silently on next run (same preflight as the skills).
3. Adds interactive prompts for the new sections:
   - *Stack:* detects and confirms, or accepts manual input
   - *Debt scope:* lists the five dimensions, accepts exclusions
   - *Acknowledged debt:* optional free-text list
4. Preserves existing sections (task management, inclusion scope, acknowledged inclusion findings).

## Reference files

Living in the existing `references/` directory:

- `references/code-debt-patterns.md` — TODO/FIXME conventions, deprecated API signatures
- `references/doc-debt-checklist.md` — what counts as "stale"
- `references/test-debt-patterns.md` — skip/xit patterns per framework, flaky signals
- `references/dep-debt-manifests.md` — manifest formats per ecosystem
- `references/design-debt-signals.md` — architectural drift indicators

## README updates

Add new commands to the plugin `README.md`:

```
### Debt Analysis
| Command | What it does |
|---------|--------------|
| `/code-debt [path]` | Find TODO markers, dead code, deprecated APIs |
| `/doc-debt [path]` | Find stale docs, missing docs, broken links |
| `/test-debt [path]` | Find skipped tests, coverage gaps, flaky patterns |
| `/dep-debt` | Find outdated, unused, or insecure dependencies |
| `/design-debt [path]` | Find inconsistent patterns, duplicated logic |
| `/debt-audit [path]` | Run all dimensions, synthesize cross-cutting findings |
```

Add a note about the config rename.

## Integration with existing skills

- **`/triage`** — debt skill output is triage-ready. Users can paste a Ready-to-file item into `/triage` for deeper assessment.
- **`/teach-charter`** — owns the config migration and the new Stack/Debt sections.
- **Existing audit skills** (inclusion-audit, examples-audit, etc.) — updated to read `.assistant-config.md` with fallback to `.inclusion-config.md`.

## Out of scope for this spec

- Automated debt repayment (no code modification).
- Integration with external systems (SonarQube, CodeClimate, Dependabot). Skills are self-contained.
- Language-specific analysis beyond what Grep/Glob can surface. Deep AST analysis is a future extension.
- New debt dimensions beyond the five listed.

## Open questions

None at design time. All decisions from the brainstorming session are captured above.
