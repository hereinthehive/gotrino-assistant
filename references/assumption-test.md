# Test of Assumption

Quick reference for identifying hidden assumptions about users. Source: Charter §8.9

## The Core Question

> **"What am I assuming about the person using this?"**

Ask this before releasing any component, documentation, or example.

## Assumption Categories

### Ability Assumptions
- **Physical:** Can use mouse, has two hands, can hold device steady
- **Sensory:** Can see screen, can distinguish colors, can hear audio
- **Cognitive:** Can read quickly, can remember multiple steps, can focus
- **Technological:** Has fast internet, has modern device, knows common gestures

### Identity Assumptions
- **Gender:** Binary (male/female), matches presentation, uses gendered pronouns
- **Age:** Young and tech-savvy, or specific generation
- **Race/Ethnicity:** Default to majority group, Western cultural context
- **Religion:** Celebrates Christmas, no dietary restrictions, Sunday is day off
- **Sexual Orientation:** Heterosexual, in traditional relationship structure

### Circumstance Assumptions
- **Economic:** Has credit card, can afford subscription, owns home/car
- **Family:** Has parents, is married, has children, nuclear family structure
- **Location:** In US, has stable address, specific timezone, high-speed internet
- **Education:** College-educated, speaks English fluently, knows technical terms
- **Employment:** Has job, works standard hours, professional context
- **Housing:** Has permanent address, stable living situation
- **Political:** Lives in democracy, can vote, safe to express political views

### Experience Assumptions
- **Life Events:** Birthdays are celebrated, holidays are joyful, milestones are positive
- **Trauma:** No content triggers, can see "memories", comfortable with reminders
- **Loss:** Has living parents (Mother's Day), no grief around dates

## Evaluation Framework

For each assumption found, ask:

1. **Is it necessary for functionality?**
   - YES → Document why, mitigate harm, provide alternatives
   - NO → Remove the assumption

2. **Could it exclude or harm someone?**
   - List specific scenarios
   - Consider intersectionality (multiple marginalized identities)

3. **Could it be designed without this assumption?**
   - Propose alternatives
   - Consider opt-in vs opt-out

## Quick Checklist

### Forms & Data Collection
- [ ] Gender field optional with inclusive options?
- [ ] No binary-only gender (Male/Female)?
- [ ] Name fields flexible (given/family, not first/last)?
- [ ] Address fields work internationally?
- [ ] "Prefer not to say" available?
- [ ] Collection justified (explained why needed)?

### UI & Interactions
- [ ] Works with keyboard only?
- [ ] Works with screen readers?
- [ ] No color-only indicators?
- [ ] No mouse-only interactions?
- [ ] No time pressure without extensions?

### Content & Examples
- [ ] Diverse names in examples?
- [ ] Culturally neutral contexts?
- [ ] No holiday assumptions?
- [ ] No dietary assumptions?
- [ ] No family structure assumptions?
- [ ] No economic assumptions?

### Celebrations & Life Events
- [ ] Birthday reminders optional?
- [ ] "On this day" features have opt-out?
- [ ] No forced celebration prompts?
- [ ] Sensitive defaults (opt-in, not opt-out)?

## The Guiding Principle

> **"When in doubt, design for choice, flexibility, and dignity."**

- Design for the most marginalized user
- Provide alternatives and opt-outs
- Never require disclosure without justification
