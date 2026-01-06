# Question Test Implementation TODO

Branch: `question_test`

## Overview

Implement the Question Test (Eligibility Check) flow based on Figma designs.
This allows users to answer questions to determine their eligibility/recommendations for relocation.

## Figma References

See `docs/design/figma_urls.md` > "Question Test" section for all design URLs.

---

## Implementation Progress

### Phase 1: Shared Components

- [ ] `QuestionLayout` - Wrapper component with:
  - [ ] Header with "בדיקת זכאות" label
  - [ ] Progress indicator
  - [ ] Back button ("< חזור")
  - [ ] Globe watermark background
  - [ ] Footer integration
- [ ] `MultiSelectQuestion` - Button chips for multi-select (e.g., country selection)
- [ ] `TextAreaQuestion` - Free text input with instruction text
- [ ] `DropdownQuestion` - Single select dropdown
- [ ] `DatePickerInput` - Date picker component (extend TextInput or new)

### Phase 2: Desktop Pages

- [ ] **How It Works** (`/test` or `/eligibility`)
  - [ ] Hero section with image
  - [ ] Title text
  - [ ] 3 step cards (horizontal layout)
  - [ ] Hover states on cards
  - [ ] CTA button to start questionnaire

- [ ] **Question 1: Country Selection**
  - [ ] Question title
  - [ ] Multi-select country buttons (USA, Australia, Canada, All good)
  - [ ] Instruction text
  - [ ] Save & Continue button

- [ ] **Question 2: Motivation**
  - [ ] Question title
  - [ ] Free text variant (text area)
  - [ ] Dropdown variant (marital status etc.)
  - [ ] Instruction text
  - [ ] Save & Continue button

- [ ] **Question 3: Personal Details Form**
  - [ ] Title "בדוק את הזכאות שלך לויזה"
  - [ ] 2-column form layout
  - [ ] Fields: Full name, Email, Phone, DOB, Marital status, Spouse DOB, Citizenship, Spouse citizenship, Additional citizenship, Residence country
  - [ ] Date picker integration
  - [ ] Dropdown integration
  - [ ] Save & Continue button

### Phase 3: Mobile Pages

- [ ] **Mobile How It Works**
  - [ ] Hero section
  - [ ] 3 step cards (vertical layout)
  - [ ] CTA button

- [ ] **Mobile Question 1: Country Selection**
  - [ ] Responsive button layout

- [ ] **Mobile Question 2: Motivation**
  - [ ] Text area / Dropdown variants

- [ ] **Mobile Question 3-6: Form screens**
  - [ ] Single column form layout
  - [ ] Mobile-friendly date picker
  - [ ] Mobile-friendly dropdowns

### Phase 4: State Management & Navigation

- [ ] Multi-step form state (answers storage)
- [ ] Progress tracking (current step / total steps)
- [ ] Navigation between questions
- [ ] Back button functionality
- [ ] Form validation
- [ ] Submit flow (what happens after last question?)

### Phase 5: Content & Localization

- [ ] Add question content to `src/content/he.ts`:
  - [ ] How It Works text (title, steps, CTA)
  - [ ] Question 1 text and options
  - [ ] Question 2 text and options
  - [ ] Question 3 form labels
  - [ ] Marital status options
  - [ ] Country options
  - [ ] Error messages
  - [ ] Success messages

---

## Question Types Reference

| Type | Component | Used In |
|------|-----------|---------|
| Multi-select buttons | `MultiSelectQuestion` | Country selection |
| Free text | `TextAreaQuestion` | Motivation (variant) |
| Dropdown | `DropdownQuestion` | Marital status, Motivation (variant) |
| Text input | `TextInput` (existing) | Name, Email, Phone, etc. |
| Date picker | `DatePickerInput` | DOB fields |

## Marital Status Options

```
ידוע/ה בציבור - Common-law partner
רווק/ה - Single
נשוי/אה - Married
פרוד/ה - Separated
גרוש/ה - Divorced
אלמן/ה - Widowed
```

## Country Options

```
ארצות הברית - USA
אוסטרליה - Australia
קנדה - Canada
כולן טובות לי - All are good for me
```

---

## Notes

- Desktop: 2-column form layouts
- Mobile: Single column layouts
- All screens have globe watermark background
- Common header pattern: "בדיקת זכאות" with back button
- Common CTA: "שמור והמשך" (Save and continue)

## Open Questions

- [ ] What happens after the last question? (Results page? Redirect?)
- [ ] Is there a results/recommendations page to implement?
- [ ] Should answers be persisted to backend or local storage?
- [ ] Is there a payment step after the questionnaire?
