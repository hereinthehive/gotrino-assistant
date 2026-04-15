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
