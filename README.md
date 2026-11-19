# GiveTrack — NGO Donation Transparency, Expense Verification & Volunteer Matching Platform
## Lab Exercise 3 — Client-Side JavaScript Application Engineering

**Application Name:** GiveTrack  
**Tagline:** *Every Contribution. Accounted For.*  
**Domain:** NGO Donation Transparency, Financial Ledger Verification & Volunteer Skill Matching  
**Architecture:** Clean Separation of Concerns — Vanilla HTML5 (`index.html`), Native CSS3 (`style.css`), and Vanilla ES6+ JavaScript (`script.js`)  
**Dependencies:** 100% Native Standard Web APIs (Zero External Libraries, Zero Frameworks, Zero Build Steps)  
**Reference Environment:** Google Chrome (Latest Stable)  
**Academic Demonstration Disclosure:** GiveTrack is an educational prototype developed for laboratory coursework. All donor names, voucher records, banking transaction references, and audit certifications are illustrative demonstration data. The application does not process real monetary payments, interface with banking networks, or hold funds in custody.

---

## 1. Problem Statement

Public trust in philanthropic foundations and non-governmental organizations (NGOs) is frequently compromised by opaque accounting, ambiguous administrative overheads, and a lack of verifiable proof connecting public contributions to verified on-the-ground disbursements. Donors routinely experience "donation black holes," where financial pledges disappear into aggregate bank accounts with little to no visibility into procurement bills or beneficiary impact. Simultaneously, grassroots NGOs struggle with fragmented volunteer dispatch systems, failing to match skilled community members to field opportunities based on objective competency requirements.

GiveTrack solves these dual operational challenges by providing an open, client-side financial transparency and volunteer matching platform built on mathematical ledger parity, automated anomaly detection, and deterministic skill scoring.

---

## 2. Problem Analysis

Building a reliable client-side NGO transparency platform requires addressing several fundamental engineering problems:
1. **Financial Invariant Parity:** Every verified rupee disbursed plus every uncommitted reserve rupee must mathematically equal total donor capital collected. Inconsistencies or rounding drift must be prevented and detected automatically.
2. **Double-Counting & Fraud Prevention:** Unscrupulous or accidental submissions involving duplicate transaction reference codes (UTR / gateway IDs) or disbursements lacking vendor receipts must be flagged in real time before reconciliation.
3. **Deficit Protection:** Field coordinators must never disburse funds exceeding a campaign's raised capital. Deficit disbursements must be blocked at both UI and storage layers.
4. **Competency Matching:** Volunteer dispatch should not rely on guesswork. An automated engine must objectively calculate skill overlap percentages and clearly explain missing prerequisites.
5. **Reliable Client Persistence & Asynchronous Resilience:** A modern web application must handle network latency, transient gateway timeouts (HTTP 503), schema recovery, and state synchronization across browser reloads without data loss.

---

## 3. Target Users

GiveTrack serves four distinct stakeholder personas:
- **Public Donors & Backers:** Individual and corporate philanthropists who require provable, itemised traceability showing that their contributions directly funded verified supplier invoices and procurement bills.
- **NGO Financial Controllers & Administrators:** Operations officers responsible for approving expense vouchers, monitoring campaign capital reserves, and preventing budget deficits.
- **Volunteer Coordinators:** Field leads who schedule community aid shifts, review applicant competencies, and assign volunteers based on skill alignment.
- **Academic Evaluators & Auditors:** Laboratory reviewers who evaluate client-side software architecture, responsive UI compliance, accessibility contrast, and deterministic data structures.

---

## 4. Information Managed

