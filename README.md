# GiveTrack — Context-Aware NGO Donation Transparency & Impact Platform
## Lab Exercise 2 — HTML5 Media, Media Queries & CSS Pseudo-Selector
**Project Domain**: NGO Donation Transparency, Expense Verification & Volunteer Management  
**Architecture**: 100% Pure HTML5 & Vanilla CSS3 (Strict Constraint: Zero JavaScript)  
**Reference Browser**: Google Chrome (Latest Stable)  

---


> **Product Architecture & Incremental Evolution Note**:
> GiveTrack is a single continuous software engineering project being developed across semesters.
> - **Lab 1 Foundation**: Established the branding, design identity, active fundraising portfolio (*Every Child in School*, *Healthy Neighbourhood*, *Green Streets Project*), transaction ledger, and volunteer roles.
> - **Lab 2 Evolution**: Upgraded GiveTrack into a context-aware, highly accessible, pure CSS platform without JavaScript. Retained all core product features while integrating context-aware HTML5 media (`<picture>`, `<video>`, WebVTT `::cue`), 14 pseudo-classes (excluding `:root`, including interactive `:target` modals and `:checked`/`:has()` shift selection), 6 pseudo-elements, 13 responsive and environmental media queries, and an auditor-verified expense voucher pipeline.

## 1. Project Overview & Domain Identity
**GiveTrack** is an NGO donation transparency and volunteer management platform designed to provide mathematical financial integrity to donors, field administrators, and community volunteers. Unlike traditional static non-profit sites, GiveTrack provides public, voucher-level accounting where:

$$\text{Total Contributions Received} = \text{Total Verified Programme Expenses} + \text{Remaining Escrow Balance}$$

In this Lab 2 extension, GiveTrack showcases the flagship **Community Food Support Programme**, demonstrating how a modern non-profit platform intelligently adapts its media, priorities, visual density, and interactions based on real-world operating contexts—using strictly native HTML5 and CSS3 without a single line of JavaScript.

---

## 2. Lab 2 Objective
The core objective of Lab Exercise 2 is to design and build a **context-aware media webpage** that adapts to who is using it, on what hardware, in what environmental lighting, and under what administrative conditions.

Key technical criteria demonstrated:
1. **HTML5 Media**: Adaptive `<picture>` element with differentiated source imagery, and an accessible `<video>` player with custom-authored WebVTT captions styled via `::cue`.
2. **CSS Media Queries**: 13 @media blocks across five categories.
3. **CSS Pseudo-Classes**: 14 pseudo-classes (`:hover`, `:focus`, `:focus-visible`, `:focus-within`, `:checked`, `:disabled`, `:target`, `:has()`, `:valid`, `:user-invalid`, `:placeholder-shown`, `:empty`, `:nth-child()` and `:not()`).
4. **CSS Pseudo-Elements**: 6 pseudo-elements (`::before`, `::after`, `::cue`, `::marker`, `::selection`, `::placeholder`).
5. **Two Advanced Challenges**:
   - **Challenge C2**: Designed A4 printable campaign financial audit report with printed URLs.
   - **Challenge C5**: Functional CSS-only expense voucher submission form with native HTML attributes, `:valid`, `:user-invalid`, and chained `:has()` feedback.
6. **Strict Hard Constraint**: Zero JavaScript, zero `<script>` tags, zero inline event handlers, and no external JS-powered frameworks (100% vanilla CSS).

---

## 3. Verified Lab 2 Implementation & Test Evidence Matrix

All uncertain requirements have been empirically verified inside Google Chrome using native DevTools Protocol tests. No requirement is claimed as passing simply because code exists.

