# Personal Area - Implementation Notes

## Branch: personal_area

### Implemented Pages

- [x] **Login Page (Welcome)**
  - Email input field
  - Password input field
  - Forgot password link
  - Login button
  - Link to registration page
  - Desktop: `PersonalAreaWelcome`
  - Mobile: `MobilePersonalAreaWelcome`

- [x] **Registration Page**
  - 6 fields: Full name, ID, Date of birth, Phone, Email, Password
  - Desktop: 2-column layout
  - Mobile: Single column layout
  - Desktop: `PersonalAreaRegistration`
  - Mobile: `MobilePersonalAreaRegistration`

- [x] **Navigation between Login/Register**
  - State-based navigation in `page.tsx`
  - Smooth fade transitions with AnimatePresence

---

### Not Implemented (By Design)

- [ ] **SMS Registration/Login**
  - The Figma design includes a "שלח אלי קוד באמצעות SMS" (Send me code via SMS) button
  - **Decision:** SMS registration will NOT be implemented as a feature
  - Only email/password authentication is supported
  - If SMS is needed in the future, add:
    - SMS verification flow
    - Update content/he.ts with SMS-related strings

- [ ] **ID-based Login**
  - Figma shows ID number + code verification flow
  - **Decision:** Using email/password instead
  - If ID-based login is needed, update `PersonalAreaWelcome` components

---

### Pending Pages (from Figma)

- [ ] **ID Verification Page**
  - Figma Desktop: node-id=87-923
  - Figma Mobile: node-id=272-1736

- [ ] **Code Entry Page**
  - Figma Desktop: node-id=87-1179
  - Figma Mobile: node-id=272-1795

- [ ] **Profile Page**
  - Figma Desktop: node-id=87-1353
  - Figma Mobile: node-id=272-1574

---

## Reference

- Figma URLs: See `docs/design/figma_urls.md` > Personal Area section
- Content strings: `src/content/he.ts` > personalArea