The system manages 6 primary relational entities stored in `localStorage` under isolated schema keys (`STORAGE_KEYS`):
- **Campaigns (`CMP-`):** Name, descriptive scope, budget target (INR), start date, end date, operational status (`active`, `completed`, `paused`), and category (`Food & Nutrition`, `Education`, `Healthcare`, `Environment`).
- **Donations (`DON-`):** Unique contribution ID, allocated `donorId` (`DNR-`), donor full name, target campaign ID, contribution amount (INR), date, payment channel (UPI, Net Banking, Debit Card, Corporate Wire), and unique banking transaction reference code (UTR).
- **Expenses (`EXP-`):** Unique voucher ID, associated campaign ID, item title, procurement category, amount (INR), disbursement date, descriptive rationale, vendor tax invoice reference (`receiptRef`), recorded by role, and verification status (`verified`, `pending`, `rejected`).
- **Volunteers (`VOL-`):** Unique ID, full name, email, phone number, competency skills array (`string[]`), availability window, registration date, and operational status (`active`, `pending`, `inactive`).
- **Opportunities (`OPP-`):** Unique shift ID, campaign ID, shift title, task description, required skills array (`string[]`), volunteer quota, physical location, shift date, timing window, and status (`open`, `filled`, `completed`).
- **Applications (`APP-`):** Composite mapping of volunteer-to-opportunity enrollments, application date, and enrollment status (`pending`, `approved`, `rejected`).

---

## 5. Functional Requirements

- **FR-01 (Dynamic Dashboard):** Compute and render live aggregate metrics (Total Raised, Verified Disbursements, Uncommitted Reserve Balance, Fund Deployment Ratio) alongside an invariant parity formula bar.
- **FR-02 (Pure SVG Analytics):** Render responsive vector charts (Grouped Bar Chart for contributions vs. expenses; Doughnut Chart for category spending) using vanilla SVG DOM generation without external charting libraries.
- **FR-03 (Campaign Portfolio CRUD):** Full lifecycle management for campaigns with safe archival protection prohibiting the deletion of campaigns holding linked financial transactions.
- **FR-04 (Donation Registry CRUD):** Full lifecycle management for donations with unique UTR enforcement via `Set`, donor ID continuity, and active campaign status enforcement.
- **FR-05 (Disbursement Ledger CRUD):** Full lifecycle management for expenses with real-time deficit protection, missing receipt warnings, and campaign balance recomputation.
- **FR-06 (Volunteer & Dispatch CRUD):** Full lifecycle management for volunteers and scheduled shifts with 6-point enrollment guards.
- **FR-07 (Deterministic Skill Matcher):** Automated calculation of volunteer-to-shift competency overlap percentages with explainable pill tags and open-shift handling.
- **FR-08 (GiveTrack Integrity Sentinel):** Automated continuous anomaly detection evaluating 5 distinct financial and documentation integrity rules.
- **FR-09 (Asynchronous Persistence & Resilience):** Promise-based `StorageService` simulating network latency and controlled failure with non-blocking retry toasts.
- **FR-10 (Theme-Aware Interface):** CSS and JavaScript-coordinated light and dark modes with theme-aware text, backgrounds, borders, forms and interactive elements. Contrast was checked on selected interface elements in both themes.
- **FR-11 (Ink-Efficient A4 Print Export):** Dedicated `@media print` financial statement hiding UI chrome and displaying formal ledger reconciliations.

---

## 6. Data Model and Entity Relationships

GiveTrack manages 6 relational collections in client-side storage (`localStorage`). Donors are tracked relationally through derived identities (`donorId`, `donorName`) within `DONATION` records rather than an isolated table:

```
+-------------------------------------------------------------------------+
|                               CAMPAIGN                                  |
| id (PK) | name | description | category | target | dates | status        |
+-------------------------------------------------------------------------+
       | 1                                                 | 1
       |                                                   |
       | N (Restricted to active)                          | N (Deficit guarded)
+-------------------------------+         +-------------------------------+
|           DONATION            |         |            EXPENSE            |
| id (PK)                       |         | id (PK) | campaignId (FK)     |
| donorId (Derived Identity)    |         | title | category | amount     |
| donorName | campaignId (FK)   |         | date | receiptRef | status    |
| amount | date | method        |         +-------------------------------+
| transactionRef (UNIQUE SET)   |                          |
+-------------------------------+                          |
                                                           | 1
+----------------------------------------------------------+
|                      OPPORTUNITY                         |
| id (PK) | campaignId (FK) | title | requiredSkills[]     |
| capacity | shiftDate | shiftTiming | status              |
+----------------------------------------------------------+
       | 1                                                 
       |                                                   
       | N (Capacity guarded)                              
+-------------------------------+         +-------------------------------+
|          APPLICATION          |         |           VOLUNTEER           |
| id (PK) | volunteerId (FK)    |------N:1| id (PK) | name | email        |
| opportunityId (FK) | date     |         | skills[] (INDEXED SET)        |
| status                        |         | availability | status         |
+-------------------------------+         +-------------------------------+
```