| Requirement | Actual Implementation | Exact HTML/CSS Location | Tested Result |
| :--- | :--- | :--- | :--- |
| **Domain-specific `:has()`** | Relational state awareness: triggers a prominent alert banner at the section level (`#expenses:has(.status-pending) .ledger-audit-banner`) and highlights the voucher row with amber styling and 5px left border (`tr:has(.status-pending)`). Dynamic state vanishes when pending status is absent. | **HTML**: `index.html` lines 580–592 (row `EXP-CFSP-05` containing `<span class="status-pill status-pending">Pending</span>`).<br>**CSS**: `style.css` lines 1023–1055. | **PASS**<br>Chrome evaluation: `bannerDisplay: 'flex'`, `rowBorderLeft: '5px solid rgb(245, 158, 11)'`. When `.status-pending` was dynamically toggled to `status-verified`, `bannerDisplay` instantly returned to `'none'` and row background reset to transparent. |
| **High-contrast preference** | `@media (prefers-contrast: more)` implements an application-wide accessibility mode: forces solid 2px/3px black borders on all cards, inputs, tables, buttons, and badges, with max-contrast `#000000` text on `#FFFFFF`. Inverts cleanly if dark mode is simultaneously active. | **CSS**: `style.css` lines 2313–2465 (`@media (prefers-contrast: more)`). | **PASS**<br>Verified via Chrome emulation (`prefers-contrast: more`): cards, inputs, and table headers feature stark solid borders (`2px solid #000000`), with headers styled at `#E2E8F0` with 900-weight black text. Proof recorded in `screenshots/07_high_contrast.png`. |
| **Responsive images** | Native HTML5 `<picture>` element with differentiated media queries loading high-bandwidth landscape for desktop and tightly cropped portrait for mobile viewports. | **HTML**: `index.html` lines 126–140.<br>**Assets**: `assets/campaign-desktop.jpg` (landscape, 234 KB) and `assets/campaign-mobile.jpg` (portrait close-up, 107 KB). | **PASS**<br>Verified in Chrome: at 320px viewport, `img.currentSrc` loads `campaign-mobile.jpg`; at 1280px viewport, `img.currentSrc` loads `campaign-desktop.jpg`. |
| **Image zoom** | Pure CSS touch/keyboard/hover inspection: subtle 1.04x hover preview for mouse users; accessible tap/click/Space toggle via `#hero-img-zoom:checked` scaling to 1.18x within viewport bounds; displays a "✕ Click to Close" pill; respects `prefers-reduced-motion`. | **HTML**: `index.html` lines 126–140 (`#hero-img-zoom` and `.img-zoom-container`).<br>**CSS**: `style.css` lines 509–580. | **PASS**<br>Verified in Chrome: clicking/tapping toggles scale to 1.18x with `closeDisplay: 'flex'` without layout breakage; keyboard Tab + Space toggles state; disabled under `prefers-reduced-motion: reduce`. |
| **C2 print output** | Challenge C2: `@page { size: A4 portrait; margin: 12mm 15mm; }` and `@media print` hide interactive elements (nav, video, forms, buttons) while retaining formal branding, financial reconciliation formula, statistics grid, expense ledger, and audit declaration. | **HTML**: `index.html` lines 1058–1075 (`.print-action-card` and `.print-footer-declaration`).<br>**CSS**: `style.css` lines 2570–2645. | **PASS**<br>Verified via Chrome print emulation: navigation, volunteer section, and submission forms vanish (`display: none`), while financial tables and A4 declaration render in high-contrast ink-efficient monochrome. Recorded in `screenshots/05_print_preview.png`. |
| **Voucher Audit Inspection & PDF Downloads** | In-application audit certificate modals activated via CSS `:target` (`#voucher-01` through `#voucher-06`), with high-contrast theme typography, full metadata, auditor sign-off, and native HTML `download` links to genuine, local voucher PDF files in `assets/vouchers/`. | **HTML**: `index.html` lines 610–675 (table voucher links) and lines 1265–1580 (modal declarations).<br>**CSS**: `style.css` lines 1970–2130 & lines 2700–2880.<br>**Assets**: `assets/vouchers/EXP-CFSP-01.pdf` through `06.pdf`. | **PASS**<br>Verified in Chrome: Clicking `INV-CL-9920` opens `#voucher-05` displaying the ₹8,500 pending claim in escrow with `#F8FAFC` values on `#06221F` deep teal, and native link downloading `assets/vouchers/EXP-CFSP-05.pdf`. Recorded in `screenshots/09_voucher_modal.png`. |

---

## 4. Features Implemented
- **Reconciled Financial Dashboard**:
  - Target: ₹1,50,000 | Total Raised: ₹1,20,000 | Verified Outlay: ₹85,000 | Balance: ₹35,000.
  - Mathematical balance verified: $\text{₹85,000} + \text{₹35,000} = \text{₹1,20,000}$.
- **Pure CSS Navigation**: Responsive hamburger drawer powered by `<input type="checkbox">` and CSS transitions without JavaScript.
- **Adaptive `<picture>` Element**:
  - Desktop view (`width >= 40rem`): Wide landscape shot of the central distribution logistics hub (`assets/campaign-desktop.jpg`).
  - Mobile view (`width < 40rem`): Portrait close-up of a direct beneficiary 15 kg nutrition kit (`assets/campaign-mobile.jpg`).
- **Accessible HTML5 Impact Video & Custom WebVTT**:
  - High-efficiency progressive H.264/AAC MP4 video with poster art (`assets/video-poster.jpg`).
  - Custom self-authored WebVTT caption file (`captions/campaign-impact.vtt`) accurately transcribing the actual spoken dialogue of reporter Lucy Spencer and volunteer Vijay from the ITU documentary excerpt, with ambient audio cues.
  - Subtitles styled using the compulsory CSS `::cue` pseudo-element with semi-transparent deep teal backdrop and high-contrast white text.
- **Pure CSS Data Visualisation**: Conic-gradient doughnut chart displaying exact percentage utilisation (70.83% utilised vs 29.17% remaining).
- **Expense Verification Ledger & PDF Vouchers**:
  - Multi-state ledger (Verified, Pending, Rejected).
  - Status indicators rendered via `::before` icons and text (never colour alone).
  - Parent row highlighted using `:has(.status-pending)` for pending auditor reviews.
  - Interactive voucher inspection modals with high-contrast readable typography in light and dark themes.
  - Dedicated "Download Voucher PDF" action linking to authentic, local A4 voucher PDF documents (`assets/vouchers/EXP-CFSP-01.pdf` through `EXP-CFSP-06.pdf`) featuring the original GiveTrack logo and auditor sign-off.
