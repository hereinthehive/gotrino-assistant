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
