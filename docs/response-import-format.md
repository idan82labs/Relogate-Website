# Response Import Format Specification v2.0

## Overview

This document defines the JSON format for importing destination response data into the Relogate admin dashboard. The format allows admins to prepare response content in advance and import it quickly.

**Version 2.0** introduces a more flexible structure where destinations are fully self-contained and can represent any location (city, country, region).

## File Format

- **Extension**: `.json`
- **Encoding**: UTF-8
- **Structure**: Single JSON object

## Schema v2.0

```json
{
  "version": "2.0",
  "destination": {
    "name": "לונדון",
    "subtitle": "בריטניה",
    "image": "https://...",
    "badge": "מומלץ במיוחד"
  },
  "match": {
    "score": 82,
    "reasons": ["שוק עבודה חזק", "קהילה ישראלית"],
    "visaType": "Skilled Worker Visa"
  },
  "narrative": {
    "introduction": "לונדון מציעה...",
    "pathway": "המסלול המתאים לכם...",
    "fit": "עם הניסיון שלך...",
    "benefits": "יתרונות רבים...",
    "highlights": ["קריירה בינלאומית", "בתי ספר מצוינים"]
  },
  "sections": [
    {
      "key": "visa",
      "title": "ויזה ותהליך",
      "icon": "🛂",
      "content": "**Skilled Worker Visa:**\n\n..."
    },
    {
      "key": "family",
      "title": "חיי משפחה בלונדון",
      "icon": "👨‍👩‍👧‍👦",
      "content": "**שכונות מומלצות:**\n\n..."
    }
  ]
}
```

## Field Descriptions

### Root Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Format version, must be "2.0" |
| `destination` | object | Yes | Destination information |
| `match` | object | No | Match scoring information |
| `narrative` | object | No | Personalized narrative content |
| `sections` | array | No | Flexible content sections |

### destination Object

Self-contained destination information (not linked to any master data).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Destination name (city, country, or region) |
| `subtitle` | string | No | Secondary text (e.g., country name for cities) |
| `image` | string | No | URL to destination image |
| `badge` | string | No | Special badge text (e.g., "מומלץ במיוחד") |

### match Object

Match scoring and reasoning.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `score` | number | Yes | Match percentage 0-100 |
| `reasons` | string[] | No | Short tags shown as badges (max 5 recommended) |
| `visaType` | string | No | Primary visa type name |

### narrative Object

Personalized narrative sections that tell the user's story.

| Field | Hebrew Label | Description |
|-------|--------------|-------------|
| `introduction` | הקדמה | Why this destination fits (high-level) |
| `pathway` | המסלול | The recommended path/process |
| `fit` | איך אתם מתאימים | How user matches requirements |
| `benefits` | יתרונות | Key benefits for this user |
| `highlights` | נקודות מרכזיות | Bullet list of highlights |

### sections Array

Flexible content sections that can be customized per destination.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Unique section identifier (e.g., "visa", "education") |
| `title` | string | Yes | Hebrew display title |
| `icon` | string | No | Emoji icon for the section |
| `content` | string | Yes | Markdown content |

#### Suggested Section Keys

| Key | Title | Icon | Description |
|-----|-------|------|-------------|
| `visa` | ויזה | 🛂 | Visa information |
| `safety` | ביטחון אישי | 🛡️ | Safety information |
| `healthcare` | מערכת בריאות | 🏥 | Healthcare system |
| `education` | חינוך | 🎓 | Education system |
| `employment` | תעסוקה | 💼 | Employment opportunities |
| `cost` | יוקר מחייה | 💰 | Cost of living |
| `community` | קהילה | 👥 | Community and social life |
| `transport` | תחבורה | 🚌 | Transportation |
| `climate` | אקלים | 🌤️ | Weather and climate |
| `housing` | דיור | 🏠 | Housing options |
| `family` | חיי משפחה | 👨‍👩‍👧‍👦 | Family life |

You can use any custom keys - the above are suggestions.

## Markdown Support

All text fields support basic Markdown:

- **Bold**: `**text**`
- *Italic*: `*text*`
- Bullet lists: Lines starting with `- `
- Numbered lists: Lines starting with `1. `
- Links: `[text](url)`
- Images: `![alt](url)`
- Headings: `### Heading` (use sparingly)

## Complete Example

