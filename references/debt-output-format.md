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