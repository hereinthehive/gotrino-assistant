# Gotrino - Inclusion Plugin

A Claude Code plugin for reviewing code with an inclusion lens.

## What It Does

This plugin helps you build more inclusive software by asking:

> "Who might this exclude? What assumptions are baked in?"

It's not a linter. It's a second pair of eyes that sees your code from the perspective of users who aren't like you.

## Quick Start

```bash
# Set up for your project (recommended)
/teach-charter

# Quick gut-check on code you just wrote
/guardian src/components/SignupForm.tsx

# Full audit before release
/inclusion-audit src/
```

## Available Commands

### Fast Checks
| Command | What it does |
|---------|--------------|
| `/guardian [path]` | Quick inclusion gut-check (lightweight, fast) |
| `/language-check [path]` | Scan for non-inclusive language |
| `/names-check [path]` | Check name diversity in examples |
| `/i18n-check [path]` | Find internationalization issues |

### Deeper Analysis
| Command | What it does |
|---------|--------------|
| `/examples-audit [path]` | Analyze mock data for cultural assumptions |
| `/inclusion-audit [path]` | Comprehensive inclusion review |
| `/test-assumption [path]` | Identify hidden assumptions about users |

### Utilities
| Command | What it does |
|---------|--------------|
| `/inclusive-names` | Generate diverse names for mock data |
| `/explain [path]` | Create decision record in `decisions/` |
| `/impact [path]` | Analyze change impact before making it |

### Setup
| Command | What it does |
|---------|--------------|
| `/teach-charter` | Configure plugin for your project |
| `/plugin-help` | Show all commands and workflow |

## Configuration

Run `/teach-charter` to create `.inclusion-config.md` in your project root. This stores:

- **Scope decisions**: What's in/out of scope (e.g., i18n for US-only products)
- **Acknowledged findings**: Issues you've reviewed and accepted as intentional
- **Priorities**: What matters most for your team
- **Project context**: Where your tests, docs, and decisions live

Once configured, the plugin respects your decisions and won't nag you about acknowledged issues.

### Example Workflow

```
You: "Create a registration form"
Claude: [creates form with gender dropdown: Male/Female]

You: "/guardian src/components/RegisterForm.tsx"
Guardian: "⚠️ Binary gender field excludes non-binary users"

You: "That's intentional - we need it for legal compliance"
Guardian: "Added to config with rationale. Won't flag again."
```

## Typical Workflow

**Starting a new project:**
1. Run `/teach-charter` to set up configuration
2. Define your scope (US-only? Global?)
3. Set priorities for your team

**During development:**
- Run `/guardian` after generating forms, UI, or examples
- Chain it: "create the signup form, then /guardian it"
- Run focused checks as needed

**Before shipping:**
- Run `/inclusion-audit` for comprehensive review
- Run `/test-assumption` on user-facing flows

## File Structure

```
.claude-plugin/
  plugin.json           # Plugin metadata

references/
  charter-core.md       # Core inclusion principles
  language-terms.md     # Inclusive language alternatives
  i18n-checklist.md     # Internationalization checklist
  diverse-names.md      # Names by region + edge cases
  assumption-test.md    # Assumption analysis framework
  examples-checklist.md # Mock data audit checklist

skills/
  guardian/             # Quick inclusion check (agent)
  language-check/       # Language scan
  names-check/          # Name diversity check
  i18n-check/           # Internationalization issues
  examples-audit/       # Cultural assumption audit
  inclusive-names/      # Diverse name generator
  inclusion-audit/      # Comprehensive audit
  teach-charter/        # Project setup & config
  explain/              # Decision documentation
  impact/               # Change impact analysis
  test-assumption/      # Assumption test
  plugin-help/          # Help & command reference

agents/
  inclusion-guardian.md # Quick review agent (haiku model)
```

## Design Philosophy

1. **Judgment over pattern-matching**: Understands context before flagging issues
2. **Explains why**: Shows who's excluded, not just what's wrong
3. **Actionable**: Provides specific fixes, not vague complaints
4. **Respects decisions**: Config stores acknowledged findings so they don't repeat
5. **Layered depth**: Quick checks for daily use, thorough audits when needed
6. **Humble**: Recommends dedicated a11y tools for runtime accessibility testing

## What It Checks

- **Language**: Gendered, ableist, or exclusionary terms in code and docs
- **Names**: Western-centric placeholder names in examples and test data
- **i18n**: Hardcoded dates, currencies, US-only fields, LTR assumptions
- **Assumptions**: Hidden assumptions about users' abilities, identities, circumstances
- **Examples**: Cultural assumptions in mock data (holidays, food, family structures)

## What It Doesn't Do

- **Runtime accessibility testing**: Use axe-core, pa11y, or Lighthouse instead
- **Automated fixes**: It reviews and suggests; you decide what to change
- **Enforce compliance**: It's a thinking tool, not a gate

## Contributing

Contributions welcome:
- Add terms to language reference
- Expand name diversity lists
- Improve assumption categories
- Add regional/cultural context

## License

MIT License - see [LICENSE](LICENSE)

## Credits

- **Author**: Dan Donald ([hereinthehive.com](https://hereinthehive.com))
- **Part of**: [Gotrino](https://gotrino.com) design system tools