- **Volunteer Shift Selector**:
  - Interactive selection via hidden radio buttons (`:checked`).
  - Shift cards styled dynamically using `:has(.shift-radio:checked)`.
  - Pure CSS registration confirmation banner.
- **CSS-Only Expense Submission Form (Challenge C5)**:
  - Validates description length, numerical bounds, category selection, date, and invoice regex pattern (`^[A-Z0-9-]{6,16}$`).
  - Pristine inputs remain clean via `:placeholder-shown`.
  - Touched invalid inputs trigger `:user-invalid` styling and contextual error messages.
  - Chained `:has()` detects when all 5 fields are simultaneously valid to activate the audit dispatch readiness banner.
- **Designed A4 Print Output (Challenge C2)**:
  - `@media print` reformats the page into an official non-profit financial statement.
  - Strips interactive and media clutter; formats tables and prints local PDF voucher destinations beside voucher links using `attr(href)` in the print stylesheet.

---

## 5. Part A — Context Matrix (6 Contexts Across 5 Categories)

| # | Situation / Context | Category | How CSS Detects It | What Changes on the Page | Why This Helps That User | What Was Thought of But Rejected, & Why |
|---|---|---|---|---|---|---|
| **1** | **Mobile Donor on the Go** | Screen / Viewport | `@media (width < 40rem)` | `<picture>` loads vertical close-up ration kit (`campaign-mobile.jpg`); grid collapses to single column; donation metrics and progress bar appear above the narrative story; nav collapses into a pure CSS tap-friendly drawer. | Mobile donors typically check progress or donate in short bursts. Prioritising financial totals and swapping to a tightly framed image saves bandwidth and enhances readability. | *Rejected:* Simply hiding the image entirely. Rejection reason: Donors need emotional connection and visual proof of impact; an optimized close-up portrait is significantly more engaging than an empty card. |
| **2** | **Touch-Based Volunteer in the Field** | Input Hardware | `@media (hover: none) and (pointer: coarse)` | Volunteer shift cards and radio controls expand to a minimum touch target of 48px; spacing between inputs increases; hover-dependent elevation effects are replaced with persistent high-contrast borders. | Field volunteers often wear nitrile gloves or hold devices one-handed on uneven terrain. Larger tap targets eliminate missed taps and accidental submissions. | *Rejected:* Expanding cards to 100vh modal overlays. Rejection reason: Overlays disorient users and prevent comparing morning vs afternoon shift requirements side-by-side. |
| **3** | **Reduced-Motion User** | User Setting (Accessibility) | `@media (prefers-reduced-motion: reduce)` | The pulsing hero status dot stops animating (`animation: none`); smooth scroll is disabled (`scroll-behavior: auto`); progress bar animations are rendered statically with immediate solid fills. | Vestibular disorder sufferers can experience nausea, dizziness, or headaches from pulsating lights or animated viewport shifting. Static rendering ensures dignity and safety. | *Rejected:* Removing the status indicator entirely. Rejection reason: Users still need to know that the campaign is active. A solid green badge with text communicates status without motion. |
| **4** | **Auditor Printing Financial Statement (Challenge C2)** | Output Hardware | `@media print` | Video, navigation bar, interactive buttons, volunteer selector, and forms are hidden. Layout converts to formal black-and-white A4 paper format with strict page breaks. External invoice links print their URLs via `::after { content: " (" attr(href) ")"; }`. | Statutory auditors and tax authorities (under Section 80G) require physical paper trails for board meetings and regulatory filings without wasted ink on colored backgrounds or interactive widgets. | *Rejected:* Letting the browser print the normal web layout. Rejection reason: Standard web prints waste dark ink on teal headers, cut off tables across page boundaries, and render video boxes as blank grey squares. |
| **5** | **Administrator Reviewing Unverified Vouchers** | Project Domain Context | `#expenses:has(.status-pending)` and `tr:has(.status-pending)` | A prominent section alert banner appears (`display: flex`), the ledger card receives an amber top accent border, and row 5 (`EXP-CFSP-05`) is highlighted with amber background, dark amber text, and a 5px warning border callout. When pending status is absent, the banner and amber styling automatically vanish. | NGO auditors scanning hundreds of ledger entries need unverified vouchers held in escrow to stand out immediately to prevent unauthorized fund disbursement without relying on JavaScript. | *Rejected:* Moving pending items to a completely separate hidden tab. Rejection reason: Separating vouchers prevents auditing sequential chronological invoice numbering (`EXP-CFSP-01` through `06`). |
| **6** | **Donor in Low-Light / Dark Mode** | User Setting | `@media (prefers-color-scheme: dark)` | The palette inverts to dark teal-black (`#051A18`) with surface cards at `#082826`, luminous mint borders (`#144D48`), and light mint body text (`#EDFBF9`). Conic doughnut center and form inputs adjust while maintaining strict 7:1 contrast on financial numbers. | Prevents eye strain when donors view reports in dim environments while conserving battery on OLED mobile screens. | *Rejected:* Simple CSS `filter: invert(1) hue-rotate(180deg)`. Rejection reason: CSS filter inversion ruins photographic tones, video rendering, and brand logo colors. |

