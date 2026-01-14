# Examples & Mock Data Checklist

Quick reference for auditing cultural assumptions in examples. Source: Charter §7.3, §8.4, §8.5

## Holiday & Event Assumptions

### Problematic
- Christmas, Easter, Thanksgiving (Christian/Western)
- "New Year" assuming January 1 (Chinese, Jewish, Islamic new years differ)
- Halloween, Valentine's Day, Mother's Day/Father's Day
- "Holiday season" assuming December

### Neutral Alternatives
- "important date", "celebration", "personal event"
- "time off", "holiday" (generic)
- "special occasion", "milestone"

## Food & Dietary Assumptions

### Problematic
- Hamburgers, bacon, steak (assumes meat-eating)
- Pork products (excludes Muslim, Jewish dietary laws)
- Beef products (excludes Hindu practices)
- Alcohol references (excludes religious and personal abstainers)

### Neutral Alternatives
- "meal", "dish", "food order"
- If listing options, include: vegetarian, vegan, halal, kosher, gluten-free, allergies

## Address & Location Assumptions

### Problematic
- "State" field (US-specific)
- "ZIP code" (US-specific; UK="postcode", varies globally)
- 5-digit postal codes (varies by country)
- "City, State ZIP" format
- Assuming street numbers exist
- "County" (different meaning in different countries)

### Neutral Alternatives
- "Region", "Province" (generic)
- "Postal code" (generic)
- Flexible address format or locale detection

## Payment Assumptions

### Problematic
- Credit card as default/only option
- US dollar ($) hardcoded
- Assuming bank account access
- "Billing address must match card"

### Neutral Alternatives
- Multiple payment methods
- Locale-aware currency
- Alternative payment options (mobile money, prepaid, cash)

## Name Format Assumptions

### Problematic
- "First Name, Last Name" (many cultures put family name first)
- Middle name fields (not universal)
- Assuming short names fit in fields
- Title as "Mr/Mrs/Ms" only

### Neutral Alternatives
- "Given name", "Family name"
- Single "Full name" field
- No character limits on name fields
- Inclusive title options or make optional

## Family Structure Assumptions

### Problematic
- "Mother" and "Father" only
- "Spouse" assuming one partner
- "Number of children" (sensitive topic)
- Nuclear family assumptions

### Neutral Alternatives
- "Parent/Guardian", "Caregiver"
- "Partner", "Emergency contact"
- "Household members", "People you live with"

## Economic Assumptions

### Problematic
- "Your home", "your car" (assumes ownership)
- Luxury examples ("your yacht", "summer home")
- Assuming credit history exists
- "When you bought your house"

### Neutral Alternatives
- Examples that don't assume wealth
- "Your location", "Where you're staying"
- Multiple economic contexts in examples

## Technology Assumptions

### Problematic
- Assuming high-speed internet
- Assuming smartphone ownership
- Assuming constant connectivity
- "Just download the app"

### Neutral Alternatives
- Consider offline scenarios
- Support multiple device types
- Progressive enhancement
- Web alternatives to apps
