# Debt Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six debt-audit skills (code, doc, test, dep, design, umbrella) to the gotrino-assistant plugin, rename the config file, and update existing skills to match.

**Architecture:** Each dimension is a standalone SKILL.md following the existing audit pattern (Read/Grep/Glob, philosophy-led, config-aware). The umbrella invokes the dimensions via the `Skill` tool and synthesizes output. Config migration from `.inclusion-config.md` to `.assistant-config.md` happens silently on first skill invocation. Shared reference files keep output format consistent so the umbrella can parse sub-reports reliably.

**Tech Stack:** Markdown (SKILL.md files with YAML frontmatter), Claude Code skill framework, Bash for filesystem rename.

**Spec:** `docs/superpowers/specs/2026-04-15-debt-skills-design.md`

---

## File Structure

**New files:**

```
skills/code-debt/SKILL.md
skills/doc-debt/SKILL.md
skills/test-debt/SKILL.md
skills/dep-debt/SKILL.md
skills/design-debt/SKILL.md
skills/debt-audit/SKILL.md
references/code-debt-patterns.md
references/doc-debt-checklist.md
references/test-debt-patterns.md
references/dep-debt-manifests.md
references/design-debt-signals.md
references/debt-output-format.md        # shared, umbrella parses this
references/config-migration.md           # shared migration preflight steps
test-fixtures/debt-code-sample.ts        # sample with TODOs, dead code, long fn
test-fixtures/debt-docs-sample/          # directory with stale README
test-fixtures/debt-tests-sample.test.ts  # skipped tests, flaky patterns
test-fixtures/debt-deps-sample/          # package.json with outdated/unused
test-fixtures/debt-design-sample/        # two modules with inconsistent patterns
```

**Modified files:**

```
skills/teach-charter/SKILL.md      # rename config, add Stack/Debt sections
skills/triage/SKILL.md             # dual-read config, migration ref
skills/inclusion-audit/SKILL.md    # dual-read config, migration ref
skills/examples-audit/SKILL.md     # dual-read config, migration ref
skills/i18n-check/SKILL.md         # dual-read config
skills/language-check/SKILL.md     # dual-read config
skills/names-check/SKILL.md        # dual-read config
skills/inclusive-names/SKILL.md    # dual-read config (if it reads config)
skills/impact/SKILL.md             # dual-read config (if it reads config)
skills/test-assumption/SKILL.md    # dual-read config
skills/explain/SKILL.md            # dual-read config (if applicable)
skills/plugin-help/SKILL.md        # mention new commands
README.md                          # debt commands, config rename note
```

---

## Conventions

**Every task ends with a commit.**

**Every SKILL.md uses this frontmatter template:**

```yaml
---
name: <skill-name>
description: <one-line purpose + when-to-use trigger>
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---
```

`Bash` is included on every config-reading skill for the rename preflight only. `AskUserQuestion` is added where interactive confirmation is needed (stack detection override, dimension exclusion in umbrella).

**Every dimension skill body follows this outline:**

1. Title + one-line summary
2. Philosophy (central question, not checklist)
3. Config Integration (references `references/config-migration.md`)
4. Scope (path/glob/directory, ask if missing)
5. Stack detection (where applicable)
6. Process (4 steps: context → scan → group by location → assess)
7. Reference (`references/<dim>-*.md`)
8. Output format (references `references/debt-output-format.md`)
9. What Makes This Different From a Linter (closing, consistent wording)

**Verification pattern (no code tests exist):**

Each skill task includes a verification step: dispatch a fresh subagent that invokes the skill against the matching fixture and reports the output. The verification passes if the output follows the shared format and surfaces the expected findings.

---

## Task 1: Create the shared output format reference

**Files:**
- Create: `references/debt-output-format.md`

- [ ] **Step 1: Write the file**

Content:

````markdown
# Debt Output Format

All debt-dimension skills (`code-debt`, `doc-debt`, `test-debt`, `dep-debt`, `design-debt`) produce output in this exact format so the `debt-audit` umbrella can parse sub-reports reliably.

## Required sections, in order

### Header block

```markdown
## <Dimension> Debt: <path>

**Config loaded:** .assistant-config.md
**Stack:** <detected or declared, or "not applicable">
**Scope:** <what was scanned>
```

If the config file is missing, replace the first value with `none (no config found)`. If the legacy file was found and migrated, add a second line: `**Migrated:** .inclusion-config.md → .assistant-config.md`.

### TL;DR

Two or three sentences: total count, dominant theme, top hotspot.

```markdown
### TL;DR
<sentences>
```

### Findings

Grouped by location (module/path), not by debt type. Each group:

```markdown
### Findings

**<module/path>** — <count> items
- `file:line` — <what + why it's debt>
- `file:line` — <what + why it's debt>

**Suggested triage:** Impact <H/M/L> · Effort <S/M/L> · Priority <P2/P3/P4>
```

The umbrella parses `file:line` entries from this section to build the location map.

### Cross-cutting themes

```markdown
### Cross-cutting themes
<Prose describing patterns that span multiple locations, or the phrase "None observed.">
```

### Ready-to-file items

Top three to five findings as triage-ready blocks:

```markdown
### Ready-to-file items

**Title:** <actionable title>

**Description:** <what + why it matters>

**Acceptance criteria:**
- [ ] <testable condition>
- [ ] <testable condition>

**Labels:** <type>, <priority>, <area>

---
```

### What's acceptable

```markdown
### What's acceptable
<List of acknowledged items from config, or "No acknowledged items for this dimension.">
```

## Parsing contract (for umbrella)

The umbrella reads sub-report output and extracts:

