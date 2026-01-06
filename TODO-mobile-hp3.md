# Mobile HP3 - Remaining Issues

## Branch: mobile_hp3_import

### Issues to fix (in order):

- [x] **a) Banner placement** ✅ FIXED
  - Current: "דוח רילוקיישן מותאם אישית תוך 24 שעות!" is at the top of the page
  - Expected: Text should come first, then banner should be on top of the first hero image
  - Fix: Moved banner inside Hero Image Card as absolute positioned overlay
  - Banner: top-0, full width, rounded-t-[20px] (rounded top, square bottom)
  - Image: Changed to about-image.jpg

- [ ] **b) Button alignment (RTL)**
  - Current: Buttons are placed on the right
  - Expected: Hebrew website - buttons should be on the LEFT side

- [ ] **c) Company Statement text position**
  - Current: Text "RELOGATE חברה בינלאומית, מסייעת למתעניינים במעבר לחו״ל והופכת את החלום למציאות" is too low
  - Expected: Text should be higher on the image
  - Check Figma for exact placement

- [ ] **d) Checkmarks position**
  - Current: Checkmarks on left side
  - Expected: Checkmarks should be on RIGHT side of text

- [ ] **e) "How It Works" numbers placement**
  - Section: איך זה עובד?
  - Numbers (01, 02, 03) are placed incorrectly
  - Check Figma for correct layout

- [ ] **f) FAQ icons**
  - Section: שאלות ותשובות
  - Current: Using arrows
  - Expected: Use faq-collapse.svg and faq-expand.svg instead

- [ ] **g) Missing footer logo**
  - Missing Relogate logo at the bottom of the page

---

## Reference
- Figma URL: https://www.figma.com/design/9iC5uUBVU3QoX9XIByWgB4/Relogate--Copy-?node-id=265-683&m=dev
- Figma cache: docs/design/figma_cache/mobile-hp3_9iC5uUBVU3QoX9XIByWgB4_265-683/
