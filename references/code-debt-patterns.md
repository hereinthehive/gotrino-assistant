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

## Rename / identifier drift

When a project-wide rename is partially applied, the surviving mentions of the old identifier are debt.

Signals:
- An identifier (class, config file, env var, command) appearing in both old and new forms across the tree
- Migration notes or release notes referencing a renamed thing while code still uses the old name
- A recent commit with "rename X to Y" in the message, followed by lingering uses of X

Scan the **whole tree** for this pattern, not just source. Config files, `.gitignore`, agent definitions, CI configs, templates, and docs all commonly hold the old name after a source-only rename. The blast radius is the point — a rename that stopped at the source boundary is the bug.

When flagging, show both locations (old mention and where the new name lives) so the reviewer sees the drift, not just an orphan string.

## Magic numbers

Numeric literals in conditions or calculations that aren't `0`, `1`, `-1`, `2`, or declared constants. Time/size values are the most common offenders.

## What's not debt

- Single-line comments explaining non-obvious behavior (the good kind of comment)
- Short utility functions even if "simple"
- Explicit type assertions when the type system can't infer

The central question: *what does this code still owe us that we haven't paid?*