1. Dimension name from `## <Dimension> Debt:` header
2. Every `file:line` match inside `### Findings` sections
3. The single Impact/Effort/Priority triple per location group
4. Ready-to-file items as complete blocks

Dimension skills MUST NOT deviate from this format. Consistency is the contract.
````

- [ ] **Step 2: Commit**

```bash
git add references/debt-output-format.md
git commit -m "docs: add shared debt output format reference"
```

---

## Task 2: Create the shared config migration reference

**Files:**
- Create: `references/config-migration.md`

- [ ] **Step 1: Write the file**

Content:

````markdown
# Config Migration Preflight

All config-reading skills in this plugin perform this preflight before reading config. The migration runs silently — no user prompt.

## Steps

1. Check if `.assistant-config.md` exists in the project root.
2. If it exists, proceed to normal config handling.
3. If it does not exist, check if `.inclusion-config.md` exists.
4. If the legacy file exists, rename it:

```bash
mv .inclusion-config.md .assistant-config.md
```

5. In the skill's output header, add one line: `**Migrated:** .inclusion-config.md → .assistant-config.md`.
6. Proceed with the migrated file.
7. If neither file exists, the skill handles the no-config case per its own convention (prompt user, auto-detect, or skip).

## Rationale

The plugin is the Gotrino Assistant. The config is the assistant's project-scoped memory. Its old name (`.inclusion-config.md`) reflected a narrower purpose. The rename is a one-time migration.

## Why silent (no prompt)

The rename is mechanical. Users see the change in `git status` anyway. Asking for confirmation adds friction without adding safety.

## Dual-read fallback

If the rename fails for any reason (permissions, filesystem), skills fall back to reading `.inclusion-config.md` directly and note the fallback in output. This safety net will be removed one release after this change.
````

- [ ] **Step 2: Commit**

```bash
git add references/config-migration.md
git commit -m "docs: add shared config migration reference"
```

---

## Task 3: Create test fixture for code-debt

**Files:**
- Create: `test-fixtures/debt-code-sample.ts`

- [ ] **Step 1: Write the fixture**

```typescript
// TODO: refactor this into smaller functions
// FIXME: handles undefined inputs incorrectly
// HACK: remove once the API returns proper types

import { legacyAuth } from './deprecated-auth'; // deprecated: use modernAuth

const MAGIC_TIMEOUT = 47000;

export function processOrder(order: any) {
  // old implementation, kept for reference
  // const result = oldProcess(order);
  // return result;

  if (order.status === 'pending') {
    if (order.customer) {
      if (order.customer.verified) {
        if (order.items.length > 0) {
          if (order.total > 0) {
            if (order.total < MAGIC_TIMEOUT) {
              return legacyAuth(order);
            }
          }
        }
      }
    }
  }
  return null;
}

function unusedHelper() {
  return 'never called';
}
```

- [ ] **Step 2: Commit**

```bash
git add test-fixtures/debt-code-sample.ts
git commit -m "test: add code-debt fixture"
```

---

## Task 4: Create the code-debt reference

**Files:**
- Create: `references/code-debt-patterns.md`

- [ ] **Step 1: Write the file**

Content:

````markdown
# Code Debt Patterns

Patterns `code-debt` looks for. Grep-visible signals, grouped by category.

## Inline markers

- `TODO` — intended future work that hasn't shipped
- `FIXME` — known bug marked but not fixed
- `HACK` — acknowledged workaround
- `XXX` — warning about risky code
- `NOTE` with negative framing ("note: this is broken")

Context matters. A `TODO` with an owner, date, and linked issue is a tracked item, not debt. A bare `TODO: fix this` is debt.

## Deprecated APIs

Look for:
- `@deprecated` JSDoc/TSDoc tags on imported symbols
- Comments saying "deprecated" near imports
- Framework-specific deprecation calls: `componentWillMount`, `UNSAFE_`, etc.

## Dead code

- Commented-out blocks longer than two lines
- Functions defined but never exported and never called locally
- Unreachable branches (`if (false)`, `return; <more code>`)
- Exported symbols with no matching import across the codebase

## Oversized units

Heuristic defaults:
- Function body longer than 50 lines
- File longer than 300 lines
- Nesting deeper than 4 levels

Overridable in `.assistant-config.md` under `Debt Scope`:

```markdown
| code-debt.max-function-lines | 80 |
| code-debt.max-file-lines | 500 |
| code-debt.max-nesting | 5 |
```

## Magic numbers

Numeric literals in conditions or calculations that aren't `0`, `1`, `-1`, `2`, or declared constants. Time/size values are the most common offenders.

## What's not debt

- Single-line comments explaining non-obvious behavior (the good kind of comment)
- Short utility functions even if "simple"
- Explicit type assertions when the type system can't infer

The central question: *what does this code still owe us that we haven't paid?*
````

- [ ] **Step 2: Commit**

```bash
git add references/code-debt-patterns.md
git commit -m "docs: add code-debt patterns reference"
```

---

## Task 5: Write the code-debt skill

**Files:**
- Create: `skills/code-debt/SKILL.md`

- [ ] **Step 1: Write the skill**

````markdown
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
````

- [ ] **Step 2: Verify against fixture**

Dispatch a fresh subagent (use the `general-purpose` agent) with this prompt:

> "Read the skill at `skills/code-debt/SKILL.md` and the fixture at `test-fixtures/debt-code-sample.ts`. Act as if the skill were invoked with scope `test-fixtures/debt-code-sample.ts`. Follow the skill's process exactly. Produce output matching `references/debt-output-format.md`. Report: (1) the output, (2) whether the fixture's TODO, FIXME, HACK, deprecated import, commented-out block, magic number, deep nesting, and unused helper were all surfaced."