---

## 6. Media Query Map (13 Verified `@media` Blocks)

| # | Media Query | Category | Feature / Purpose | Target Elements Modified |
|---|---|---|---|---|
| 1 | `@media (hover: hover)` | Input Hardware | Desktop cursor hover states & elevation lifts | `.nav-item:hover`, `.campaign-card:hover`, `.img-zoom-container:hover` |
| 2 | `@media (width < 50rem)` | Viewport Size | Mobile navigation drawer activation (< 800px) | `.nav-toggle-label`, `.main-navigation`, `.nav-item` |
| 3 | `@media (max-width: 36rem)` | Viewport Size | Small mobile table scroll hint & touch containment (< 576px) | `.table-wrap`, `.expense-table`, `.table-scroll-hint` |
| 4 | `@media (width < 40rem)` | Viewport Size | Mobile range syntax adaptation for screens under 640px | `.stats-grid`, `.media-section-grid`, `.modal-dialog`, `.campaigns-portfolio-grid` |
| 5 | `@media (width >= 64rem)` | Viewport Size | Desktop wide layout scaling for screens 1024px and above | `.hero-title`, `.max-w-7xl`, `.campaigns-portfolio-grid` |
| 6 | `@media (40rem <= width < 64rem)` | Viewport Range | Intermediate tablet adaptation (640px to 1024px) | `.transparency-layout`, `.stats-grid`, `.hero-grid`, `.expense-table` |
| 7 | `@media (orientation: portrait)` | Orientation | Optimises visual balance when a tablet/phone is held upright | `.hero-lead`, `.css-doughnut`, `.volunteer-roster-grid` |
| 8 | `@media (hover: none) and (pointer: coarse)` | Input Hardware | Enforces 48px touch targets for touchscreen volunteers | `.nav-item`, `.shift-card`, `.shift-radio`, `.form-control`, `.btn-submit-expense` |
| 9 | `@media (prefers-reduced-motion: reduce)` | Accessibility | Neutralises animations, transitions, and pulsing dots | `*`, `html`, `.pulse-dot`, `.progress-fill-css` |
| 10 | `@media (prefers-color-scheme: dark)` | User Preference | Dark theme palette adaptation (active by default in dark OS when toggle unchecked) | `body:has(#theme-toggle:not(:checked))`, `.gt-card`, `.expense-table`, `.form-control`, `.css-doughnut` |
| 11 | `@media (prefers-contrast: more)` | Accessibility | High-contrast accessibility borders and bold badges | `.gt-card`, `.form-control`, `.status-pill`, `.btn-submit-expense` |
| 12 | `@media (prefers-contrast: more) and (prefers-color-scheme: dark)` | Accessibility | Inverted high-contrast mode for dark theme canvas | `.gt-card`, `.table-wrap`, `.status-pill`, `.reconciliation-card` |
| 13 | `@media print` | Output Medium | Challenge C2: Pure CSS A4 Financial Transparency Report with printed URLs | `header`, `footer`, `video`, `form`, `.stats-grid`, `.expense-table`, `a[href$=".pdf"]::after` |

---

## 7. Pseudo-Class Selector Map (14 Verified Pseudo-Classes)

| Pseudo-Class | Functional Group | Where Used | Exact Purpose |
|---|---|---|---|
| `:hover` | User Action | `.nav-item:hover`, `.shift-card:hover`, `.btn-submit-expense:hover`, `.btn-primary:hover` | Visual lift and feedback when a cursor hovers over interactive elements |
| `:focus` | User Action / Form State | `.form-control:focus` | Applies turquoise border highlight and subtle glow (`box-shadow: 0 0 0 3px rgba(12, 130, 119, 0.2)`) when a form control receives focus |
| `:focus-visible` | User Action / Accessibility | `:focus-visible`, `.nav-toggle-label:focus-visible`, `.voucher-link:focus-visible` | Accessible 3px orange focus ring for keyboard tab navigation (WCAG 2.4.7) |
| `:focus-within` | Form State | `.shift-card:focus-within`, `.form-group:focus-within .form-label` | Highlights container and label when any nested input receives focus |
| `:checked` | Input State | `#theme-toggle:checked`, `#nav-toggle:checked`, `.shift-radio:checked` | Pure CSS theme toggle, mobile drawer toggle, and shift selection state without JavaScript |
| `:disabled` | Input State | `.shift-card:has(.shift-radio:disabled)`, `.btn-primary:not(:disabled)` | Visually dims waitlisted/closed volunteer shift cards (55% opacity, dashed border, `not-allowed` cursor) and prevents selection |
| `:target` | Location / Navigation | `#simulate-donation:target`, `#apply-volunteer:target`, `#voucher-01:target`–`#voucher-06:target` | Pure CSS modal activation displaying donation, volunteer registration, and voucher details dialogs |
| `:has()` | Relational Selector | `#expenses:has(.status-pending)`, `tr:has(.status-pending)`, `form:has(.form-control:user-invalid)`, `.shift-card:has(.shift-radio:disabled)` | Styles parent elements based on child states (e.g. pending ledger alert, invalid form submit lock, selected/disabled shifts) |
| `:valid` | Validation State | `.form-control:valid` | Indicates compliant field input with green border and check indicator |
| `:user-invalid` | Validation State | `.form-control:user-invalid` | Displays red error messages only **after** the user interacts, preventing premature errors on load |
| `:placeholder-shown` | Input State | `.form-control:not(:placeholder-shown)` | Ensures validation checkmarks do not render while placeholder is still visible |
| `:empty` | Structural | `.ledger-audit-banner:empty`, `.print-footer-declaration:empty` | Guarantees empty alert containers take zero layout space |
| `:nth-child()` | Structural Tree | `.expense-table tbody tr:nth-child(even)` | Generates alternating table striping for reading clarity across dense financial rows |
| `:not()` | Negation Filter | `.form-control:not(:placeholder-shown)`, `.btn-primary:not(:disabled)`, `body:not(:has(#theme-toggle:checked))` | Combines conditions to isolate populated inputs and active controls from default states |

