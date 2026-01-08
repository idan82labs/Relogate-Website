# Eligibility Questionnaire - Implementation Plan

## Design Analysis (from Figma)

### Desktop Flow (3 steps)

| Step | Screen | Question | UI Components |
|------|--------|----------|---------------|
| 1 | step-country-preference | "מהן המדינות המועדפות שלך להגירה או רילוקיישן?" | 2x2 grid of toggle buttons (USA, Australia, Canada, "All good") |
| 2 | step-relocation-reason | "למה את/ה רוצה לעבור לחו"ל?" | Dropdown select for family status |
| 3 | step-personal-details | "בדוק את הזכאות שלך לויזה" | Multi-field form (10 fields) |

### Mobile Flow (Same 3 logical steps, adapted layout)

| Step | Screen | UI Differences |
|------|--------|----------------|
| 1 | mobile step-country-preference | Same 2x2 grid, full-width buttons |
| 2 | mobile step-relocation-reason | Text area input (different from desktop) |
| 3 | mobile step-personal-details | Single-column form, same fields |

### Common UI Elements (Both Platforms)

1. **Progress Indicator**
   - Horizontal line with active section highlighted
   - Section labels: "בדיקת זכאות" (Eligibility) / "העדפות" (Preferences)

2. **Back Button**
   - Top-right: "חזור" with chevron icon
   - Gray text (#C6C6C6)

3. **Continue Button**
   - Primary blue (#215388) pill button
   - Text: "שמור והמשך" or "המשך" with arrow icon

4. **Globe Watermark**
   - Centered background watermark (existing component)

---

## Implementation Architecture

### File Structure

```
src/
├── app/
│   └── test/
│       ├── page.tsx                    # Landing (existing)
│       └── question/
│           └── [step]/
│               └── page.tsx            # Dynamic question step route
├── components/
│   ├── desktop/
│   │   ├── QuestionnaireLanding.tsx    # (existing)
│   │   └── QuestionnaireStep.tsx       # NEW: Desktop step wrapper
│   ├── mobile/
│   │   ├── MobileQuestionnaireLanding.tsx # (existing)
│   │   └── MobileQuestionnaireStep.tsx # NEW: Mobile step wrapper
│   └── shared/
│       ├── QuestionProgress.tsx        # NEW: Progress indicator
│       ├── CountrySelector.tsx         # NEW: Multi-select country buttons
│       ├── SelectDropdown.tsx          # NEW: Styled dropdown
│       └── PersonalDetailsForm.tsx     # NEW: Multi-field form
└── content/
    └── he.ts                           # Add questionnaire content
```

### Routing Strategy

| Route | Component | Purpose |
|-------|-----------|---------|
| `/test` | QuestionnaireLanding | How it works (3 steps intro) |
| `/test/question/1` | QuestionStep | Country preference |
| `/test/question/2` | QuestionStep | Relocation reason |
| `/test/question/3` | QuestionStep | Personal details form |

### State Management

Use **URL-based state** for simplicity:
- Current step from URL param `[step]`
- Form answers stored in React state (lifted to page level)
- On completion, POST to API or store in session

---

## Component Specifications

### 1. QuestionProgress

```tsx
interface QuestionProgressProps {
  currentStep: number;
  totalSteps: number;
  sections: { label: string; steps: number[] }[];
}
```

**Visual:**
- Gray horizontal line (800px desktop, full-width mobile)
- Blue highlight segment for current section
- Section label below active segment

### 2. CountrySelector

```tsx
interface CountrySelectorProps {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}
```

**Visual:**
- 2x2 grid of buttons
- Unselected: White bg, gray border (#C6C6C6), dark text
- Selected: Blue bg (#215388), white text
- Border radius: 10px
- Height: 40px

### 3. SelectDropdown

```tsx
interface SelectDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

**Visual:**
- White bg, gray border
- Chevron icon on left (RTL)
- Dropdown with highlight on selected option
- Border radius: 10px

### 4. PersonalDetailsForm

```tsx
interface PersonalDetailsFormProps {
  values: PersonalDetails;
  onChange: (values: PersonalDetails) => void;
  onSubmit: () => void;
}

interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  familyStatus: string;
  spouseBirthDate?: string;
  citizenship: string;
  spouseCitizenship?: string;
  additionalCitizenship?: string;
  residenceCountry: string;
}
```

**Visual:**
- Desktop: 2-column grid
- Mobile: Single column
- Mix of text inputs, date pickers, dropdowns
- Reuse existing `TextInput` component

---

## Content Structure (he.ts additions)

```typescript
questionTest: {
  // ... existing howItWorks ...

  progress: {
    eligibility: "בדיקת זכאות",
    preferences: "העדפות",
  },

  navigation: {
    back: "חזור",
    continue: "המשך",
    saveAndContinue: "שמור והמשך",
  },

  steps: {
    countryPreference: {
      title: "מהן המדינות המועדפות שלך להגירה או רילוקיישן?",
      hint: "אנא סמן את המדינות המועדפות שלך",
      options: [
        { id: "us", label: "ארצות הברית" },
        { id: "au", label: "אוסטרליה" },
        { id: "ca", label: "קנדה" },
        { id: "any", label: "כולן טובות לי" },
      ],
    },
    relocationReason: {
      title: "למה את/ה רוצה לעבור לחו\"ל?",
      subtitle: "ככל שתשתפו אותנו ביותר פרטים - נוכל לדייק את ההמלצות, כך שיהיו מותאמות באמת לכם.",
      placeholder: "ספר/י לנו...",
    },
    personalDetails: {
      title: "בדוק את הזכאות שלך לויזה",
      fields: {
        fullName: { label: "שם מלא", placeholder: "" },
        email: { label: "אימייל", placeholder: "" },
        phone: { label: "מספר טלפון", placeholder: "" },
        birthDate: { label: "תאריך לידה", placeholder: "בחר תאריך" },
        familyStatus: { label: "מצב משפחתי", placeholder: "בחר/י" },
        spouseBirthDate: { label: "תאריך לידה של בן/בת הזוג", placeholder: "בחר תאריך" },
        citizenship: { label: "ארץ אזרחות", placeholder: "" },
        spouseCitizenship: { label: "ארץ אזרחות של בן/בת הזוג", placeholder: "" },
        additionalCitizenship: { label: "ארץ אזרחות נוספת", placeholder: "" },
        residenceCountry: { label: "ארץ מגורים", placeholder: "" },
      },
      familyStatusOptions: [
        { value: "single", label: "רווק/ה" },
        { value: "common_law", label: "ידוע/ה בציבור" },
        { value: "married", label: "נשוי/אה" },
        { value: "separated", label: "פרוד/ה" },
        { value: "divorced", label: "גרוש/ה" },
        { value: "widowed", label: "אלמן/ה" },
      ],
    },
  },
}
```

---

## Implementation Phases

### Phase 1: Shared Components (Foundation)
1. `QuestionProgress` - Progress indicator bar
2. `CountrySelector` - Multi-select button grid
3. `SelectDropdown` - Styled select with options

### Phase 2: Question Step Wrapper
1. `QuestionnaireStep` (desktop) - Layout with header, progress, content, footer
2. `MobileQuestionnaireStep` (mobile) - Mobile-adapted layout

### Phase 3: Individual Steps
1. Step 1: Country preference (uses CountrySelector)
2. Step 2: Relocation reason (desktop: dropdown, mobile: textarea)
3. Step 3: Personal details form (uses existing TextInput + new SelectDropdown)

### Phase 4: Routing & State
1. Dynamic route `/test/question/[step]`
2. State management for form answers
3. Navigation between steps
4. Form validation

### Phase 5: Polish
1. Animations (Framer Motion transitions)
2. Form validation feedback
3. Loading states
4. Completion redirect

---

## Design Tokens Reference

| Element | Value |
|---------|-------|
| Primary blue | #215388 |
| Gray border | #C6C6C6 |
| Gray text | #C6C6C6 |
| Dark text | #1D1D1B |
| Button radius | 100px (pill) / 10px (cards) |
| Input height | 40px |
| Button height | 60px |
| Progress line width | 800px (desktop) |
| Content max-width | 600px |

---

## Questions/Decisions Needed

1. **Mobile step 2 difference**: Desktop shows dropdown, mobile shows textarea. Should we:
   - Keep them different (match Figma exactly)?
   - Unify to one approach?

2. **Form submission**: Where should completed questionnaire data go?
   - API endpoint?
   - Local storage for now?

3. **Validation requirements**: What fields are required vs optional?

4. **Spouse fields visibility**: Should spouse-related fields only show when family status is "married" or "common_law"?
