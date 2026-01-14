# Internationalization Checklist

Quick reference for i18n issues. Source: Charter §7.1, §8.5

## Date/Time/Number Formats

### Issues to Flag
- `MM/DD/YYYY` or `MM-DD-YYYY` (US-only format)
- Hardcoded date formats without locale awareness
- String concatenation for dates
- Hardcoded currency symbols: `$`, `€`, `£`
- Hardcoded number formats (commas vs periods)

### Fixes
- Use `Intl.DateTimeFormat()` with locale parameter
- Use `Intl.NumberFormat()` for numbers/currency
- Store dates in ISO 8601, format at display time

## Text Direction (LTR/RTL)

### Issues to Flag
- Hardcoded `text-align: left` without RTL consideration
- `margin-left`, `padding-left` for directional spacing
- `float: left/right` for layout
- Directional icons (arrows) without RTL variants

### Fixes
- Use CSS logical properties: `margin-inline-start` not `margin-left`
- Use `dir="auto"` or detect locale
- Provide mirrored icons for RTL

## Text Expansion

### Issues to Flag
- Fixed pixel widths on text containers
- Small buttons/labels with no room for expansion
- `text-overflow: ellipsis` on containers that might truncate

### Why It Matters
- German text can be 30-40% longer than English
- Finnish, Dutch also expand significantly
- Chinese, Japanese often contract

### Fixes
- Use flexible layouts (flexbox, grid)
- Test with 200% text expansion
- Use `min-width` not `width`

## Hardcoded Strings

### Issues to Flag
- Concatenated strings: `"Hello " + name + "!"`
- Pluralization without i18n: `count + " items"`
- Embedded text in images

### Fixes
- Use i18n libraries (react-intl, i18next, gettext)
- Use ICU message format for plurals
- Keep text in translatable strings

## Address & Form Assumptions

### Issues to Flag
- `State` field (US-specific)
- `ZIP code` (US-specific; UK uses "postcode")
- 5-digit postal codes (varies globally)
- `First Name, Last Name` (many cultures use family name first)
- Phone number formats assuming one country

### Fixes
- Use `Region` or `Province` (generic)
- Use `Postal code` (generic)
- Use `Given name`, `Family name` or single `Full name`
- Use libphonenumber for phone validation