```json
{
  "version": "2.0",
  "destination": {
    "name": "ליסבון",
    "subtitle": "פורטוגל",
    "image": "https://images.unsplash.com/lisbon.jpg",
    "badge": "מומלץ למשפחות"
  },
  "match": {
    "score": 87,
    "reasons": [
      "מסלול ברור",
      "קהילה ישראלית",
      "ביטחון גבוה",
      "יוקר מחייה נמוך"
    ],
    "visaType": "ויזת נוודים דיגיטליים (D8)"
  },
  "narrative": {
    "introduction": "פורטוגל מציעה שילוב מנצח של איכות חיים גבוהה, ביטחון אישי מצוין ומסלול הגירה ברור. עבור משפחתכם, זו הזדמנות להתחיל פרק חדש באירופה.",
    "pathway": "מסלול הנוודים הדיגיטליים (D8) מתחיל באשרת שהייה לשנתיים, עם אפשרות הארכה ל-3 שנים נוספות. אין צורך בספונסר מקומי.",
    "fit": "כעורכי דין עם יכולת עבודה מרחוק, אתם מתאימים בדיוק לדרישות. ההכנסה המשפחתית גבוהה מהסף הנדרש.",
    "benefits": "הילדים יוכלו להשתלב בחינוך ציבורי איכותי או בבתי ספר בינלאומיים. תמצאו קהילה ישראלית פעילה.",
    "highlights": [
      "חינוך בינלאומי באנגלית לילדים",
      "קהילה ישראלית חמה ותומכת",
      "מסלול הגירה ברור ויציב",
      "תושבות אירופית עם אופק לאזרחות",
      "יוקר מחיה זול מישראל ב-35%-40%"
    ]
  },
  "sections": [
    {
      "key": "visa",
      "title": "ויזה ותהליך",
      "icon": "🛂",
      "content": "**ויזת נוודים דיגיטליים (D8)**\n\nהויזה מיועדת לעובדים עצמאים או שכירים מחוץ לפורטוגל.\n\n**דרישות:**\n- הכנסה חודשית בגובה 4 פעמים שכר המינימום (כ-€3,480)\n- ביטוח בריאות בתוקף\n- רקע נקי פלילי\n\n**יתרונות:**\n- ניידות חופשית באירופה\n- גישה לשירותים ציבוריים\n- אפשרות לאזרחות לאחר 5 שנים"
    },
    {
      "key": "education",
      "title": "חינוך",
      "icon": "🎓",
      "content": "**מערכת החינוך הציבורית:**\n- חינם אך בפורטוגזית\n- איכות הלימודים גבוהה\n\n**בתי ספר בינלאומיים:**\n- זמינים בליסבון ופורטו\n- עלות: €7,000-15,000 לשנה\n- לימודים באנגלית"
    },
    {
      "key": "cost",
      "title": "יוקר מחייה",
      "icon": "💰",
      "content": "פורטוגל זולה מישראל בכ-35%-40%.\n\n**מגורים:**\n- שכירות בליסבון לדירת 3 חדרים: €1,000-1,500\n- בפורטו: €800-1,200\n\n**קניות:**\n- סופר מוזל משמעותית\n- ירקות, חלב, בשר, דגים ויין זולים מאוד"
    }
  ]
}
```

## Validation Rules

1. `version` must be "2.0"
2. `destination.name` is required and must not be empty
3. `match.score` must be an integer between 0 and 100 (if provided)
4. `match.reasons` should have maximum 5 items for best display
5. `narrative.highlights` should have maximum 6 items for best display
6. All markdown text should be properly escaped JSON strings
7. Section `key` should be unique within the sections array

## Best Practices

1. **Personalize content**: Reference the user's specific situation
2. **Keep summaries concise**: Narrative fields should be 2-3 paragraphs max
3. **Use bullet lists**: For highlights and complex information
4. **Include numbers**: Match scores, costs, distances help users compare
5. **Hebrew RTL**: Content should be written in Hebrew, the system handles RTL
6. **Meaningful icons**: Use relevant emojis for sections

## Migration from v1.0

The system supports importing v1.0 format files with automatic conversion:

- `countryCode` becomes `destination.name` (should be renamed)
- `matchScore` becomes `match.score`
- `personalizedContent` maps to `narrative`
- `categoryOverrides` converts to `sections`

It's recommended to update to v2.0 format for new files.