---

## 7. Objects, Arrays, Sets and Maps

GiveTrack Lab 3 strictly structures all state using native modern ES6+ data structures:

| Data Structure | Source Location in `script.js` | Concrete Architectural Purpose |
| :--- | :--- | :--- |
| **Object Factories** | Lines 33–110 (`createCampaign`, `createDonation`, `createExpense`, etc.) | Encapsulate entity creation with default values, defensive validation, and uniform object shapes. |
| **Global Collections (Arrays)** | Lines 586–595 (`appState.campaigns`, `appState.donations`, etc.) | In-memory operational stores for tabular rendering, filtering, sorting, and JSON serialization. |
| **Unique Sets (`Set<string>`)** | Lines 665–705 (`rebuildIndices`) | Enforces global uniqueness of banking transaction references (`uniqueTxRefs`) and prevents duplicate volunteer applications (`volunteerApplicationKeys`). |
| **Skills Catalog (`Set<string>`)** | Lines 690–700 (`uniqueVolunteerSkills`) | Dynamic, self-updating index of all unique volunteer competencies used to populate filter dropdowns. |
| **Campaign Lookup Maps (`Map<string, number>`)** | Lines 670–695 (`campaignDonationMap`, `campaignExpenseMap`, `campaignBalanceMap`) | Enables $O(1)$ constant-time lookup for raised totals, verified expenditures, and remaining balances during deficit checks. |
| **Category Allocation Map (`Map<string, number>`)** | Lines 837–855 (`Analytics.getCategorySpending`) | Aggregates expenditure totals per budget category for vector doughnut chart slicing. |

---

## 8. Array Methods

The codebase leverages functional JavaScript idioms without procedural mutation loops:

- **`map` (Lines 575–620, 1310–1980):** Transforms donation and expense records into rendered table rows, modal select options, and chart SVG path coordinates.
- **`filter` (Lines 660–750, 1340–1620):** Multi-criteria filtering for search terms, budget categories, campaign associations, date ranges, and verification states.
- **`reduce` (Lines 782–855):** Computes aggregate totals including global contributions, verified expenditures, uncommitted reserves, and category spending distributions.
- **`find` & `findIndex` (Lines 368, 401, 454, 498, 525, 551):** Fast record lookup by unique ID during edit modal seeding and in-place array updates.
- **`some` & `every` (Lines 714, 2102, 2618):** Enforces safe archival deletion rules (e.g. `hasTransactions = appState.donations.some(d => d.campaignId === id)`).
- **`sort` (Lines 1350–1370, 1480–1500):** Implements multi-field sorting by funding progress percentage, target amount, contribution size, or date.
- **`forEach` (Lines 665–705):** Single-pass state indexing to populate Maps and Sets simultaneously.

---

## 9. Event Handling and DOM Manipulation

GiveTrack implements clean, high-performance UI binding through event delegation and declarative renderers:

- **Event Delegation (`AppEvents.bindDelegatedListeners`, Lines 3030–3250):** A single centralized event listener attached to `document.body` routes table action clicks (`edit-campaign`, `delete-donation`, `match-volunteer`, etc.) using `data-action` attributes, eliminating listener memory leaks.
- **Dynamic Filter Listeners (Lines 3255–3300):** Debounced input listeners and change handlers trigger immediate partial re-rendering of active views.
- **Safe HTML Escaping (`DOMRenderer.escapeHTML`, Line 1270):** Sanitizes all user-supplied strings against cross-site scripting (XSS) before injecting template literals into `innerHTML`.
- **Pure SVG Generation (`ChartEngine`, Lines 1120–1265):** Dynamically constructs `<svg>`, `<rect>`, `<path>`, and `<circle>` nodes with exact viewBox coordinate math, providing crisp vector graphics at any screen scale.

---

## 10. Asynchronous Programming