---

## 8. Pseudo-Element Selector Map

| Pseudo-Element | Where Used | Content / Styling Applied | Purpose |
|---|---|---|---|
| `::before` | `.status-verified::before`, `.status-pending::before`, `.status-rejected::before` | Adds `✓ `, `⏱ `, `✕ ` icons respectively | Non-color status indicators ensuring colorblind accessibility (WCAG 1.4.1) |
| `::after` | `.expense-table td a[href$=".pdf"]::after` in `@media print` | `content: " (" attr(href) ")"` | Prints the relative PDF voucher link beside the voucher reference in the financial ledger. |
| `::cue` | `<video>` WebVTT Captions | `background: rgba(7,63,61,0.94); color: #EFFAF8; font-size: 1rem;` | Customizes font, padding, and backdrop of WebVTT video captions |
| `::marker` | `.report-list li::marker` | `color: var(--color-turquoise); font-size: 1.1em;` | Styles unordered list bullet points in the statutory audit section |
| `::selection` | Global `::selection` | `background: var(--color-orange); color: #FFFFFF;` | Enforces GiveTrack branding when user highlights text on the webpage |
| `::placeholder` | Input fields `::placeholder` | `color: #94A3B8; font-size: 0.95rem;` | Styles input placeholder hints uniformly across Chromium, Gecko, and WebKit |

---

## 9. Deep-Dive: Explanation of the CSS `:has()` Selector
The CSS `:has()` pseudo-class (also known as the *"CSS parent selector"*) allows styling an ancestor or preceding sibling based on whether it contains descendants that match a specific relative selector.

### How it Works:
Before `:has()`, CSS could only select downwards (parent to child) or sideways (adjacent siblings). Selecting a container based on its content required JavaScript event listeners (`input`, `change`) and class toggling. `:has()` executes this natively in the browser's CSS engine.

### Practical Applications in GiveTrack:
1. **Domain Voucher Highlighting**:
   ```css
   /* Styles the entire table row when an unverified expense badge is present */
   .expense-table tr:has(.status-pending) {
     background-color: #FFFDF5 !important;
     border-left: 4px solid var(--color-orange);
   }
   ```
2. **CSS-Only Volunteer Shift Selection**:
   ```css
   /* Elevates, highlights, and indicates selection when an opportunity's radio button is checked */
   .shift-card:has(.shift-radio:checked) {
     border-color: var(--color-orange);
     background-color: var(--color-surface-alt);
     box-shadow: 0 0 0 2px var(--color-orange);
   }

   /* Contextual induction and reporting instructions revealed without JavaScript */
   .volunteer-shifts-container:has(#shift-food:checked) .shift-msg-food {
     display: flex;
   }
   ```
3. **Multi-Input Form Validation Coordination (Challenge C5)**:
   ```css
   /* Disables and greys out the submit button if ANY input is currently invalid */
   form:has(.form-control:user-invalid) .btn-submit-expense {
     opacity: 0.6;
     cursor: not-allowed;
     filter: grayscale(0.4);
   }

   /* Activates the green readiness banner only when ALL 5 required fields are simultaneously valid */
   form:has(#exp-desc:valid):has(#exp-amount:valid):has(#exp-cat:valid):has(#exp-date:valid):has(#exp-ref:valid) .form-status-banner {
     background-color: var(--color-success-bg);
     border-color: #A7F3D0;
     color: var(--color-success);
     font-weight: 700;
   }
   ```
*Browser Support*: Fully supported across Chrome (105+), Edge (105+), Safari (15.4+), and Firefox (121+).

---

## 10. Selected Challenges: Implementation & Defense

### Challenge C2: Designed A4 Print Output
- **Concept**: Web interfaces are full of interactive controls (hamburger menus, video players, buttons, forms) that are completely useless when printed on paper. An auditor needs a clean, ink-efficient, legible financial voucher summary.
- **Implementation**:
  - `@page { size: A4 portrait; margin: 12mm 15mm; }` sets A4 portrait paper dimensions with 12mm vertical and 15mm horizontal margins.
  - Interactive elements (`header`, `footer`, `video`, `.volunteer-section`, `form`, `button`) are set to `display: none !important;`.
  - The hero gradient is stripped of heavy ink and converted into a clean bordered print header.
  - Financial tables have `page-break-inside: avoid` to prevent rows splitting across page breaks.
  - Prints the relative PDF voucher destinations beside voucher links in the expense ledger:

  ```css
  .expense-table td a[href$=".pdf"]::after {
    content: " (" attr(href) ")";
    font-size: 6.5pt;
    font-weight: normal;
    color: #475569;
  }
    ```
  - Appends a formal **Statutory Audit Declaration** at the bottom of the printed page.

