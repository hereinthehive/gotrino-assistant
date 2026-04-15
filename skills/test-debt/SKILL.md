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