Expected: all eight patterns surface. Output matches the format contract exactly (header block, TL;DR, Findings grouped by location, Cross-cutting themes, Ready-to-file items, What's acceptable).

If any pattern is missed or the format deviates, update the skill and re-run.

- [ ] **Step 3: Commit**

```bash
git add skills/code-debt/SKILL.md
git commit -m "feat: add code-debt skill"
```

---

## Task 6: Create test fixture for doc-debt

**Files:**
- Create: `test-fixtures/debt-docs-sample/README.md`
- Create: `test-fixtures/debt-docs-sample/src/api.ts`

- [ ] **Step 1: Write the README fixture**

```markdown
# Sample Project

Version 0.3.1

## Installation

```bash
npm install sample-project@0.3
```

## Usage

See [the wiki](https://example.invalid/old-wiki) for details.

## API

Documented at `/docs/api.md` (TODO: write this).

## Environment variables

- `DATABASE_URL` — connection string

## Changelog

- 0.3.1 (2021-08-14) — initial release
```

- [ ] **Step 2: Write the src fixture**

```typescript
export function exportedButUndocumented(input: string) {
  return input.toUpperCase();
}

export function createUser(name: string, email: string, region: string) {
  // region param added 2024 but docs not updated
  return { name, email, region };
}

const SECRET_KEY = process.env.SECRET_API_KEY;
const TIMEOUT = process.env.REQUEST_TIMEOUT_MS;
```

- [ ] **Step 3: Commit**

```bash
git add test-fixtures/debt-docs-sample/
git commit -m "test: add doc-debt fixture"
```

---

## Task 7: Create the doc-debt reference

**Files:**
- Create: `references/doc-debt-checklist.md`

- [ ] **Step 1: Write the file**

Content:

````markdown
# Doc Debt Checklist

Signals `doc-debt` looks for.

## Staleness signals

- Version numbers in docs that don't match the manifest
- Dates older than 12 months on changelogs, release notes, or "last updated" lines
- Install commands pinning versions that no longer exist in the manifest
- Links to wikis, docs, or pages with "old", "legacy", "v1" in the path

## Missing documentation

- Exported functions/classes in source with no matching doc comment (JSDoc, docstring, etc.)
- Public API endpoints not mentioned in any README or API doc
- New function parameters added in code but not reflected in docs (compare signature vs. documented signature)

## Broken references

- Internal markdown links (`[text](./path)`) where the target doesn't exist
- Code references (`\`module.function\``) to symbols that no longer exist
- TODO markers inside docs ("TODO: write this")

## Undocumented environment variables

- `process.env.X`, `os.environ['X']`, `ENV['X']`, etc. in source — compare against README/docs mention

## Examples that don't match current API

- Code blocks in docs using deprecated function signatures
- Example output that doesn't match current return types

## What's not debt

- Internal helper functions don't need public docs
- Inline comments explaining *why* (keep these)
- Docs scoped to a specific version in a versioned docs site (not the main README)

The central question: *what would a new contributor misunderstand from the docs?*
````

- [ ] **Step 2: Commit**

```bash
git add references/doc-debt-checklist.md
git commit -m "docs: add doc-debt checklist reference"
```

---

## Task 8: Write the doc-debt skill

**Files:**
- Create: `skills/doc-debt/SKILL.md`

- [ ] **Step 1: Write the skill**

````markdown
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
````

- [ ] **Step 2: Verify against fixture**

Dispatch a fresh subagent:

> "Read `skills/doc-debt/SKILL.md` and the fixture at `test-fixtures/debt-docs-sample/`. Act as if the skill were invoked with that scope. Follow the skill's process. Produce output matching `references/debt-output-format.md`. Report: (1) the output, (2) whether these issues were surfaced: stale changelog date (2021), broken wiki link, TODO inside docs, undocumented `SECRET_KEY` and `TIMEOUT` env vars, undocumented exported function `exportedButUndocumented`, the `region` parameter not reflected in docs."

Expected: all six issues surface. Output matches format.

- [ ] **Step 3: Commit**

```bash
git add skills/doc-debt/SKILL.md
git commit -m "feat: add doc-debt skill"
```

---

## Task 9: Create test fixture for test-debt

**Files:**
- Create: `test-fixtures/debt-tests-sample.test.ts`
- Create: `test-fixtures/debt-tests-sample-source.ts`

- [ ] **Step 1: Write the test fixture**

```typescript
import { describe, it, expect } from 'vitest';
import { createAccount, deleteAccount, transferFunds } from './debt-tests-sample-source';

describe('createAccount', () => {
  it('creates an account', () => {
    expect(createAccount('alice')).toBeDefined();
  });

  it.skip('handles duplicate usernames', () => {
    // TODO: flaky, investigate
  });

  it('retries on network error', async () => {
    for (let i = 0; i < 5; i++) {
      try {
        await new Promise(r => setTimeout(r, 500));
        expect(createAccount('bob')).toBeDefined();
        break;
      } catch (e) {}
    }
  });
});

describe.skip('deleteAccount', () => {
  it('deletes', () => {});
});
```

- [ ] **Step 2: Write the source fixture**

```typescript
export function createAccount(username: string) {
  return { username };
}

export function deleteAccount(id: string) {
  return true;
}

export function transferFunds(from: string, to: string, amount: number) {
  return { from, to, amount };
}
```

- [ ] **Step 3: Commit**

```bash
git add test-fixtures/debt-tests-sample.test.ts test-fixtures/debt-tests-sample-source.ts
git commit -m "test: add test-debt fixture"
```

---

## Task 10: Create the test-debt reference

**Files:**
- Create: `references/test-debt-patterns.md`

- [ ] **Step 1: Write the file**

Content:

````markdown
# Test Debt Patterns

Pattern-based signals `test-debt` looks for. Analysis is static — this skill does not run coverage tools.

## Skipped tests

Per framework:
- **Jest/Vitest:** `it.skip`, `test.skip`, `describe.skip`, `xit`, `xdescribe`, `xtest`
- **Mocha:** `it.skip`, `describe.skip`, `xit`, `xdescribe`
- **Pytest:** `@pytest.mark.skip`, `@pytest.mark.skipif`, `@pytest.mark.xfail`
- **RSpec:** `xit`, `xdescribe`, `pending`, `skip`
- **Go:** `t.Skip`, `t.SkipNow`
- **JUnit:** `@Disabled`, `@Ignore`

A skipped test with a linked issue is tracked. A skipped test with `TODO: flaky` is debt.

## Untested public APIs

Grep for exported symbols. For each, check whether the symbol name appears in any test file. Missing → potential untested surface.

Conservative signal. A function used only internally by another tested function has transitive coverage. Flag untested *public* APIs (exported from entry points) as higher priority.

## Flaky patterns

- Retry loops inside tests (`for (let i = 0; i < N; i++) { try ... catch ... }`)
- `sleep`, `setTimeout`, or `Thread.sleep` inside tests (polling instead of deterministic waits)
- `--retries` flags in test config or CI
- Timeouts set unusually high (>30s for unit tests)
- Tests that `try/catch` and swallow errors

## Missing edge cases

Harder to detect statically. Signals:
- Test names that only cover happy paths ("creates a thing", "returns a value")
- No tests for error handling branches that exist in source
- No tests for boundary conditions (empty inputs, null, limits)

## What's not debt

- `skip` with a linked ticket and a note (tracked)
- Tests that legitimately need polling (filesystem watchers, subscription patterns)
- Integration tests with longer timeouts

The central question: *what confidence are we missing, and which code changes are riskier because of it?*
````

- [ ] **Step 2: Commit**

```bash
git add references/test-debt-patterns.md
git commit -m "docs: add test-debt patterns reference"
```

---

## Task 11: Write the test-debt skill

**Files:**
- Create: `skills/test-debt/SKILL.md`

- [ ] **Step 1: Write the skill**

````markdown
---
name: test-debt
description: Surface test-suite debt — skipped tests, untested public APIs, flaky patterns (retries, sleeps), missing edge cases. Pattern-based static analysis; does not run coverage tools. Use when tests feel unreliable or before a release.
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Test Debt

Surface debt in the test suite — what's skipped, what's untested, what's flaky by design.

## Philosophy

> "What confidence are we missing, and which code changes are riskier because of it?"

A test suite with a hundred skipped tests is lying to the team about what's covered. A retry loop in a test is telling you the real behavior isn't deterministic. Test debt is where the suite stops being a safety net.

Not a coverage report. This skill is pattern-based — it reads test files and source files, and spots the gaps between them. Runtime coverage is a complementary tool, not this skill's job.

## Scope

User specifies a path, glob, or directory. If not specified, ask: *"Which directory or test file should I audit?"*

## Config Integration

Follow `references/config-migration.md` for preflight.

Read `.assistant-config.md` for:
- **Test location** (set by `/teach-charter`)
- **Stack** (determines skip patterns per framework)
- **Acknowledged Debt**

## Stack Detection

Detect test framework from dev dependencies / manifest:
- `jest`, `vitest`, `mocha`, `cypress`, `playwright` in `package.json`
- `pytest` in `requirements.txt` / `pyproject.toml`
- `rspec` in `Gemfile`
- Built-in `testing` package for Go
- `junit` / `testng` for JVM projects

Use the right skip patterns. See `references/test-debt-patterns.md`.

## Process

### 1. Understand context

Locate the test directory. Count test files. Note the framework in use.

### 2. Scan

- **Skipped tests:** Grep for framework-specific skip markers.
- **Flaky patterns:** Grep for retry loops, `sleep`/`setTimeout` inside test files, high timeouts.
- **Untested public APIs:** Glob source, identify exported symbols (language-specific), cross-reference against test files.

### 3. Group by location

Group by test file (for skips and flakiness) or by source module (for untested APIs).

### 4. Assess impact

- **High:** skipped tests on critical paths, untested public APIs on entry points
- **Medium:** flaky patterns in core test suites
- **Low:** skipped tests with tracked issues, untested internal helpers

## Reference

- `references/test-debt-patterns.md`
- `references/debt-output-format.md`
- `references/config-migration.md`

## Output format

Follow `references/debt-output-format.md` exactly.

## What Makes This Different From a Linter

A linter flags `it.skip` every time. This skill asks: *is this skip tracked, or is it an unowned promise? Is this retry loop legitimate, or is the test fighting non-determinism? Is this exported function genuinely untested, or transitively covered?*

The value is the second-order read, not detection.
````

- [ ] **Step 2: Verify against fixture**

Dispatch a fresh subagent:

> "Read `skills/test-debt/SKILL.md`, the test fixture at `test-fixtures/debt-tests-sample.test.ts`, and the source fixture at `test-fixtures/debt-tests-sample-source.ts`. Act as if the skill were invoked with scope `test-fixtures/`. Follow the skill's process. Produce output matching `references/debt-output-format.md`. Report: (1) the output, (2) whether these issues were surfaced: `it.skip` on duplicate usernames, `describe.skip` on deleteAccount, retry loop with sleep in 'retries on network error', untested exported function `transferFunds`."

Expected: all four surface.

- [ ] **Step 3: Commit**

```bash
git add skills/test-debt/SKILL.md
git commit -m "feat: add test-debt skill"
```

---

## Task 12: Create test fixture for dep-debt

**Files:**
- Create: `test-fixtures/debt-deps-sample/package.json`
- Create: `test-fixtures/debt-deps-sample/src/index.js`

- [ ] **Step 1: Write the manifest fixture**

```json
{
  "name": "debt-deps-sample",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "^3.10.1",
    "request": "^2.88.0",
    "axios": "^0.21.0",
    "left-pad": "^1.3.0",
    "moment": "^2.29.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/node": "^20.0.0"
  }
}
```

- [ ] **Step 2: Write the source fixture**

```javascript
const axios = require('axios');
const _ = require('lodash');

module.exports = {
  fetch: (url) => axios.get(url),
  merge: (a, b) => _.merge(a, b),
};
```

- [ ] **Step 3: Commit**

```bash
git add test-fixtures/debt-deps-sample/
git commit -m "test: add dep-debt fixture"
```

---

## Task 13: Create the dep-debt reference

**Files:**
- Create: `references/dep-debt-manifests.md`

- [ ] **Step 1: Write the file**

Content:

````markdown
# Dep Debt — Manifests and Signals

Patterns `dep-debt` looks for across ecosystems.

## Supported manifests

| Ecosystem | Manifest | Lockfile |
|---|---|---|
| Node | `package.json` | `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` |
| Python | `pyproject.toml`, `requirements.txt`, `Pipfile` | `poetry.lock`, `Pipfile.lock` |
| Ruby | `Gemfile` | `Gemfile.lock` |
| Go | `go.mod` | `go.sum` |
| Rust | `Cargo.toml` | `Cargo.lock` |
| PHP | `composer.json` | `composer.lock` |

## Signals

### Outdated packages

Without running `npm outdated` / `pip list --outdated`, use static signals:
- Major version below current (known via Grep against package registry references or commonly-known recent versions)
- Packages pinned to pre-1.0 versions of libraries that have shipped 1.0+ (`axios: ^0.21`, `typescript: ^3.x`)
- Packages on known-deprecated versions (React <16, Node <18, Python <3.9)

When unsure, flag as "verify with package manager" rather than assert outdated.

### Abandoned/deprecated packages

Known-abandoned (as of early 2026):
- `request` (deprecated since 2020)
- `moment` (maintenance mode since 2020, recommended to migrate to luxon/date-fns/temporal)
- `node-uuid` (renamed to `uuid`)
- `gulp-util`

List is illustrative; users should verify via npm registry.

### Unused dependencies

Cross-reference `dependencies` and `devDependencies` against imports in source:
- `import X from 'Y'` / `require('Y')` / `from Y import` — Y must be a declared dep
- Declared deps with no matching import anywhere → unused

Scripts can use deps indirectly (CLI tools, loaders). Flag with caveat: "appears unused; verify build scripts".

### Duplicate / version drift

Multiple manifests in a monorepo that declare the same dependency at different versions. Grep each manifest's deps sections and compare.

### Security advisories

Without a vulnerability database, this skill does not assert CVE matches. Flag "verify with `npm audit` / `pip-audit`" as part of the recommendation. Known major incidents (e.g. `event-stream` 2018, `colors`/`faker` 2022) can be called out by name if spotted.

## What's not debt

- Locked versions with clear rationale in config
- Pre-1.0 deps that haven't released 1.0 (still being signaled as unstable is intentional)
- Dev-only deps on older versions (less critical than runtime)

The central question: *which dependencies will bite us, and when?*
````

- [ ] **Step 2: Commit**

```bash
git add references/dep-debt-manifests.md
git commit -m "docs: add dep-debt manifests reference"
```

---

## Task 14: Write the dep-debt skill

**Files:**
- Create: `skills/dep-debt/SKILL.md`

- [ ] **Step 1: Write the skill**

````markdown
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
````

- [ ] **Step 2: Verify against fixture**

Dispatch a fresh subagent:

> "Read `skills/dep-debt/SKILL.md` and the fixture at `test-fixtures/debt-deps-sample/`. Act as if the skill were invoked with that scope. Follow the skill's process. Produce output matching `references/debt-output-format.md`. Report: (1) the output, (2) whether these issues were surfaced: lodash pinned to v3 (major behind current v4), `request` abandoned, `moment` in maintenance mode, `axios` pre-1.0, `left-pad` appears unused (not imported)."

Expected: all five surface. `jest` should NOT be flagged as unused (it's a devDep, runs via CLI).

- [ ] **Step 3: Commit**

```bash
git add skills/dep-debt/SKILL.md
git commit -m "feat: add dep-debt skill"
```

---

## Task 15: Create test fixture for design-debt

**Files:**
- Create: `test-fixtures/debt-design-sample/handlers/userHandler.ts`
- Create: `test-fixtures/debt-design-sample/handlers/orderHandler.ts`
- Create: `test-fixtures/debt-design-sample/services/paymentService.ts`

- [ ] **Step 1: Write the handlers**

`userHandler.ts`:
```typescript
export async function createUser(req: any, res: any) {
  try {
    const user = await db.users.insert(req.body);
    res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
```

`orderHandler.ts`:
```typescript
export async function createOrder(req: any, res: any) {
  const order = await db.orders.insert(req.body);
  res.send(order);
}

export async function getOrder(req: any, res: any) {
  const order = await db.orders.find(req.params.id);
  if (!order) {
    throw new Error('not found');
  }
  res.send(order);
}
```

`paymentService.ts`:
```typescript
import { db } from '../db';

export async function chargeCard(userId: string, amount: number) {
  const order = await db.orders.find({ userId });
  const user = await db.users.find(userId);
  return { charged: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add test-fixtures/debt-design-sample/
git commit -m "test: add design-debt fixture"
```

---

## Task 16: Create the design-debt reference

**Files:**
- Create: `references/design-debt-signals.md`

- [ ] **Step 1: Write the file**

Content:

````markdown
# Design Debt Signals

Pattern-based signals `design-debt` looks for.

## Inconsistent error handling

Across similar code paths (e.g. all HTTP handlers), the shape of error responses, use of try/catch, and throw-vs-return patterns should be consistent.

Signals:
- Some handlers `try/catch` and return JSON errors; others let exceptions propagate
- Some handlers return `{ ok: false, error }`; others return `{ error }` or just a status code
- Some return `res.json()`; others use `res.send()`

## Inconsistent response shapes

Same concept, different envelopes:
- `{ ok: true, data }` vs. raw payload vs. `{ status: 'success', result }`

## Inconsistent naming

- File naming: `userHandler.ts` vs. `order-handler.ts` vs. `PaymentHandler.ts`
- Function naming: `createUser` vs. `create_order` vs. `PaymentService.create`

## Architectural drift

If `.assistant-config.md` declares **Architecture Principles** (e.g. "handlers in `src/api/`, business logic in `src/services/`, data access in `src/db/`"), compare reality against that.

Signals of drift:
- Business logic in handlers (e.g. DB calls inside an HTTP handler)
- Services importing handlers (wrong direction)
- Modules bypassing declared layers

Without declared principles, infer the dominant pattern from the codebase and flag files that deviate from it.

## Duplicated logic

- Two files with nearly identical functions (Grep for similar function signatures)
- Repeated inline validation or error-mapping code that could be shared
- Same external API called from multiple layers with slightly different wrappers

Don't flag every similarity. Three similar lines are better than a premature abstraction. Flag *duplication of business rules* specifically.

## What's not debt

- Different patterns in unrelated domains (a streaming handler vs. a CRUD handler can differ legitimately)
- Duplication across test files (tests can be repetitive intentionally)
- Framework-imposed conventions (don't flag Next.js route handlers for using Next.js patterns)

The central question: *is our system getting harder to reason about because of drift?*
````

- [ ] **Step 2: Commit**

```bash
git add references/design-debt-signals.md
git commit -m "docs: add design-debt signals reference"
```

---

## Task 17: Write the design-debt skill

**Files:**
- Create: `skills/design-debt/SKILL.md`

- [ ] **Step 1: Write the skill**

````markdown
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
````

- [ ] **Step 2: Verify against fixture**

Dispatch a fresh subagent:

> "Read `skills/design-debt/SKILL.md` and the fixtures under `test-fixtures/debt-design-sample/`. Act as if the skill were invoked with scope `test-fixtures/debt-design-sample/`. Follow the skill's process. Produce output matching `references/debt-output-format.md`. Report: (1) the output, (2) whether these issues were surfaced: inconsistent error handling between userHandler (try/catch + JSON envelope) and orderHandler (no try/catch, `res.send`), architectural drift in paymentService (service doing direct DB queries on two tables instead of delegating)."

Expected: both patterns surface.

- [ ] **Step 3: Commit**

```bash
git add skills/design-debt/SKILL.md
git commit -m "feat: add design-debt skill"
```

---

## Task 18: Write the debt-audit umbrella skill

**Files:**
- Create: `skills/debt-audit/SKILL.md`

- [ ] **Step 1: Write the skill**

````markdown
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
````

- [ ] **Step 2: Verify the umbrella**

Dispatch a fresh subagent:

> "Read `skills/debt-audit/SKILL.md` and the five dimension skills in `skills/*-debt/`. Verify: (1) the umbrella's parsing contract matches the output format in `references/debt-output-format.md`; (2) the five dimension skills all conform to that format; (3) the umbrella's synthesis steps (location map, hotspot scoring, top 10 ranking) are implementable given the parseable fields. Report any inconsistencies."

Expected: no inconsistencies. If the subagent finds any, fix them in the relevant files.

- [ ] **Step 3: Commit**

```bash
git add skills/debt-audit/SKILL.md
git commit -m "feat: add debt-audit umbrella skill"
```

---

## Task 19: Update teach-charter — rename config, add Stack/Debt sections

**Files:**
- Modify: `skills/teach-charter/SKILL.md`

- [ ] **Step 1: Update frontmatter**

Existing frontmatter:
```yaml
---
name: teach-charter
description: Set up the Gotrino assistant for your project. Detects your stack, captures scope decisions, and creates a config that evolves with your project. Run once to get started, revisit to update decisions.
allowed-tools: Read, Grep, Glob, Write, AskUserQuestion
user-invocable: true
---
```

Add `Bash` to `allowed-tools` for the rename:

```yaml
allowed-tools: Read, Grep, Glob, Write, AskUserQuestion, Bash
```

- [ ] **Step 2: Add a migration preflight section at the top of the body**

After the existing `# Teach Charter` title and before `## Philosophy`, insert:

````markdown
## Migration preflight

Before anything else, check for the legacy config. If `.inclusion-config.md` exists in the project root and `.assistant-config.md` does not, rename it silently:

```bash
mv .inclusion-config.md .assistant-config.md
```

Note the migration in the output: `Migrated: .inclusion-config.md → .assistant-config.md`.

If both files exist, keep `.assistant-config.md` and leave the legacy file — the user will resolve.

See `references/config-migration.md` for the full migration contract.

---
````

- [ ] **Step 3: Update all file references from `.inclusion-config.md` to `.assistant-config.md`**

In the skill body, replace every mention of `.inclusion-config.md` with `.assistant-config.md`.

The existing skill has these mentions (verify with Grep):
- "Creates `.inclusion-config.md` with decisions documented"
- "Create `.inclusion-config.md` in project root"
- "Config saved to `.inclusion-config.md`"
- "If `.inclusion-config.md` already exists"
- "The skill adds to `.inclusion-config.md`"
- "**Read** `.inclusion-config.md` at start (if exists)"
- The generated config heading: `# Inclusion Plugin Configuration`

Replace that heading to:
```markdown
# Gotrino Assistant Configuration
```

- [ ] **Step 4: Add Stack section to the generated config template**

In the section labeled `### 5. Generate Config File`, between `## Project Context` and `## Task Management`, insert:

````markdown
---

## Stack

Detected on setup. Drives language-specific checks in the debt skills.

| Setting | Value |
|---------|-------|
| Languages | TypeScript, JavaScript |
| Frameworks | React 18 |
| Test runner | Vitest |
| Package manager | npm |
| Manifest files | package.json |

---
````

Match the existing table style.

- [ ] **Step 5: Add Debt Scope section**

After the existing `## Scope Decisions` section, insert:

````markdown
---

## Debt Scope

Which debt dimensions are relevant, which are out of scope, and any heuristic overrides.

| Dimension | Status | Notes |
|-----------|--------|-------|
| code-debt | In scope | |
| doc-debt | In scope | |
| test-debt | In scope | |
| dep-debt | In scope | |
| design-debt | In scope | |

### Heuristic overrides (optional)

| Key | Value |
|-----|-------|
| code-debt.max-function-lines | 50 |
| code-debt.max-file-lines | 300 |
| code-debt.max-nesting | 4 |

---

## Architecture Principles

Optional. If declared, `design-debt` uses these as ground truth for drift detection.

<Free-text description of intended architecture — layer boundaries, module responsibilities, import rules.>

---
````

- [ ] **Step 6: Add detection logic for Stack in the Process section**

In section `### 1. Detect Project Context`, add these detection items:

```markdown
Scan for:
- `package.json`, `requirements.txt`, `Gemfile`, etc. → Stack (language, package manager)
- `jest`, `vitest`, `mocha`, `pytest`, `rspec` in dev deps → Test runner
- `react-intl`, `i18next`, `gettext` → i18n setup
- `eslint-plugin-jsx-a11y`, `axe-core` → a11y tooling
- Test directories → Where fixtures live
- Docs directories → Where documentation lives
- `decisions/`, `docs/decisions/`, `docs/adr/` → Where decision records live
```

- [ ] **Step 7: Add Stack confirmation prompt**

In section `### 2. Present Findings for Correction`, update the detected settings table to include Stack entries:

```markdown
| Setting | Detected | Correct? |
|---------|----------|----------|
| Languages | TypeScript, JavaScript | |
| Frameworks | React 18 | |
| Test runner | Vitest | |
| Package manager | npm | |
| i18n setup | None detected | |
| a11y tooling | eslint-plugin-jsx-a11y | |
| Test location | src/__tests__/ | |
| Docs location | docs/ | |
| Decisions location | decisions/ | |
| Task management | None detected | |
```

- [ ] **Step 8: Add Debt Scope confirmation step**

After `### 4. Capture Priorities`, insert:

````markdown
### 4a. Capture Debt Scope

```markdown
### Debt Dimensions

All five dimensions run by default. Exclude any that don't apply to this project?

- [ ] Exclude code-debt (no source in scope)
- [ ] Exclude doc-debt (docs managed externally)
- [ ] Exclude test-debt (no tests yet / different strategy)
- [ ] Exclude dep-debt (no manifests)
- [ ] Exclude design-debt (monolith by design)
```

Use `AskUserQuestion` for each exclusion. Default: all in scope.

````

- [ ] **Step 9: Verify the edits**

Run:

```bash
grep -n "inclusion-config" skills/teach-charter/SKILL.md
```

Expected: only matches inside `references/config-migration.md` pointers (i.e., describing the legacy file name during migration). No references to it as the active config.

- [ ] **Step 10: Commit**

```bash
git add skills/teach-charter/SKILL.md
git commit -m "feat(teach-charter): rename config, add Stack and Debt Scope sections"
```

---

## Task 20: Update existing skills — dual-read config

Every skill in `skills/` that reads `.inclusion-config.md` needs to:
1. Prefer `.assistant-config.md`
2. Fall back to `.inclusion-config.md` if the new file doesn't exist (after the migration preflight runs)
3. Reference `references/config-migration.md`

**Files to modify:**
- `skills/triage/SKILL.md`
- `skills/inclusion-audit/SKILL.md`
- `skills/examples-audit/SKILL.md`
- `skills/i18n-check/SKILL.md`
- `skills/language-check/SKILL.md`
- `skills/names-check/SKILL.md`
- `skills/inclusive-names/SKILL.md` (if applicable)
- `skills/impact/SKILL.md` (if applicable)
- `skills/test-assumption/SKILL.md` (if applicable)
- `skills/explain/SKILL.md` (if applicable)

- [ ] **Step 1: Identify which skills read the config**

Run:

```bash
grep -l "inclusion-config" skills/*/SKILL.md
```

Expected output: list of all skills touching the config. This becomes the modification set.

- [ ] **Step 2: Update each skill's frontmatter to add `Bash`**

For each skill in the modification set, change:

```yaml
allowed-tools: Read, Grep, Glob
```

To:

```yaml
allowed-tools: Read, Grep, Glob, Bash
```

If the skill already has additional tools, keep them and append `Bash`.

- [ ] **Step 3: Update config integration text**

For each skill, find the "Config Integration" (or equivalent) section and replace the reference.

**Before:**
```markdown
Before starting, check for `.inclusion-config.md` in the project root.
```

**After:**
```markdown
Before starting, follow the migration preflight in `references/config-migration.md`, then read `.assistant-config.md` from the project root.
```

Any subsequent references to `.inclusion-config.md` in the same skill should be changed to `.assistant-config.md`.

- [ ] **Step 4: Verify each skill individually**

For each modified skill, run:

```bash
grep -n "inclusion-config" skills/<skill-name>/SKILL.md
```

Expected: no matches (the skill now only mentions `.assistant-config.md`). The dual-read safety net is implemented inside `references/config-migration.md`; skills just follow that reference.

- [ ] **Step 5: Commit as one atomic change**

```bash
git add skills/triage/SKILL.md skills/inclusion-audit/SKILL.md skills/examples-audit/SKILL.md skills/i18n-check/SKILL.md skills/language-check/SKILL.md skills/names-check/SKILL.md
# Add any others identified in Step 1
git commit -m "refactor: existing skills use .assistant-config.md with migration preflight"
```

---

## Task 21: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read current README**

Confirm the current shape of the commands table.

- [ ] **Step 2: Add Debt Analysis section to the commands tables**

After the existing `### Triage & Planning` table, add:

```markdown
### Debt Analysis
| Command | What it does |
|---------|--------------|
| `/code-debt [path]` | Find TODO markers, dead code, deprecated APIs, magic numbers, oversized units |
| `/doc-debt [path]` | Find stale docs, missing public API docs, broken links, undocumented env vars |
| `/test-debt [path]` | Find skipped tests, untested public APIs, flaky patterns |
| `/dep-debt` | Find outdated, unused, or abandoned dependencies |
| `/design-debt [path]` | Find inconsistent patterns, architectural drift, duplicated logic |
| `/debt-audit [path]` | Run all debt dimensions and synthesize cross-cutting findings |
```

- [ ] **Step 3: Add a config rename note**

Near the Quick Start section, add:

```markdown
## Config rename (v0.2+)

The project config has been renamed from `.inclusion-config.md` to `.assistant-config.md`. If you're upgrading from an earlier version, the rename happens automatically the first time any skill runs. You'll see one line in the output: `Migrated: .inclusion-config.md → .assistant-config.md`. No manual action needed.
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add debt commands to README and config rename note"
```

---

## Task 22: Update plugin.json and plugin-help

**Files:**
- Modify: `.claude-plugin/plugin.json`
- Modify: `skills/plugin-help/SKILL.md`

- [ ] **Step 1: Bump version in plugin.json**

Change the `version` field from `"0.1.0"` to `"0.2.0"`. Add `"debt"` to the `keywords` array.

- [ ] **Step 2: Update plugin-help to mention the new commands**

Read `skills/plugin-help/SKILL.md`. Add the debt commands to its command listing in the same pattern as the existing commands.

- [ ] **Step 3: Commit**

```bash
git add .claude-plugin/plugin.json skills/plugin-help/SKILL.md
git commit -m "chore: bump plugin version to 0.2.0, add debt commands to help"
```

---

## Task 23: End-to-end verification

- [ ] **Step 1: Dispatch a comprehensive verification subagent**

Prompt:

> "Read the implementation plan at `docs/superpowers/plans/2026-04-15-debt-skills.md` and the spec at `docs/superpowers/specs/2026-04-15-debt-skills-design.md`. For each of the six new skills (`code-debt`, `doc-debt`, `test-debt`, `dep-debt`, `design-debt`, `debt-audit`), verify:
>
> 1. The SKILL.md file exists with correct frontmatter (name, description, allowed-tools, user-invocable).
> 2. The skill body has all nine required sections (per the plan's Conventions).
> 3. The skill's output format exactly matches `references/debt-output-format.md`.
> 4. For dimension skills, the matching reference file in `references/` exists.
> 5. For dimension skills, a test fixture exists in `test-fixtures/`.
> 6. The umbrella's parsing contract is compatible with what dimension skills emit.
>
> Also verify:
> - No SKILL.md in the plugin still references `.inclusion-config.md` as the active config (only in migration context).
> - `README.md` lists the six new commands.
> - `plugin.json` version is 0.2.0.
>
> Report any gaps or inconsistencies."

- [ ] **Step 2: Fix any issues raised**

If the subagent reports gaps, fix them in the relevant files. Re-run verification.

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add <files>
git commit -m "fix: address end-to-end verification findings"
```

If no fixes needed, skip this commit step.

---

## Self-review checklist

(This is the plan author's self-review, not a task the implementer runs.)

1. **Spec coverage:** every spec section (Goal, Non-goals, Skills to create, Architecture, Output format, Umbrella synthesis, Config changes, Stack detection, Dimension selection, Teach-charter changes, Reference files, README updates, Integration with existing skills) maps to at least one task. ✓
2. **Placeholder scan:** no "TBD", "TODO", or "implement later" in task content. ✓
3. **Type consistency:** output format (`file:line`, Impact/Effort/Priority triple, Ready-to-file blocks) is defined once in `references/debt-output-format.md` and referenced everywhere — no drift. ✓
4. **Task ordering:** shared references (1, 2) precede skills that depend on them. Fixtures precede skill-write tasks that verify against them. Dimension skills precede the umbrella. Existing-skill updates happen after the new config name exists in the plan. ✓