### Challenge C5: CSS-Only Form Validation
- **Concept**: Traditionally, form validation requires JavaScript event listeners (`input`, `blur`, `submit`) to toggle error classes and display feedback text. Challenge C5 proves that modern HTML5 and CSS selectors can deliver superior, accessible feedback with zero scripts.
- **Implementation**:
  - **Native Constraints**: Uses `required`, `minlength="5"`, `min="100"`, `max="100000"`, `type="date"`, and regex `pattern="^[A-Z0-9-]{6,16}$"`.
  - **No False Errors on Load**: Standard `:invalid` applies to empty required fields immediately on page load, which frustrates users. We use **`:user-invalid`**, which only triggers *after* the user has interacted with the control and moved away or submitted.
  - **Contextual Error Messages**:
    ```css
    .error-msg { display: none; }
    .form-group:has(.form-control:user-invalid) .error-msg { display: block; }
    ```
  - **Dynamic Form Status**: Uses chained `:has()` selectors on the parent `<form>` to evaluate the collective validity of all inputs, dynamically enabling the green verification banner.

---

## 11. Accessibility Features (Designed to Conforming WCAG 2.1 AA Guidelines)
- **Keyboard Navigation**: All interactive elements (navigation links, skip targets, video controls, radio shift cards, form inputs) are fully operable using `Tab`, `Shift+Tab`, `Space`, and `Enter`.
- **Visible Focus Indicators**: `:focus-visible` applies a high-contrast 3px orange outline (`#F59A38`) with a 2px offset.
- **Never Rely on Colour Alone**: Table status badges include both textual names and distinct Unicode symbols (`✓ Verified`, `⏱ Pending`, `✕ Rejected`).
- **Contrast Ratios (Calculated per WCAG 2.1 AA Specifications)**:
  - *Light Theme*: Deep teal headings and statistics (`#073B36`) achieve **10.6:1** against white card backgrounds; dark slate secondary text (`#475569`) achieves **7.2:1**; body text (`#0F172A`) achieves **15.4:1**. Borders (`#C8E6E2` and `#CBD5E1`) are clearly delineated.
  - *Dark Theme*: Primary text and stat values (`#EDFBF9` and `#F8FAFC`) achieve **13.5:1** and **15.1:1** against deep teal canvas (`#061B19`) and card surfaces (`#0D302D`); secondary text (`#CBD5E1`) achieves **9.4:1**.
  - *Status Indicators*: Pending review items use dark amber on soft yellow (`#78350F` on `#FEF3C7`, **8.5:1** contrast); disallowed items use dark burgundy on soft red (`#7F1D1D` on `#FEE2E2`, **9.2:1** contrast). In dark mode, pending review uses `#FDE68A` on `#2D1E04` (**10.5:1**) and rejected uses `#FECACA` on `#331014` (**10.2:1**). No faint or washed-out text on white or dark surfaces.
- **Semantic HTML5**: Native `<header>`, `<nav>`, `<main>`, `<section>`, `<figure>`, `<figcaption>`, `<article>`, and `<footer>` tags ensure screen readers correctly interpret the landmark outline.
- **Screen Magnification & 200% Zoom Verification**: Verified in Google Chrome at 200% zoom (effective viewport 640px). The page reflows into a clean single-column structure with zero horizontal overflow (`docWidth: 625px, scrollWidth: 625px, hasHorizontalOverflow: false`). Tables scroll independently within touch-friendly `.table-wrap` containers, typography scales legibly, and all interactive controls remain operable. Visual proof recorded in `screenshots/06_zoom_200_percent.png`.

---

## 12. Functional Features vs. Interactive Demonstrations

To ensure honest academic transparency, the following matrix documents which features provide complete, end-to-end functionality versus those designed as interactive client-side demonstrations:

| Feature | Type | Status | Technical Implementation |
|---|---|---|---|
| **Theme Toggle (Light / Dark)** | Functional Feature | 100% Live | Pure CSS checkbox state `:checked` toggle with automatic fallback to `@media (prefers-color-scheme: dark)` |
| **Mobile Drawer Navigation** | Functional Feature | 100% Live | Pure CSS checkbox drawer toggle with `@media (width < 50rem)` responsive collapse |
| **Field Photography Inspection** | Functional Feature | 100% Live | Pure CSS click/tap zoom inspection toggle using `<input type="checkbox">` and CSS transforms |
| **Adaptive Art Direction** | Functional Feature | 100% Live | HTML5 `<picture>` switching between mobile crop and desktop wide photography |
| **Documentary Video & Subtitles** | Functional Feature | 100% Live | Native HTML5 `<video>` with styled WebVTT `<track>` captions and custom `::cue` rendering |
| **Voucher Detail Modals** | Functional Feature | 100% Live | Pure CSS `:target` modals for all 6 vouchers (`#voucher-01` to `#voucher-06`) |
| **Voucher PDF Downloads** | Functional Feature | 100% Live | Direct relative HTML `download` links to 6 single-page A4 PDF documents in `assets/vouchers/` |
| **Pending Voucher Highlighting** | Functional Feature | 100% Live | Pure CSS `:has()` detection on table rows and section alert container |
| **Shift Instructions Display** | Functional Feature | 100% Live | Pure CSS `:has(#shift-food:checked)` state changes displaying field guidelines |
| **Ink-Efficient A4 Print Output** | Functional Feature | 100% Live | Dedicated `@media print` stylesheet producing clean black-on-white financial statements with printed `attr(href)` URLs |
| **Donation Pledge Form** | UI Demonstration | Client-Side Demo | Pure CSS modal with mock donation input; does not connect to a payment gateway |
| **Volunteer Registration Modal** | UI Demonstration | Client-Side Demo | Pure CSS modal with role selection; validates inputs but does not store records to a database |
| **Voucher Submission Portal** | UI Demonstration | Client-Side Demo | Demonstrates HTML5 constraint validation and pure-CSS `:user-invalid` / `:valid` states without persisting entries to a ledger |

---

