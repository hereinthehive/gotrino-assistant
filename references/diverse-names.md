# Diverse Names Reference

Culturally diverse names for examples, mock data, and test fixtures.

## Why This Matters

Western-only placeholder names (John, Jane, Bob, Alice) signal that the product wasn't designed with global users in mind. Diverse names in examples demonstrate inclusive thinking.

But diversity isn't just about representation—it's also **better test data**. Names with apostrophes, diacritics, and non-Latin characters catch real bugs.

## Names by Region

### East Asian
**Chinese:** Wei Chen, Li Ming, Zhang Wei, Liu Yan, Wang Fang, Xiao Lin
**Japanese:** Yuki Tanaka, Kenji Yamamoto, Sakura Ito, Haruto Sato, Aiko Nakamura
**Korean:** Min-jun Kim, Ji-young Park, Seung-ho Lee, Soo-yeon Choi, Hyun-woo Jung

### South Asian
**Indian:** Priya Sharma, Arjun Patel, Ananya Gupta, Vikram Singh, Deepa Krishnan, Rohan Mehta
**Pakistani:** Fatima Khan, Ahmed Ali, Zara Hussain, Omar Malik, Ayesha Siddiqui
**Bangladeshi:** Rahim Chowdhury, Nasreen Begum, Karim Ahmed

### African
**West African:** Amara Okafor, Kwame Asante, Chidinma Eze, Oluwaseun Adeyemi, Adaeze Nwosu
**East African:** Tendai Moyo, Amina Osman, Jabari Kimani, Wanjiku Mwangi
**North African:** Youssef Benali, Leila Mansouri, Karim Haddad

### Middle Eastern
**Arabic:** Omar Hassan, Layla Al-Rashid, Yusuf Ibrahim, Nadia Khoury, Tariq Mahmoud
**Persian:** Dariush Tehrani, Shirin Ahmadi, Reza Mohammadi
**Turkish:** Elif Yilmaz, Mehmet Ozkan, Zeynep Demir

### Latin American
**Spanish-speaking:** Maria Garcia, Carlos Rodriguez, Ana Martinez, Diego Morales, Sofia Herrera
**Brazilian:** Lucas Silva, Isabela Santos, Pedro Oliveira, Mariana Costa

### European (Varied)
**Nordic:** Ingrid Larsson, Erik Johansson, Astrid Nielsen, Lars Andersen
**Southern European:** Giovanni Rossi, Sofia Papadopoulos, Elena Vasquez, Marco Bianchi
**Eastern European:** Mikhail Petrov, Katarina Novak, Andrei Popescu, Olga Kuznetsova
**Western European:** Sophie Dubois, Hans Mueller, Emma Williams, Pierre Laurent

### Oceanian
**Pacific Islander:** Teuila Sione, Manu Taulanga, Sione Fifita

### Gender-Neutral Options
Sam, Jordan, Alex, Morgan, Taylor, Jamie, Casey, Riley, Avery, Quinn

## Edge-Case Names for Testing

Names that catch bugs your "John Smith" tests will miss:

| Type | Examples | What It Tests |
|------|----------|---------------|
| Apostrophes | O'Brien, N'Golo, D'Angelo, O'Connor | String escaping, SQL injection |
| Diacritics | José, Müller, Björk, François, Zoë | Unicode handling, encoding |
| Single names | Suharto, Madonna, Pelé, Cher | Required field assumptions |
| Long names | Wolfeschlegelsteinhausenbergerdorff | Field length limits, UI overflow |
| Non-Latin | 田中太郎, Иванов, محمد, בן דוד | Character encoding, font support |
| Hyphenated | García-López, Smith-Jones, Lee-Wong | Parsing, display formatting |
| Particles | Ludwig van Beethoven, Leonardo da Vinci | Sorting algorithms |
| Spaces | Mary Jane Watson, Jean-Claude Van Damme | Multiple space handling |

**Quick edge-case set:**
```
O'Brien, José, Müller, 田中, Suharto, García-López
```

## Common Western Names to Replace

These are overused and signal Western-centrism:
- John, Jane, Bob, Alice, Joe, Mary, Mike, Sarah, Tom, Sue
- John Smith, Jane Doe, John Doe, Bob Jones
- user1, user2, testuser, admin

## Usage Guidelines

1. **Mix regions** - Don't cluster all names from one region
2. **Vary gender presentation** - Include names across the spectrum
3. **Include gender-neutral options** - Not everyone uses gendered names
4. **Respect naming conventions** - Note that some cultures put family name first
5. **Avoid stereotyping** - Don't pair names with assumed ethnicities in occupations
6. **Context matters** - A global company example might have more diversity than a local one

## Example Fixture

```javascript
const TEST_USERS = [
  { givenName: 'Amara', familyName: 'Okafor', displayName: 'Amara Okafor' },
  { givenName: 'Wei', familyName: 'Chen', displayName: 'Chen Wei' },
  { givenName: 'Priya', familyName: 'Sharma', displayName: 'Priya Sharma' },
  { givenName: 'Jordan', familyName: 'Al-Rashid', displayName: 'Jordan Al-Rashid' },
  { givenName: 'Sofia', familyName: 'Herrera', displayName: 'Sofia Herrera' },
];
```