All persistence operations in `StorageService` (Lines 272–572) are asynchronous, wrapping native `localStorage` in Promises:
- **Simulated Latency:** Configurable artificial roundtrip delay (default 250ms) modeled via `await new Promise(r => setTimeout(r, this.latencyMs))`.
- **Parallel Fetching (`Promise.all`, Lines 2519–2526):** Loads all 6 data entities concurrently during initial application bootstrap and global reloads.
- **Controlled Failure Simulation:** Toggling `storageService.setForceFailure(true)` causes the subsequent asynchronous call to reject with an HTTP 503 Gateway Timeout error to test UI recovery.

---

## 11. Error Handling

- **Defensive Input Validation (`CRUDHandlers`, Lines 2000–2335):** Client-side constraint checking rejects non-positive amounts, missing titles, inverted dates, and unbacked transfers before dispatch.
- **Structured Storage Exceptions:** Clear, actionable error messages thrown when business rules are violated (e.g., `exceeds available funds`, `already registered`).
- **Non-Blocking UI Toasts (`ToastNotification`, Lines 2365–2442):** Errors render in accessible toast notifications (`role="alert"`) featuring an interactive **Retry Action** button that automatically re-executes the failed operation.
- **JSON Recovery:** Corrupted `localStorage` entries are safely trapped in `try/catch` blocks, triggering fallback to clean baseline `SEED_DATA`.

---

## 12. CRUD Implementation

Complete Create, Read, Update, and Delete operations are implemented across all entities:

| Entity | Create Method | Read Method | Update Method | Delete Method & Guard |
| :--- | :--- | :--- | :--- | :--- |
| **Campaign** | `storageService.saveCampaign` | `storageService.getAllCampaigns` | `openEditCampaignModal` | `storageService.deleteCampaign` (Blocked if donations or expenses exist) |
| **Donation** | `storageService.saveDonation` | `storageService.getAllDonations` | `openEditDonationModal` | `storageService.deleteDonation` (Restores reserve balance, unlinks Set) |
| **Expense** | `storageService.saveExpense` | `storageService.getAllExpenses` | `openEditExpenseModal` | `storageService.deleteExpense` (Re-credits campaign balance) |
| **Volunteer** | `storageService.saveVolunteer` | `storageService.getAllVolunteers` | `openEditVolunteerModal` | `storageService.deleteVolunteer` (Blocked if active shift enrollment exists) |
| **Opportunity** | `storageService.saveOpportunity`| `storageService.getAllOpportunities`| `openEditOpportunityModal`| `storageService.deleteOpportunity` (Blocked if approved volunteers enrolled)|

---

## 13. Integrity Sentinel Algorithm

The `IntegritySentinel` engine (Lines 882–1020) evaluates five continuous verification rules:
1. **Duplicate Transaction References:** Detects duplicate UTR/gateway references across distinct donations using an indexed frequency Map.
2. **Missing Receipt References:** Flags expense claims submitted with blank invoice numbers or held in pending status.
3. **Overdrawn Campaign Deficits:** Alerts when total verified expenses exceed total donations raised for any individual campaign.
4. **Independent Sum Reconciliation Parity:** Recomputes raw independent sums from transactions and verifies:
   $$\sum \text{Donations} = \sum \text{Verified Expenses} + \sum \text{Campaign Balances}$$
5. **Statistical Category Outliers:** Calculates the mean of *other* disbursements in a category ($avgOther$) and flags any disbursement where:
   $$\text{Amount} \ge ₹20,000 \quad \text{and} \quad \text{Amount} > 2.5 \times avgOther$$

---

## 14. Volunteer Matching Algorithm

The `SkillMatcher` engine (Lines 1033–1116) implements a deterministic set-intersection algorithm:

$$\text{Match Percentage} = \text{round}\left( \frac{|\text{Volunteer Skills} \cap \text{Required Skills}|}{|\text{Required Skills}|} \times 100 \right)$$

- **Classification:**
  - $\ge 75\%$: **High Match** (Green badge)
  - $40\% - 74\%$: **Moderate Match** (Yellow badge)
  - $< 40\%$: **Low Match** (Muted badge)
- **Open Shift Rule:** If an opportunity has zero required skills ($|\text{Required Skills}| = 0$), it returns an **Open Shift (No Specific Prerequisites)** notice (`score: 0`, `isNA: true`) rather than a misleading 100% score.
- **Visual Breakdown:** Categorizes skills into green *Matched Skills* and red *Missing Skills* tags.