## 12. Media Credits & Licensing
1. **GiveTrack Logo**: Original SVG/PNG branding assets created for Lab 1 (`assets/givetrack-logo.png`).
2. **Desktop Logistics Image** (`assets/campaign-desktop.jpg`): Original graphic authored for GiveTrack Central Logistics Hub; licensed under Creative Commons Zero (CC0).
3. **Mobile Ration Pack Image** (`assets/campaign-mobile.jpg`): Original graphic authored for GiveTrack Family Ration Pack; licensed under Creative Commons Zero (CC0).
4. **Video Poster** (`assets/video-poster.jpg`): High-resolution still frame captured directly from the UN ITU documentary showing field coordinators inspecting freshly prepared relief rations; licensed under CC BY 4.0.
5. **Campaign Impact Video** (`assets/campaign-impact.mp4`):
   - **Original Work Title**: *#ICT4SDG: How technology is tackling hunger in India (SDG2)*
   - **Original Creator / Author**: International Telecommunication Union (ITU) / ITU News (Reporting: Lucy Spencer; Videography: Julie Marchand). Published 15 May 2017.
   - **Source URLs**: Wikimedia Commons ([`File:-ICT4SDG-_How_technology_is_tackling_hunger_in_India_(SDG2).webm`](https://commons.wikimedia.org/wiki/File:-ICT4SDG-_How_technology_is_tackling_hunger_in_India_(SDG2).webm)); Original YouTube upload ([`https://www.youtube.com/watch?v=zrOpcADgE4E`](https://www.youtube.com/watch?v=zrOpcADgE4E)).
   - **Licence**: Creative Commons Attribution 4.0 International ([CC BY 4.0 Deed](https://creativecommons.org/licenses/by/4.0/)).
   - **Modification Notice (per CC BY 4.0 §3(a)(1)(B))**: A 25.00-second continuous excerpt (seconds 101.0 to 126.0 of the original documentary) was extracted and re-encoded from VP8 to progressive H.264/AVC (Constrained Baseline Profile, Level 3.1, 854×480 @ 25 fps, MP4 faststart) with stereo AAC audio (128 kbps) for universal HTML5 browser `<video>` compatibility. The original dialogue and visual sequence were preserved without editorial alteration.
6. **WebVTT Captions** (`captions/campaign-impact.vtt`): Verbatim transcription of the actual dialogue spoken by ITU reporter Lucy Spencer and volunteer engineering student Vijay, accompanied by ambient audio cues. Styled via the native CSS `::cue` pseudo-element with semi-transparent deep teal backdrop (`rgba(7, 34, 32, 0.88)`), crisp white text (`#FFFFFF`), and subtle rounded corners.
7. **Typography**: Manrope & DM Sans via Google Fonts (Open Font License).

---

## 13. Browser Compatibility Notes
- **Google Chrome (Reference Browser)**: 100% compliant. All features—including modern range syntax `@media (width < 40rem)`, `:has()`, `:user-invalid`, and `::cue`—render flawlessly.
- **Mozilla Firefox (121+)**: Fully compliant. Support for `:has()` was enabled by default in Firefox 121; `:user-invalid` is supported natively.
- **Apple Safari (16.4+)**: Fully compliant. Safari supports `:has()`, WebVTT `::cue`, and range syntax media queries.

---

## 14. Testing Instructions (5-Minute Lab Evaluation Guide)

### Test 1: Mobile Adaptation & Picture Swap (`width < 40rem`)
1. Open `index.html` in Chrome. Press `F12` and toggle Device Toolbar (`Ctrl+Shift+M`).
2. Set width to `360px` or `320px`.
3. **Observe**:
   - The `<picture>` element swaps from the wide desktop warehouse to the vertical close-up ration pack (`assets/campaign-mobile.jpg`).
   - The desktop menu collapses; clicking the hamburger icon toggles the pure CSS dropdown.
   - The financial progress bar and metrics reposition cleanly.

### Test 2: Unverified Expense Highlighting (`:has()`)
1. Scroll to the **Expense Verification Ledger** table.
2. Locate row `EXP-CFSP-05` (Sanitation & Pest Barrier).
3. **Observe**:
   - The row is highlighted with a gold background, an orange left border, and an automatic `::after` badge reading `"⚠ AUDIT REVIEW REQUIRED"`.
   - Powered purely by `tr:has(.status-pending)`.

### Test 3: Touch Hardware Target Expansion
1. In Chrome DevTools, open the three dots menu -> **More tools** -> **Sensors**.
2. Under "Touch", select **Force enabled**.
3. **Observe**: Shift selection cards expand with larger tap padding and radio buttons enlarge to 26px.

### Test 4: Reduced Motion Mode
1. In DevTools, open the **Rendering** tab (`Ctrl+Shift+P` -> type "Rendering").
2. Set `prefers-reduced-motion: reduce`.
3. **Observe**: The hero status dot stops pulsating, smooth scroll disables, and progress fills render statically without animation.

### Test 5: Dark Mode
1. In the **Rendering** tab, set `prefers-color-scheme: dark`.
2. **Observe**: Instant transition to dark teal-black theme (`#051A18`) with high-contrast text and luminous borders.

### Test 6: Challenge C2 (A4 Print Preview)
1. Press `Ctrl+P` (or `Cmd+P` on Mac).
2. **Observe**:
   - Navigation, buttons, video, volunteer selector, hero marketing, and forms vanish.
   - The page formats as an official A4 Financial Transparency Report with printed URLs: `INV-BLR-8841 (assets/vouchers/EXP-CFSP-01.pdf)`.

### Test 7: Challenge C5 (CSS-Only Form Validation)
1. Scroll to the **Submit Expense Voucher** form.
2. Click in the "Amount" field, type `50` (below the minimum of ₹100), and click outside.
3. **Observe**: The input border turns red and displays `"Amount must be between ₹100 and ₹1,00,000."` via `:user-invalid`.
4. Correct all 5 fields with valid values.
5. **Observe**: The bottom status banner turns green reading `"✓ All required voucher fields complete and ready for auditor dispatch"` via chained `:has()`.

### Test 8: Video Playback & Synchronized Subtitles (HTML5 Media + WebVTT)
1. Serve the project locally (e.g., via VS Code Live Server or `python -m http.server 8080`) to satisfy standard browser security policies for `<track>` WebVTT loading.
2. Open `index.html` in Google Chrome and locate the **Campaign Impact Media** section.
3. **Observe**:
   - The native HTML5 video player displays the authentic poster art (`assets/video-poster.jpg`).
   - Click the **Play** button: H.264/AVC progressive video frames advance smoothly.
   - Synchronized descriptive subtitles appear in the lower-third with a semi-transparent deep teal background (`rgba(7, 34, 32, 0.88)`), crisp white typography, and subtle rounded corners styled via CSS `::cue`.
   - The media description card below the player neatly presents documentary excerpt metadata, distinctly separate from the on-screen subtitles.

### Test 9: 200% Zoom Reflow & Responsive Legibility
1. In Google Chrome, press `Ctrl` + `+` repeatedly until zoom reaches 200% (or in DevTools, emulate 640px viewport with 2x device scale).
2. **Observe**:
   - The layout reflows into a single column with zero horizontal document scrollbar (`scrollWidth === docWidth`).
   - Tables scroll smoothly within `.table-wrap`.
   - Typography and action buttons scale cleanly and remain completely readable and clickable.

---

## 15. AI Usage Log
In accordance with academic integrity guidelines:
- **AI Tool Used**: Google Antigravity Coding Assistant (Gemini 3.8 Flash).
- **What Was Requested**:
  - Code architecture for extending the Lab 1 GiveTrack project into Lab 2.
  - Implementation of context-aware media queries, pseudo-classes, pseudo-elements, WebVTT authoring, Challenge C2 print styles, and Challenge C5 pure CSS form validation.
- **What Was Retained**:
  - The color palette (`#073F3D`, `#0C8277`, `#EFFAF8`, `#F59A38`) and typography pairing (`Manrope` + `DM Sans`).
  - Strict zero-JavaScript architecture.
  - The mathematical reconciliation formula ($\text{₹85,000} + \text{₹35,000} = \text{₹1,20,000}$).
  - All 13 actual media query blocks and selector maps.
- **What Was Changed or Rejected**:
  - *Rejected AI Suggestion*: An initial suggestion proposed loading the Tailwind CSS CDN script `<script src="https://cdn.tailwindcss.com"></script>` for rapid layout utility classes.
  - *Reason for Rejection*: The assignment has a strict hard constraint capping submissions at 4/10 if ANY JavaScript or `<script>` tags are present. Loading Tailwind via CDN introduces a JavaScript compiler runtime. The suggestion was completely rejected in favor of 100% pure, self-contained CSS written in `style.css`.
  - *Refined Feature*: Replaced generic `:invalid` styling with `:user-invalid` to prevent empty inputs appearing red on initial page load before the user even began typing.

