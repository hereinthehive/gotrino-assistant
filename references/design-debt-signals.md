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
