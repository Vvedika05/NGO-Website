# GiveTrack Lab 3 — System Screenshots & Verification Manifest

This directory contains the 13 genuine Chrome-captured screenshots documenting the fully interactive, audited GiveTrack JavaScript NGO Donation Transparency & Volunteer Coordination Platform (Lab 3).

All screenshots were generated directly from a live running browser session via the portable Chrome DevTools Protocol test runner (`run_cdp_audit_and_screenshots.js`) after restoring the clean verified baseline seed figures:
- **Total Contributions:** ₹2,75,000
- **Verified Disbursements:** ₹1,88,000
- **Uncommitted Reserve Balance:** ₹87,000

---

### Screenshot Inventory & Descriptions

| Filename | Resolution | View / Component | Key Demonstrated Features |
| :--- | :--- | :--- | :--- |
| **`01_desktop_view.png`** | 1280×900 | Clean Dashboard Overview (`#dashboard`) | Real-time aggregate KPI metrics (₹2,75,000 Raised, ₹1,88,000 Spent, ₹87,000 Reserve Balance, 68.4% Deployment Ratio), active campaign carousel, parity formula invariant, SVG vector charts, and recent activity stream. |
| **`02_campaign_management.png`** | 1280×900 | Campaign Management (`#campaigns`) | Interactive campaign grid with capital allocation tracking, progress bars, category filter, campaign status filter (`active`, `completed`, `paused`), and "+ Create Campaign" trigger. |
| **`03_donation_ledger_light.png`** | 1280×900 | Donation Ledger — Light Mode (`#donations`) | High-contrast tabular inflow registry (accessible contrast: `#073B36` headers, `#047857` amounts, `#0F172A` text), unique transaction reference enforcement via `Set`, donor ID continuity, and date-range filters. |
| **`04_donation_ledger_dark.png`** | 1280×900 | Donation Ledger — Dark Mode (`#donations`) | Accessible dark theme table palette (accessible contrast: `#5EEAD4` headers, `#34D399` amounts, `#EDFBF9` text on `#0B2926` card surface), displaying identical data integrity across theme switches. |
| **`05_expense_ledger.png`** | 1280×900 | Expense Management (`#expenses`) | Itemised disbursement ledger with automated deficit protection, missing invoice detection, and exactly ONE icon per status indicator (`status-pill`). |
| **`06_volunteer_matching.png`** | 1280×900 | Volunteer Matching (`#volunteers`) | Registered volunteer roster with status/skill filters, shift opportunities grid, and the deterministic rule-based skill matcher engine calculating match percentages. |
| **`07_integrity_sentinel.png`** | 1280×900 | Integrity Sentinel (`#sentinel`) | Continuous automated financial audit engine flagging duplicate transaction references, unvouched disbursements, campaign deficits, raw sum reconciliation mismatches, and statistical outliers. |
| **`08_financial_reports.png`** | 1280×900 | Financial Reports (`#reports`) | Live financial reconciliation statement, campaign-wise allocation breakdown, transparent tax exemption disclosure, and academic demonstration governance notices. |
| **`09_donation_modal.png`** | 1280×900 | Contribution Modal (`#modal-donation`) | Accessible modal form with real-time constraint validation, active campaign select dropdown, and donation date automatically pre-filled with local today's date (`YYYY-MM-DD`). |
| **`10_async_error_retry.png`** | 1280×900 | Async Error Toast & Retry | Accessible non-blocking error toast notification showing simulated network failure (HTTP 503 Gateway Timeout) with an active one-click "Retry Action" mechanism. |
| **`11_mobile_dashboard.png`** | 320×800 | Mobile Dashboard Reflow | Narrow viewport compliance (320px) demonstrating responsive single-column reflow, touch-friendly buttons, and horizontal table wrapping with zero layout clipping. |
| **`12_dark_mode_dashboard.png`** | 1280×900 | Dark Mode Dashboard (`#dashboard`) | Accessible high-contrast dark theme dashboard with deep teal canvas (`#061B19`), surface cards (`#0B2926`), crisp white typography, and turquoise indicators. |
| **`13_print_preview.png`** | A4 Landscape / Print | Ink-Efficient A4 Print Report | Dedicated `@media print` financial statement hiding UI chrome and navigation, displaying formal black-on-white accounting reconciliation and legal audit declaration. |

---

### Verification and Reproduction Procedure

To re-run the complete 34-test verification suite and regenerate all 13 screenshots:

```powershell
# Inside the NGO project directory:
node run_cdp_audit_and_screenshots.js
```

The script automatically locates Google Chrome (via `CHROME_PATH` or standard system install locations), connects via the Chrome DevTools Protocol, executes all 34 automated unit and integration tests against the live DOM and localStorage layers, restores the clean baseline data, and captures the 13 approved screenshots.
