---
name: triage
description: Validate a task, gauge its impact, and decide what to do with it
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Triage

Assess an incoming request to determine whether it needs a response and, if so, the size, nature, and priority of that response.

Triage applies to all incoming work — new feature requests, bug reports, internal needs, and technical debt. These are not the same and should not be prioritised the same way. This process provides a shared framework for making that distinction.

## Config Integration

Before starting, follow the migration preflight in `references/config-migration.md`, then read `.assistant-config.md` from the project root.

If it exists, read the **Task Management** section to determine:
- **Tracker**: Where issues are managed (e.g. Linear, GitHub Issues, Jira)
- **Accessible via tools**: Whether you can create/search issues directly
- **Local tasks**: Where code-adjacent task files go

If the config doesn't exist or has no task management section, ask the user where they track work before routing (Step 5). Suggest running `/teach-charter` to set this up permanently.

## When to invoke

- A new request or bug arrives (from an issue tracker, chat, or conversation)
- Before starting work on something that hasn't been assessed
- When reprioritising existing work against new information

## Step 1: Classify the request

Ask the user (or determine from context) what type of work this is:

| Type | Description |
|------|-------------|
| **Bug** | Something that worked before and is now broken |
| **Feature** | A new capability that doesn't exist yet |
| **Enhancement** | Improvement to something that already works |
| **Debt** | Internal cleanup, refactoring, or infrastructure |

If unclear, ask: "Is this fixing something broken, adding something new, improving something existing, or cleaning something up?"

## Step 2: Check for duplicates

Before going further, check whether this already exists:

- If the project's tracker is accessible via tools (per config), search it for matching items
- Search the codebase for TODO/FIXME comments related to the issue
- Check the local task location (per config) for related task files
- If a duplicate exists, report it and ask whether to update the existing item or proceed as new

## Step 3: Assess the seven dimensions

Evaluate each dimension and assign a rating. Use your judgement and evidence from the codebase.

### Where
Is this localised to one place or spread across the codebase? Explore the project structure to determine which areas are affected:
- Single module or package
- Multiple modules with a shared boundary
- Cross-cutting (touches many parts of the system)

### Impact
Rate: **Critical** | **High** | **Medium** | **Low**
- Critical: Blocks users from core functionality
- High: Breaks a feature but workarounds exist
- Medium: Degrades experience but doesn't block usage
- Low: Cosmetic or minor annoyance

### Effort
Rate: **Unknown** | **Small** (< half day) | **Medium** (1-2 days) | **Large** (3+ days)
- If Unknown, the first action is investigation, not implementation
- If Large, it likely needs decomposition before work begins

### Blast radius
What else could be affected by the fix or change?
- Shared libraries or components affect all consumers
- Auth or session changes may require coordinated restarts or migrations
- External API changes may have rate limiting or compatibility implications
- Style or theme changes may cascade across many views

### Risk
- What happens if we do nothing?
- Does this risk blocking other in-flight work?
- Is there a release, deadline, or dependency at stake?
- Does this touch auth, security, or data integrity?

### Priority
Rate using concrete tiers:
- **P1** — Blocks user acquisition or breaks production functionality. Act now.
- **P2** — Blocks another task in active development. Schedule this week.
- **P3** — Improves quality or developer experience. Schedule when capacity allows.
- **P4** — Nice to have, no deadline. Backlog.

### Scope
If enough is known, define what a response looks like:
- Which files/components need to change
- Whether new infrastructure or dependencies are needed
- Whether this can be done in one PR or needs decomposition

When scoping, aim for the smallest response that solves the problem:

```
Level 1: Extend existing code slightly (5-10 lines)
Level 2: Add one small component/hook (<50 lines)
Level 3: Refactor existing systems
Level 4: New architecture

Most problems are solved at Level 1-2. If your proposed scope is Level 3-4, challenge whether a simpler response exists.
```

## Step 4: Make a recommendation

Based on the assessment, recommend one of:

| Decision | When |
|----------|------|
| **Act now** | P1 — drop current work and address this |
| **Schedule** | P2/P3 — create a task and slot it into priorities |
| **Investigate** | Effort is Unknown — needs a spike before committing |
| **Decompose** | Effort is Large — break into smaller pieces first |
| **Defer** | P4 — add to backlog, revisit later |
| **Decline** | Low impact, high effort, no deadline — say no with reasoning |

## Step 5: Draft the issue

Always produce a ready-to-use issue, regardless of whether the tracker is accessible. This is the primary deliverable — the user should be able to paste it straight into their tracker or hand it to a teammate with no further editing.

Draft the issue using the assessment from Steps 1-4:

- **Title**: Short, specific, actionable (e.g. "Fix: session token not cleared on logout" not "Auth bug")
- **Description**: What's happening, what should happen, and why it matters
- **Acceptance criteria**: Concrete, testable conditions for "done"
- **Labels/metadata**: Type, priority, affected area — formatted as the tracker expects if known from config

## Step 6: Route the work

Use the task management settings from `.assistant-config.md` to route appropriately:

- **Tracker accessible** → Create the issue directly using the available tools
- **Tracker not accessible** → Present the drafted issue for the user to copy into their tracker
- **Code-adjacent work** → Create a task file in the configured local task location
- **Link dependencies** if this blocks or is blocked by other work

If no config exists and you haven't already asked, ask the user where this should be tracked.

## Output format

Present the triage result followed by the drafted issue:

```
## Triage: [Brief title]

**Type**: Bug | Feature | Enhancement | Debt
**Where**: [Affected areas]
**Impact**: Critical | High | Medium | Low
**Effort**: Unknown | Small | Medium | Large
**Blast radius**: [One-line summary]
**Risk**: [Key risk if we do nothing]
**Priority**: P1 | P2 | P3 | P4

### Recommendation
[Act now | Schedule | Investigate | Decompose | Defer | Decline]

### Reasoning
[2-3 sentences explaining the recommendation]

---

### Ready-to-file issue

**Title:** [Actionable title]

**Description:**
[What's happening, what should happen, why it matters. Include relevant file paths or code references if known.]

**Acceptance criteria:**
- [ ] [Testable condition]
- [ ] [Testable condition]
- [ ] [Testable condition]

**Labels:** [type], [priority], [affected area]
```

## Flags for elevated scrutiny

Automatically flag if the request touches any of these areas:
- **Auth/session management** — identity, tokens, permissions
- **External API integrations** — third-party dependencies, rate limits
- **Database schema** — migrations, data integrity, access policies
- **Shared libraries or components** — blast radius across all consumers
- **Security boundaries** — input validation, secrets, encryption