---

## 15. Function Reference Table

All JavaScript functions are implemented inside [script.js](script.js) with zero external dependencies:

| Class / Object Namespace | Function / Method Name | Source File | Line Number | Concrete Architectural Purpose |
| :--- | :--- | :--- | :---: | :--- |
| **Factories** | `createCampaign` | `script.js` | Line 33 | Instantiates validated campaign objects with default active status. |
| **Factories** | `createDonation` | `script.js` | Line 46 | Instantiates validated donation records with UTR and payment method. |
| **Factories** | `createExpense` | `script.js` | Line 59 | Instantiates expense vouchers with receipt reference and audit status. |
| **Factories** | `createVolunteer` | `script.js` | Line 74 | Instantiates community volunteers with indexed skill arrays. |
| **Factories** | `createOpportunity` | `script.js` | Line 87 | Instantiates field shift opportunities with quotas and required skills. |
| **StorageService** | `_guardOperation` | `script.js` | Line 288 | Injects simulated roundtrip latency and evaluates controlled failure flag. |
| **StorageService** | `_read` / `_write` | `script.js` | Lines 305, 317 | Handles safe JSON parsing and serialization to `localStorage`. |
| **StorageService** | `resetAllToSeed` | `script.js` | Line 348 | Restores all 6 storage collections to verified baseline seed figures. |
| **AppState** | `rebuildIndices` | `script.js` | Line 628 | Rebuilds in-memory Sets (`uniqueTxRefs`) and lookup Maps. |
| **Analytics** | `calculateGlobalFinancials`| `script.js` | Line 790 | Aggregates total raised, verified spent, uncommitted reserves, and fund ratio. |
| **Analytics** | `getCampaignFinancials` | `script.js` | Line 820 | Calculates balance, target percentage, and spending for a specific campaign. |
| **IntegritySentinel** | `runFullAudit` | `script.js` | Line 887 | Executes all 5 financial integrity and anomaly detection checks. |
| **SkillMatcher** | `calculateMatch` | `script.js` | Line 1035 | Calculates deterministic set intersection percentage and classifies match tiers. |
| **ChartEngine** | `renderComparisonBarChart` | `script.js` | Line 1122 | Generates responsive SVG grouped bar chart comparing raised vs spent funds. |
| **ChartEngine** | `renderCategoryAllocation` | `script.js` | Line 1219 | Generates responsive SVG vector doughnut chart for category allocations. |
| **DOMRenderer** | `renderDashboardMetrics` | `script.js` | Line 1310 | Updates real-time KPI metric boxes and invariant parity formula bar. |
| **DOMRenderer** | `renderDonationsTable` | `script.js` | Line 1522 | Renders high-contrast inflow registry with unique UTR badge styling. |
| **DOMRenderer** | `renderExpensesTable` | `script.js` | Line 1584 | Renders itemised disbursement ledger with single status icons. |
| **CRUDHandlers** | `handleSaveDonation` | `script.js` | Line 2062 | Validates contribution forms, enforces active campaigns, and blocks duplicate UTRs. |
| **CRUDHandlers** | `handleSaveExpense` | `script.js` | Line 2149 | Validates expense forms and enforces real-time campaign deficit protection. |
| **ToastNotification** | `error` / `clearAll` | `script.js` | Lines 2368, 2426 | Displays accessible error toasts with one-click retry callback triggers. |
| **AppEvents** | `directApplyVolunteer` | `script.js` | Line 2924 | Enforces 6-point enrollment guards before saving volunteer shift assignments. |
| **AppEvents** | `promptResetDemoData` | `script.js` | Line 2993 | Prompts user confirmation and restores verified baseline ledger data. |
| **AppEvents** | `toggleSimulatedFailure` | `script.js` | Line 3014 | Toggles controlled network error mode and updates header toolbar state. |

---

## 16. Installation Instructions

GiveTrack requires no build step, compiler, or external package manager.

### Prerequisites
- Modern web browser: **Google Chrome** (recommended), Microsoft Edge, or Mozilla Firefox.
- For running the automated test suite: **Node.js** (v18.0.0 or higher).

