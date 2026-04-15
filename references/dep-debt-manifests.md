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
