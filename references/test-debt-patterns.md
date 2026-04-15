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