### Quick Start
1. Clone or extract the `NGO/` repository folder.
2. Open `index.html` directly in your browser:
   ```powershell
   # Windows PowerShell
   Start-Process chrome.exe "$((Get-Item .).FullName)\index.html"
   ```
3. To execute the automated 34-point CDP test runner and regenerate screenshots:
   ```powershell
   node run_cdp_audit_and_screenshots.js
   ```

---

## 17. Screenshot Gallery

All 13 screenshots are captured at genuine high resolution from headless Google Chrome and stored in [screenshots/](screenshots/):

1. **`01_desktop_view.png`**: Clean dashboard with verified baseline figures (₹2,75,000 Raised, ₹1,88,000 Spent, ₹87,000 Reserve).
2. **`02_campaign_management.png`**: Campaign portfolio grid with capital allocation progress bars and status filters.
3. **`03_donation_ledger_light.png`**: High-contrast tabular donation ledger in light mode with accessible color contrast.
4. **`04_donation_ledger_dark.png`**: Accessible high-contrast donation ledger in dark mode.
5. **`05_expense_ledger.png`**: Itemised expenditure vouchers with deficit guards and single status icons.
6. **`06_volunteer_matching.png`**: Volunteer directory and deterministic rule-based skill matcher.
7. **`07_integrity_sentinel.png`**: Automated financial anomaly engine interface displaying five verification checks.
8. **`08_financial_reports.png`**: Dynamic financial statements, campaign budget breakdowns, and academic disclosures.
9. **`09_donation_modal.png`**: Contribution pledge modal pre-filled with local today's date (`YYYY-MM-DD`).
10. **`10_async_error_retry.png`**: Simulated asynchronous network failure toast with active "Retry Action" mechanism.
11. **`11_mobile_dashboard.png`**: Responsive mobile reflow at 320px viewport without horizontal layout clipping.
12. **`12_dark_mode_dashboard.png`**: Complete high-contrast dark theme dashboard view.
13. **`13_print_preview.png`**: Ink-efficient A4 print preview displaying formal ledger reconciliation.

---

## 18. Test Cases and Actual Results

All 34 automated unit and integration tests executed in Google Chrome via `run_cdp_audit_and_screenshots.js`:

| # | Test Scenario | Verified Assertion | Result |
| :---: | :--- | :--- | :---: |
| **TC-01** | `openAddCampaignModal` launch | Modal opens with `.is-open` class | **PASS** |
| **TC-02** | `toggleSimulatedFailure` state flip | Toggles `storageService.forceFailure` boolean | **PASS** |
| **TC-03** | `resetDemoData` verified restoration | Restores baseline: ₹2,75,000 raised, ₹1,88,000 spent, ₹87,000 reserve | **PASS** |
| **TC-04** | Inline event handlers method audit | All inline `on*` attributes resolve to valid executable functions | **PASS** |
| **TC-05** | Duplicate transaction reference rejected | Rejects duplicate UTR via active `Set` check | **PASS** |
| **TC-06** | Self UTR preservation during edit | Editing donation preserving its own transaction reference succeeds | **PASS** |
| **TC-07** | Inactive campaign donation blocked | Submitting donation to completed/paused campaign is rejected | **PASS** |
| **TC-08** | Inactive campaign edit switch blocked | Switching existing donation to inactive campaign is blocked | **PASS** |
| **TC-09** | Donor ID continuity tracking | Repeat donor contributions reuse original allocated `donorId` | **PASS** |
| **TC-10** | Deficit disbursement blocked | Voucher exceeding campaign balance blocked before write | **PASS** |
| **TC-11** | Destination balance checked on move | Editing expense validates target campaign balance | **PASS** |
| **TC-12** | Origin credit & destination debit | Moving expense accurately recomputes both campaign balances | **PASS** |
| **TC-13** | Volunteer existence & active check | Non-existent or inactive volunteer assignment rejected | **PASS** |
| **TC-14** | Opportunity existence & open check | Non-existent or closed shift assignment rejected | **PASS** |
| **TC-15** | Shift capacity limit enforcement | Assignment rejected when volunteer quota is reached | **PASS** |
| **TC-16** | Duplicate shift application prevented | Same volunteer applying twice rejected via composite `Set` | **PASS** |
| **TC-17** | 0% match on zero skill overlap | SkillMatcher returns 0% score when competencies do not overlap | **PASS** |
| **TC-18** | Open shift handling (zero prerequisites) | Indicates Open Shift (`isNA: true`, `score: 0`) without false 100% | **PASS** |
| **TC-19** | Sentinel Check 4 discrepancy alert | Deliberately corrupted balance map triggers Critical reconciliation alert | **PASS** |
| **TC-20** | Sentinel Check 5 outlier detection | Outlier voucher (> 2.5x category average) triggers anomaly alert | **PASS** |
| **TC-21** | Actual async failure simulation | When failure flag active, async save rejects with HTTP 503 error | **PASS** |
| **TC-22** | Actual async failure & retry | Form submission failure displays error toast with interactive retry button | **PASS** |
| **TC-23** | Successful retry persistence | Clicking retry button completes save and persists record with zero duplicates | **PASS** |
| **TC-24** | `localStorage` persistence across reload | Entity collections persist in browser storage schema across reload via CDP | **PASS** |
| **TC-25** | Malformed `localStorage` recovery | Corrupted JSON safely handled; gracefully falls back to seed data | **PASS** |
| **TC-26** | Donation modal date default | Modal initializes with local today's date (`YYYY-MM-DD`) | **PASS** |
| **TC-27** | Donation date preserved on edit | Edit modal populates and preserves original historical contribution date | **PASS** |
| **TC-28** | Donation and Expense CRUD lifecycle | Complete Create, Read, Update, Delete cycles verified with updated values | **PASS** |
| **TC-29** | Volunteer and Opportunity CRUD | Complete Create, Read, Update, Delete cycles verified with updated values | **PASS** |
| **TC-30** | Form constraints & validation | Empty names, non-positive amounts, and zero expenses blocked with visible feedback | **PASS** |
| **TC-31** | Dynamic multi-criteria filters | Interactive search and filter controls dynamically filter rendered DOM records | **PASS** |
| **TC-32** | Theme switcher token toggling | Switches `--color-canvas` and surface tokens cleanly between light and dark | **PASS** |
| **TC-33** | Single status icon verification | Exactly one icon per status pill via CSS `::before`; zero literal text glyphs | **PASS** |
| **TC-34** | Real-time balance recalculation | Adding and removing verified disbursements updates campaign balance | **PASS** |

**Summary:** 34 / 34 Tests Passed (100% Pass Rate).

---

## 19. AI-Assisted Development and Critical Evaluation

The complete AI-assisted engineering methodology, independent review findings, prompt transcripts, and trade-off rationales are documented in [docs/ai-evaluation.md](docs/ai-evaluation.md).

Key engineering decisions:
- **Zero External Dependencies:** Rejected heavy chart and state frameworks (Chart.js, Redux, React) in favor of lightweight vanilla ES6+ classes and native SVG vectors.
- **Strict Separation of Concerns:** Retained strict file separation across `index.html`, `style.css`, and `script.js`.
- **Honest Academic Disclosures:** Replaced unverified statutory claims with clear educational simulation notices.

---

## 20. Limitations

- **Client-Side Simulation:** All financial operations run client-side in browser `localStorage`. Real banking API integration, server-side cryptographic signatures, and multi-tenant database synchronization are simulated.
- **Single-User Storage Scope:** Data stored in `localStorage` is scoped to the local browser profile; cross-device collaboration requires a cloud backend.
- **Simulated File Uploads:** Voucher attachments link to simulated local PDF vouchers in `assets/vouchers/` rather than live cloud object storage (e.g., AWS S3).

---

## 21. Future Enhancements

1. **RESTful Backend Integration:** Connect `StorageService` to a Node.js / Express backend backed by a PostgreSQL database with real ACID transactions.
2. **Web3 / Blockchain Anchoring:** Anchor daily financial reconciliation hashes to a public blockchain (e.g. Ethereum or Polygon) for immutable public auditability.
3. **Automated Receipt OCR:** Integrate browser-based Tesseract.js OCR to automatically extract invoice amounts and vendor tax numbers from uploaded receipts.
4. **Volunteer Geolocation Mapping:** Embed interactive OpenStreetMap routing to visualize shift locations and compute volunteer transit proximity.
