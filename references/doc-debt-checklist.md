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
- Code references (`` `module.function` ``) to symbols that no longer exist
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
