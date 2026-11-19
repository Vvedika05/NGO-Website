# GiveTrack Lab 3 — AI-Assisted Development and Independent Evaluation

**Project:** GiveTrack — NGO Donation Transparency and Volunteer Matching Platform  
**Application:** Client-side HTML, CSS and vanilla JavaScript (ES6+)  
**Evaluation scope:** AI-assisted development, independent technical review, prompt history, implementation decisions, test evidence, limitations and final academic suitability.

> **Academic demonstration disclosure:** GiveTrack is an educational prototype. Donor details, transaction references, financial records and voucher data are illustrative. The application does not process real payments, connect to banking networks, hold funds, or provide statutory audit or tax certification.

## 1. Purpose and AI tools used

This document combines the development history and the independent evaluation into one record. It is intended to be the single AI evaluation document for the Lab 3 project.

| Tool | Role | Contribution recorded |
|---|---|---|
| Google Antigravity | AI-assisted development environment | Generated and revised the HTML, CSS and JavaScript implementation, application documentation, test runner and screenshots in response to the supplied development and correction instructions. |
| ChatGPT | Independent review and evaluation assistant | Reviewed the project materials and screenshots, identified implementation and documentation limitations, proposed corrective actions, supplied targeted prompts for Antigravity, and prepared this evaluation. |

The two roles are distinct. Antigravity was used to develop and revise the application. ChatGPT was used to review the resulting work, challenge unsupported claims, identify defects and recommend changes.

No separate evaluation from a third AI product is represented here. The available record does not contain a complete prompt and response from another AI tool, so none has been invented or attributed to one.

## 2. Development objective and prompt history

### 2.1 Lab 3 development objective

The project brief was to extend the existing GiveTrack NGO website into an interactive JavaScript application that addresses donation transparency and volunteer coordination. The application needed to demonstrate objects, arrays, Sets, Maps, data processing, event handling, asynchronous programming, error handling and an original enhancement.

The development requirements supplied to Antigravity included:

- Preserve the existing GiveTrack name, logo, brand identity and established project folder.
- Manage campaigns, donations, expenses, volunteers, volunteer opportunities and applications.
- Use objects and arrays to model records and Sets and Maps for uniqueness, indexing and aggregation.
- Implement search, filtering, sorting, calculations and record manipulation.
- Provide interactive forms, validation, dynamic rendering and event handling.
- Demonstrate asynchronous operations with simulated latency, failure handling and retry.
- Include an original intelligent feature that goes beyond basic CRUD.
- Keep HTML, CSS and JavaScript in separate source files.
- Provide a project README, technical documentation, test evidence and screenshots.

**Prompt provenance:** The complete verbatim text of the first Antigravity generation prompt is not present in the currently available conversation record. The requirements above are therefore a prompt brief, not a quotation presented as the exact original prompt.

### 2.2 Development and correction phases

| Phase | Prompt/instruction brief | Intended result |
|---|---|---|
| 1. Initial JavaScript implementation | Extend the existing GiveTrack website into a JavaScript application, preserve branding, implement data structures, CRUD, dashboard analytics, Sentinel checks, volunteer matching and asynchronous persistence. | Establish the main application architecture and required JavaScript concepts. |
| 2. First technical correction | Correct event-handler mismatches, transaction-reference validation, campaign restrictions, expense balance transfers, volunteer capacity and Sentinel calculations without rebuilding the application. | Make business rules enforceable in JavaScript and improve financial consistency. |
| 3. Visual refinement | Correct text visibility in light and dark themes, spacing, duplicate status icons, toolbar and footer readability, and the contribution-date default. | Make the interface usable across themes and screen sizes. |
| 4. Final submission audit | Remove obsolete media assets and unsupported statutory wording, strengthen automated tests, make the browser test runner portable, capture the required screenshots and align project documentation with the source. | Produce a coherent Lab 3 submission with traceable test evidence. |
| 5. Final accuracy and verification | Correct the remaining test assertions and ensure that source code, UI, screenshots, README and technical documents describe the same implementation. | Complete the final quality-control pass without redesigning the product. |

The full correction prompts written by ChatGPT for Antigravity are reproduced in Appendix C. The initial Antigravity prompt and some intermediate Antigravity instructions are represented as briefs because their full original transcripts are not available in the current record.

## 3. AI-generated implementation and architecture

The generated implementation uses vanilla JavaScript and separates responsibilities across the main source files.

| Component | Responsibility |
|---|---|
| `AppState` | Holds application records and derived indexes. |
| `StorageService` | Provides asynchronous browser-storage operations, simulated latency and controlled failure. |
| `CRUDHandlers` | Handles create, read, update and delete workflows. |
| `DOMRenderer` | Renders application views and updated records. |
| `AppEvents` | Handles user actions and delegated event listeners. |
| `IntegritySentinel` | Runs financial and record-integrity checks. |
| `SkillMatcher` | Calculates volunteer-to-opportunity skill matches. |
| `ChartEngine` | Renders dashboard charts using SVG. |

### 3.1 Strengths of the generated implementation

1. It uses native JavaScript rather than a framework, making the required course concepts visible in the source.
2. It uses Sets for duplicate prevention and uniqueness checks.
3. It uses Maps for campaign-level financial aggregation and lookup.
4. It includes record-management workflows for the principal application entities.
5. It includes campaign financial calculations and volunteer skill matching.
6. It provides asynchronous storage simulation, error notifications and a controlled failure mode.
7. It preserves separate HTML, CSS and JavaScript files and the GiveTrack visual identity.

### 3.2 Data structures and processing

The application models campaign, donation, expense, volunteer, opportunity and application records as JavaScript objects stored in arrays. Sets support uniqueness and membership checks, including transaction references and volunteer application keys. Maps support campaign-level aggregation and derived financial indexes.

Array processing includes methods such as `map()`, `filter()`, `reduce()`, `find()`, `findIndex()`, `some()`, `sort()` and `forEach()`. These are used for rendering, searching, filtering, totals, matching and record lookup.

The application uses event delegation and DOM updates to respond to user actions. Asynchronous persistence is simulated through Promises and `async`/`await`, with a controlled delay and failure path. It uses browser `localStorage`; it does not connect to a remote database or real network service.

## 4. Independent technical review: findings and recommendations

The first independent review examined the generated implementation against the business rules of the NGO donation and volunteer platform.

| No. | Finding | Why it mattered | Recommendation |
|---:|---|---|---|
| 1 | Some HTML controls referenced handler names that did not match the implemented methods. | Visible controls could fail when activated. | Align names or add explicit aliases, then test the actual interaction. |
| 2 | Editing a donation could treat its existing transaction reference as a duplicate of itself. | A valid edit could be rejected. | Normalize the reference and exclude the current record ID during duplicate checking. |
| 3 | Donations could be associated with inactive or completed campaigns. | Records could violate campaign business rules. | Validate campaign status in both creation and editing handlers. |
| 4 | Moving an expense between campaigns did not correctly isolate the destination campaign's available balance. | The edit could incorrectly use funds from another campaign. | Validate the destination balance independently and recompute both affected campaigns. |
| 5 | Volunteer capacity relied too heavily on interface state. | Direct or repeated submissions could exceed shift capacity. | Enforce capacity in the JavaScript application logic before saving. |
| 6 | Sentinel reconciliation used a derived balance equation that could repeat the calculation being checked. | The check might fail to detect stale indexes or cached balances. | Compare independently calculated transaction totals with derived indexes and balances. |
| 7 | The expense outlier baseline included the transaction being tested. | A large transaction could influence its own comparison average. | Exclude the tested transaction from the comparison baseline. |
| 8 | The interface used unsupported statutory, audit and escrow wording. | Illustrative data could be mistaken for real certification or custody of funds. | Use an explicit academic demonstration disclosure. |

### 4.1 Recommendations and implementation decisions

| Finding | Recommendation supplied | Implementation decision recorded |
|---|---|---|
| Handler-name mismatch | Align control names and JavaScript methods or provide aliases. | Compatibility aliases were added for the affected controls. |
| Duplicate transaction reference on edit | Trim and normalize references; exclude the edited record's own ID. | Duplicate checking was updated to permit a record to retain its own reference. |
| Inactive campaign contribution | Validate campaign status in the save operation. | Donation creation and editing check that the selected campaign is active. |
| Expense moved between campaigns | Check destination funds independently and recompute both balances. | Source and destination campaign balances are recalculated separately. |
| Volunteer capacity | Validate volunteer, opportunity, status, capacity and duplicate application in the save path. | JavaScript-level application guards were added. |
| Reconciliation check | Recompute raw sums independently of cached indexes. | Sentinel Check 4 compares raw transaction totals with derived state. |
| Outlier check | Exclude the tested transaction from its comparison average. | Sentinel Check 5 uses a comparison baseline excluding the tested item. |
| Unsupported claims | Replace audit, tax and escrow claims with accurate prototype wording. | Academic demonstration disclosures were introduced. |

## 5. Visual and usability evaluation

The review used the supplied screenshots and browser inspection to identify problems that were not obvious from reading the source alone.

| No. | Observed issue | Cause identified | Correction recorded |
|---:|---|---|---|
| 1 | Campaign toolbar heading was difficult to read in light mode. | A system dark-mode media query changed the surface without consistently changing the text. | Theme-aware toolbar surface and text tokens were applied. |
| 2 | Application status strip showed dark text on a dark surface. | Foreground and background tokens were not paired. | Toolbar text and background were bound to matching theme tokens. |
| 3 | Footer text became difficult to read in light mode. | Footer styling reused a colour token that changed meaning in dark mode. | Dedicated footer background and text tokens were introduced. |
| 4 | Hero photo badge overlapped the primary action buttons. | The photo wrapper class in the HTML did not match the positioned CSS wrapper selector. | The wrapper class was aligned with the CSS rule. |
| 5 | Campaign category and status badges were poorly styled. | Generic and dynamic category classes lacked complete theme-aware styling. | Category and status badge styles were added. |
| 6 | Status indicators showed duplicate glyphs such as `✓ ✓ Verified`. | JavaScript inserted a glyph while CSS `::before` inserted another. | JavaScript renders the label and CSS supplies the single icon. |
| 7 | Contribution date was blank when the modal opened. | Form reset removed the date value. | A local-date helper supplies today's date for new records and preserves the historical date when editing. |
| 8 | Legacy prototype wording and HTML5 video/WebVTT content remained. | Earlier lab material was still present. | Unneeded video/caption material and prototype wording were removed. |
| 9 | Donation ledger text appeared pale on light table surfaces. | Theme-rule inversion and selector specificity conflicts overrode the intended text colours. | The conflicting theme override was corrected and table-specific styles were made explicit. |
| 10 | Financial breakdown displayed two reconciliation checkmarks. | Both the JavaScript label and CSS pseudo-element supplied a checkmark. | The JavaScript label was changed to plain `Reconciled`, leaving one CSS icon. |

### 5.1 Contrast-evaluation qualification

The development history records selected foreground/background measurements taken in Chrome for particular table, text and button elements. Those measurements are useful spot checks, but they do not establish full application-wide WCAG conformance. This report therefore does not describe the application as certified WCAG AA or AAA. Readability was checked on selected elements in the light and dark themes; a complete accessibility audit is outside the evidence recorded here.

## 6. Intelligent enhancements: independent assessment

### 6.1 GiveTrack Integrity Sentinel

The Sentinel performs five categories of checks:

1. Duplicate transaction references.
2. Missing receipt or voucher references.
3. Campaign expenses that exceed available funds.
4. Independent financial reconciliation.
5. Statistical expense outlier detection.

**Independent assessment:** This is a meaningful enhancement because it addresses the platform's donation-transparency problem through record-integrity checks beyond ordinary CRUD. The alerts are rule-based checks. They do not prove fraud, establish intent or constitute a formal audit.

### 6.2 Volunteer Skill Matcher

The matcher compares a volunteer's recorded skills with an opportunity's required skills and calculates a percentage of required skills matched.

**Independent assessment:** This is relevant to volunteer coordination and demonstrates Set-based comparison and data processing. The percentage reflects only the recorded skill tags; it is not a guarantee of a volunteer's suitability or performance.

## 7. Suggestions considered, accepted and rejected

The review considered the following design alternatives and recommendations.

| Suggestion or alternative | Decision | Reason |
|---|---|---|
| Use React or Vue for the interface. | Rejected | The Lab 3 task expects direct demonstration of JavaScript concepts; a framework was unnecessary for the required scope. |
| Add a large external charting library. | Rejected | Native SVG can provide the required charts without another dependency. |
| Connect a real payment gateway. | Rejected | Real payment processing requires backend security, credentials and payment-provider integration outside this client-side lab. |
| Treat `localStorage` as a real backend. | Rejected | Browser storage is local to one browser profile and does not provide server-side security or multi-user synchronisation. |
| Rely only on disabled buttons for business-rule enforcement. | Rejected | Validation must also run in JavaScript save operations because UI state can be bypassed. |
| Use a derived balance equation as the only reconciliation test. | Rejected | Independent recomputation is needed to detect stale or corrupted derived state. |
| Display statutory audit or tax certification wording for realism. | Rejected | The project contains no evidence of actual registration or certification. |
| Use the CSS pseudo-element and JavaScript to both insert the same status icon. | Rejected | It creates duplicate glyphs; one rendering mechanism should own the icon. |

The accepted recommendations focused on business-rule enforcement, independent reconciliation, outlier calculation, readable theme states, accurate documentation and stronger end-to-end tests.

## 8. Current implementation evidence and scope

The final project package contains:

- `index.html` — application sections, forms, navigation and page structure.
- `style.css` — layout, responsive rules, theme styles and visual states.
- `script.js` — data models, state, processing, event handling, CRUD, asynchronous storage, matching and Sentinel logic.
- `docs/data-model.md` — entities, relationships and constraints.
- `docs/javascript-concepts.md` — mapping of course concepts to the source implementation.
- `run_cdp_audit_and_screenshots.js` — browser-based test and screenshot runner.
- `test_verification_report.json` — recorded automated test results.
- `screenshots/` — 13 application screenshots.
- `assets/` — GiveTrack logo, campaign photography and illustrative voucher PDFs.

### Implementation qualifications

- Persistence uses browser `localStorage`; there is no remote database.
- Latency and connection failures are simulated to demonstrate asynchronous control flow.
- The application does not process real payments or connect to UPI, banks or payment gateways.
- Volunteer matching is deterministic and rule-based, not a trained machine-learning model.
- Sentinel alerts are rule-based checks, not formal fraud detection or statutory auditing.
- Donor, transaction, expense and voucher details are illustrative demonstration data.

## 9. Automated test evidence

The final uploaded `test_verification_report.json` records **34 passing assertions out of 34**, with zero recorded failures. The report timestamp is `2026-11-19T16:31:28.556Z`.

The test runner is `run_cdp_audit_and_screenshots.js`. The following table reproduces the test names and pass statuses recorded in the uploaded JSON report.

| Test ID | Test scenario recorded in JSON | Recorded result |
|---|---|---|
| TC-01 | openAddCampaignModal launches modal | PASS |
| TC-02 | toggleSimulatedFailure toggles network state | PASS |
| TC-03 | resetDemoData actually restores modified data to verified baseline | PASS |
| TC-04 | All inline event handlers resolve to existing methods | PASS |
| TC-05 | Duplicate transaction reference rejected via Set | PASS |
| TC-06 | Editing donation preserving its own tx ref succeeds | PASS |
| TC-07 | Donation to inactive/completed campaign rejected | PASS |
| TC-08 | Switching donation to inactive campaign rejected | PASS |
| TC-09 | Donor ID continuity across repeat contributions | PASS |
| TC-10 | Expense exceeding campaign balance rejected | PASS |
| TC-11 | Editing expense validates against destination balance | PASS |
| TC-12 | Moving expense credits origin and debits destination | PASS |
| TC-13 | directApplyVolunteer validates volunteer existence & status | PASS |
| TC-14 | directApplyVolunteer validates opportunity existence & status | PASS |
| TC-15 | directApplyVolunteer rejects enrollment when capacity reached | PASS |
| TC-16 | Duplicate volunteer enrollment prevented via Set | PASS |
| TC-17 | Skill matching calculates 0% for zero overlap | PASS |
| TC-18 | Opportunity with zero required skills indicates Open Shift | PASS |
| TC-19 | Deliberate balance corruption triggers Sentinel Check 4 discrepancy alert | PASS |
| TC-20 | Sentinel Check 5 detects statistical disbursement outlier | PASS |
| TC-21 | Actual asynchronous failure simulation rejects with HTTP 503 error | PASS |
| TC-22 | Actual asynchronous failure renders error toast with interactive retry button | PASS |
| TC-23 | Clicking retry button successfully completes and persists failed transaction with zero duplicates | PASS |
| TC-24 | localStorage schema and data persists across page reload via CDP | PASS |
| TC-25 | Invalid localStorage recovery restores baseline without crashing | PASS |
| TC-26 | Donation modal initializes with local today date by default | PASS |
| TC-27 | Donation editing preserves original historical date | PASS |
| TC-28 | Complete donation and expense CRUD cycle with updated value verification | PASS |
| TC-29 | Complete volunteer and opportunity CRUD cycle with updated value verification | PASS |
| TC-30 | Form constraints reject non-positive amounts and missing mandatory fields with visible feedback | PASS |
| TC-31 | Interactive search and filter controls dynamically filter rendered DOM records | PASS |
| TC-32 | Theme switcher cleanly toggles design tokens between light and dark | PASS |
| TC-33 | All status indicators display exactly one icon via CSS pseudo-element with zero duplicate text glyphs | PASS |
| TC-34 | Campaign balance dynamically recomputed on disbursement addition and removal | PASS |

**Recorded result:** 34/34 passing (100% of the assertions in the supplied report).

**Evidence qualification:** This is the result recorded by the supplied test runner and JSON report. It is not a claim that every possible workflow, browser, operating system or accessibility state has been tested independently. The report and runner should be retained together so the test names, assertions and result file can be examined.

### 9.1 Test coverage represented

The test suite includes checks for:

- Modal and toolbar control behaviour.
- Duplicate transaction references and donation editing.
- Campaign status restrictions.
- Donor ID continuity.
- Expense balance validation and campaign transfers.
- Volunteer and opportunity status and capacity.
- Duplicate volunteer applications.
- Skill-match edge cases.
- Sentinel reconciliation and outlier detection.
- Simulated asynchronous failure, error notification and retry.
- Browser storage persistence and invalid-storage recovery.
- Default and historical contribution dates.
- Donation, expense, volunteer and opportunity CRUD.
- Form constraints and visible validation feedback.
- Interactive search and filtering.
- Theme switching and status icon rendering.
- Campaign balance recalculation.

### 9.2 Test-report wording note

The JSON test name for TC-21 says “HTTP 503 error”, but the inspected `StorageService` source throws a locally generated `Error` with the message `Simulated Network Latency Timeout`; it does not make an HTTP request or receive an HTTP 503 response. The test result is recorded as PASS, but the test description should be renamed to “Simulated asynchronous storage failure” if the JSON report is regenerated. This distinction matters because the application demonstrates a simulated failure path, not an actual HTTP response.

### 9.3 Independent review limitations

The independent review assessed the available source, documentation, screenshots and supplied test artifacts. The recorded 34/34 result is taken from the final uploaded JSON report. This document does not claim that the independent reviewer separately reproduced all 34 browser tests in a different execution environment.

A passing automated suite provides evidence for the assertions it contains; it does not prove the absence of all defects. In particular, the simulated asynchronous service is not a substitute for testing a real server API.

## 10. Limitations and future work

1. **Client-side persistence:** `localStorage` is not a secure shared database and is limited to one browser profile.
2. **No real payment integration:** Transaction references are illustrative; the application does not contact UPI, banks or payment gateways.
3. **No production authentication:** The prototype does not provide production-grade user identity or role-based access control.
4. **No server-side validation:** Business rules run in client-side JavaScript and could be bypassed by a technically capable user.
5. **Rule-based matching:** Volunteer suitability depends on the completeness and accuracy of recorded skill tags.
6. **Rule-based anomaly checks:** Sentinel alerts identify configured patterns; they do not establish fraud or legal non-compliance.
7. **Simulated asynchronous service:** Artificial latency and failures demonstrate asynchronous control flow but do not represent a real remote API.
8. **Illustrative records:** Donors, amounts, vouchers and organisational details are sample data for demonstration.

Future work could include a secure backend, authentication and role permissions, database persistence, real payment-provider sandbox integration, audit trails and more extensive accessibility testing. These are future extensions, not capabilities claimed by the current lab application.

## 11. Final independent evaluation

GiveTrack addresses a meaningful NGO problem by combining donation and expense tracking, campaign-level financial reconciliation and volunteer coordination. Its technical strengths are the use of JavaScript objects, arrays, Sets and Maps; record processing and filtering; event-driven interface updates; CRUD workflows; asynchronous browser-storage simulation; and two domain-specific enhancements.

The Integrity Sentinel adds rule-based financial and record-integrity checks. The Volunteer Skill Matcher applies deterministic skill comparison to volunteer opportunities. These features make the application more substantial than a basic CRUD exercise.

The independent review identified issues in event binding, transaction validation, campaign balances, volunteer capacity, reconciliation mathematics, outlier calculation, theme readability, duplicate status icons and unsupported organisational wording. Targeted correction instructions were supplied, and the final project artifacts record corresponding implementation changes and a 34/34 automated test result.

The project is suitable as a Lab 3 submission when presented accurately as a client-side educational prototype. Its documentation should not imply real payment processing, banking integration, formal auditing, statutory certification, a production backend or complete accessibility certification.

---

## Appendix A — Prompt provenance

This appendix distinguishes prompt records from summaries.

| Prompt record | Availability | Treatment |
|---|---|---|
| Lab 3 assignment requirements | Supplied in the conversation | Used as the development requirements. |
| Initial Antigravity implementation prompt | Full verbatim transcript is not present in the available record. | Summarised as a prompt brief in Section 2.1. |
| First Antigravity correction instructions | Topics and findings are preserved, but not every complete original prompt transcript. | Recorded as a phase brief in Section 2.2 and detailed recommendations in Section 4. |
| Visual refinement instructions | The issues and correction requirements are preserved; the complete initial transcript is not available here. | Summarised in Section 2.2; the full ChatGPT-authored correction prompt is reproduced in Appendix C.1. |
| Final submission audit prompt | A correction prompt is preserved in the conversation record. | Reproduced in Appendix C.2 with the project-documentation terminology clarified. |
| Final submission accuracy prompt | Full prompt is available in the conversation record. | Reproduced in Appendix C.3. |
| Independent second-AI evaluation | No complete second-tool prompt and response are present in the available materials. | Not claimed as completed. |

## Appendix B — AI-generated suggestions and independent decisions

This table separates the development assistant's implementation direction from the independent review decisions.

| Area | Development approach visible in the project | Independent evaluation |
|---|---|---|
| Application architecture | Vanilla JavaScript modules/classes and separated HTML/CSS/JS files. | Appropriate for demonstrating the required JavaScript concepts. |
| Data organisation | Objects, arrays, Sets and Maps. | Appropriate; the report should identify actual uses rather than merely list declarations. |
| Financial tracking | Campaign donation and expense aggregation. | Requires independent recomputation and destination-balance validation. |
| Volunteer allocation | Skill matching and shift applications. | Requires server-independent JavaScript capacity and duplicate guards in this client-side prototype. |
| Charts | SVG-based chart rendering. | Suitable; avoids an unnecessary external chart dependency. |
| Persistence | Asynchronous `localStorage` wrapper. | Suitable as a lab demonstration when clearly described as simulated local persistence. |
| Error handling | Controlled failure mode and retry notifications. | Appropriate for demonstrating asynchronous failure and recovery, but not a real network integration. |
| Integrity checks | Five rule-based Sentinel checks. | Useful as anomaly flags; not evidence of fraud or a formal audit. |
| Accessibility | Theme tokens and selected contrast measurements. | Describe as selected contrast checks, not full WCAG certification. |
| Documentation | README, data model, JavaScript concepts and AI evaluation records. | Keep names, statuses, claims and test results consistent with the source and JSON report. |

## Appendix C — ChatGPT correction prompts supplied for Antigravity

The prompts in this appendix were authored by ChatGPT as independent review instructions. They are not Antigravity-generated prompts. The initial Antigravity generation prompt is recorded as a brief because its complete verbatim text is not available.

### C.1 Theme-aware text visibility and duplicate icon correction

**Prompt provenance:** ChatGPT-authored correction prompt supplied for Antigravity.

```text
# GiveTrack – Final Theme-Aware Text Visibility and Duplicate Icon Correction

Perform a final visual correction pass on the existing GiveTrack application.

Do not redesign the application or replace its branding.

## 1. Theme-aware text visibility – highest priority

Inspect the entire application in both light and dark modes.

Ensure that all text remains readable against its actual background, including:
- Dashboard headings and subtitles.
- Campaign names and descriptions.
- Donation and expense tables.
- Volunteer cards and matching results.
- Toolbar labels.
- Modal titles and form labels.
- Footer content.
- Notifications and error messages.
- Empty states and loading messages.
- Disabled controls and hover states.

### Specific screenshot defect: Donation ledger

The donation ledger currently displays very pale text on a light surface.

Correct the text visibility for:
- Donation ID.
- Donor name.
- Donor ID.
- Campaign name.
- Amount.
- Date.
- Transaction reference.
- Table headers.
- Action controls.

Do not change the underlying donation data or table functionality.

### Theme switching

When users switch themes:

- All foreground text must update correctly.
- All backgrounds must update correctly.
- Borders must remain visible.
- Form controls must remain readable.
- Table rows must remain readable.
- Status badges must remain readable.
- Icons must remain visible.
- Modals must retain adequate contrast.

Do not rely on browser system colour preference alone. Respect the application's actual selected theme.

Inspect CSS variables, inherited styles, specificity conflicts, legacy selectors and hardcoded inline styles.

Avoid isolated fixes that solve one table but break another.

Verify text contrast using the actual computed foreground and background values in both themes.

Target WCAG AA contrast requirements for normal and large text.

Do not claim compliance without testing.

## 2. Eliminate all duplicate checkmark icons

The latest financial breakdown screenshot still displays:

`✓ ✓ Reconciled`

This is incorrect.

Search the entire project for duplicated status icons, especially:

- Reconciled.
- Verified.
- Approved.
- Pending.
- Rejected.
- Failed.
- Warning.
- Critical.

Inspect:
- Literal Unicode symbols in HTML.
- Symbols inserted by JavaScript templates.
- CSS ::before and ::after pseudo-elements.
- SVG icons.
- Icon-library elements.
- Dynamically generated status badges.

Determine the actual source of duplication.

For each status indicator, render exactly ONE icon.

Examples:

`✓ Reconciled`

`✓ Verified`

`⏱ Pending`

`✕ Rejected`

Do not display two checkmarks for a single status.

Apply the correction consistently to:
- Financial reconciliation tables.
- Donation ledger.
- Expense ledger.
- Campaign cards.
- Volunteer applications.
- Integrity Sentinel.
- Dashboard activity.

Do not simply remove all icons. Preserve one appropriate icon per status.

## 3. Inspect all table layouts

Check every table in light and dark modes.

Ensure:
- Header text is visible.
- Body text is visible.
- Secondary IDs are visible.
- Transaction reference badges are readable.
- Amounts are distinguishable.
- Action icons are visible.
- Row hover states do not reduce readability.
- Alternating backgrounds do not create contrast problems.

Check horizontal scrolling and responsive layouts.

## 4. Verify the correction in the actual browser

Use the actual running application.

Capture the donation ledger and financial reconciliation table in BOTH themes.

Compare the computed foreground and background colours for the affected text.

Verify that each status badge contains exactly one visual icon.

Inspect the complete dashboard, not only the two affected sections.

## 5. Preserve previous work

Do not remove:
- Objects, Arrays, Sets and Maps implementation.
- CRUD functionality.
- Asynchronous operations.
- Error handling.
- Integrity Sentinel.
- Volunteer matching.
- Financial reconciliation logic.
- Existing Lab 3 screenshots and documentation.
- Original independent audit findings.
- Original Antigravity prompts and correction history.

## 6. Final verification

After fixing:

1. Run JavaScript syntax validation.
2. Check HTML and CSS.
3. Switch to light mode and inspect all modules.
4. Switch to dark mode and inspect all modules.
5. Inspect the donation ledger.
6. Inspect the financial reconciliation table.
7. Verify single icons in all status indicators.
8. Verify the application console has no new errors.
9. Capture genuine updated screenshots.

Update README.md and the project AI evaluation document with the remaining visual defects, their actual root causes and the corrections implemented.

Do not claim that an issue is fixed until the corrected browser output confirms it.
```

### C.2 Final submission audit and project documentation corrections


```text
# GiveTrack – Final Submission Audit and Project Documentation Corrections

This is the final quality-control phase of the existing GiveTrack project.

Do not rebuild the application.

Preserve all working JavaScript functionality and the original AI-assisted development history.

## A. Remove obsolete assets and files

Remove:
- campaign-impact.mp4
- video-poster.jpg if unused
- captions/campaign-impact.vtt
- captions directory if empty
- screenshots/04_video_playing.png
- debug_matched_rules.js

Verify that no active HTML, CSS or JavaScript references are broken.

Retain useful campaign photography.

## B. Remove unsupported organisational claims

Review index.html and README.md.

Replace unverified claims about:
- Independent Chartered Accountant audits.
- Unqualified audit opinions.
- Official audit reference numbers.
- Section 80G registration.
- Form 10BD filing.
- Certified utilisation.
- Actual bank escrow.
- Zero administrative overhead.
- Official statutory declarations.

Use clear academic demonstration disclosures.

State that financial data, receipts and audit records are illustrative and that the application does not process real payments or hold funds.

## C. Improve the automated test suite

Retain the existing 20 test cases, but strengthen their assertions.

TC-03 must actually reset modified records and verify the original seed data.

TC-04 must inspect every inline event handler and verify that its referenced method exists.

TC-19 must deliberately corrupt a campaign index or balance and verify that Integrity Sentinel detects the discrepancy.

TC-20 must execute IntegritySentinel.runFullAudit() using a test dataset containing an actual statistical outlier and verify the resulting alert.

Add tests for:

1. Actual asynchronous failure.
2. Actual retry after failure.
3. Successful retry persistence.
4. localStorage persistence after reload.
5. Invalid localStorage recovery.
6. Donation date default.
7. Donation date editing.
8. Donation and expense CRUD.
9. Volunteer and opportunity CRUD.
10. Form validation.
11. Dynamic filters.
12. Light and dark mode.
13. Single status icons.
14. Campaign balance recalculation.

Do not count a test as passed if it only checks whether a function exists.

## D. Correct screenshot generation

Before taking screenshots:

1. Restore SEED_DATA.
2. Reload the application.
3. Clear all generated error and success toasts.
4. Ensure no test records remain.
5. Verify baseline financial figures.

The initial seed figures must be:
- Donations: ₹2,75,000.
- Verified expenses: ₹1,88,000.
- Remaining balance: ₹87,000.

Capture:
- Clean dashboard.
- Campaign management.
- Donation ledger in light mode.
- Donation ledger in dark mode.
- Expense management.
- Volunteer matching.
- Integrity Sentinel.
- Financial reports.
- Donation modal with today's date.
- Actual asynchronous failure and retry.
- Mobile dashboard.
- Dark mode dashboard.
- Print report.

Keep only the approved Lab 3 screenshots and update screenshots/README.md.

## E. Make test runner portable

Remove hardcoded personal Windows paths.

Derive index.html using the current project directory and pathToFileURL().

Allow the Chrome executable path to be configured.

Ensure that the test runner can execute after the project is downloaded and extracted into a different folder.

## F. Correct project documentation

Update README.md and the technical documentation.

Add or verify these sections:

1. Problem Statement.
2. Problem Analysis.
3. Target Users.
4. Information Managed.
5. Functional Requirements.
6. Data Model and Entity Relationships.
7. Objects, Arrays, Sets and Maps.
8. Array Methods.
9. Event Handling and DOM Manipulation.
10. Asynchronous Programming.
11. Error Handling.
12. CRUD Implementation.
13. Integrity Sentinel Algorithm.
14. Volunteer Matching Algorithm.
15. Function Reference Table.
16. Installation Instructions.
17. Screenshot Gallery.
18. Test Cases and Actual Results.
19. AI-Assisted Development and Critical Evaluation.
20. Limitations.
21. Future Enhancements.

For the JavaScript function reference, include:
- Exact source filename.
- Actual function/class name.
- Purpose.
- Relevant source section or current line number.

Remove claims about unused methods and unavailable controls.

Verify all line numbers against the final script.js.

## G. Complete AI evaluation documentation

Keep one consolidated AI evaluation document.

Include:
- Initial Antigravity prompt brief, clearly identified as a brief if the exact transcript is unavailable.
- Original AI-generated implementation summary.
- Independent review findings.
- Correction prompts and their provenance.
- Implemented corrections.
- Final visual defects and fixes.
- Accepted recommendations.
- Rejected recommendations.
- Justification for final technical decisions.
- Actual test results.
- Remaining limitations.

Do not invent AI responses or prompt logs.

## H. Final project verification

Verify:
- JavaScript syntax.
- HTML structure.
- CSS structure.
- No duplicate HTML IDs.
- No missing local asset references.
- All mandatory JavaScript concepts.
- All CRUD operations.
- All five Integrity Sentinel checks.
- Volunteer matching.
- Asynchronous operations.
- Error handling.
- Both themes.
- Responsive layouts.
- Screenshot accuracy.
- Project documentation accuracy.

Provide a final report identifying all tests executed, their actual results and remaining limitations.

Do not declare the project ready until the source code, screenshots and documentation agree.
```

### C.3 Final submission accuracy and verification

**Prompt provenance:** ChatGPT-authored correction prompt supplied for Antigravity.

```text
# GiveTrack Lab 3 – Final Submission Accuracy and Verification

Perform final corrections to the existing application. Do not rebuild it.

The objective is to ensure the actual source code, user interface, project README, technical documentation, test suite and screenshots accurately represent the same working application.

## 1. Correct all unsupported claims

Inspect index.html, script.js, README.md, docs/data-model.md and screenshots.

Remove unsupported claims such as:
- Audited Public Non-Profit.
- Audited supplier invoices.
- Independently audited expenditure.
- Actual bank escrow.
- Formal audit certification.
- Official statutory verification.

Replace these with accurate academic demonstration terminology.

Keep the financial reconciliation functionality. Do not remove the Integrity Sentinel.

State clearly that the application is a client-side educational prototype using illustrative data, without real payment processing or bank integration.

## 2. Correct visual text visibility

Inspect the actual screenshots and the live browser.

The dashboard hero description is too dark against the dark teal background.

Ensure the selected theme controls the foreground and background of every text element, including:
- Hero subtitle.
- Campaign descriptions.
- Dashboard metrics.
- Tables.
- Footer.
- Modal forms.
- Toolbar.
- Mobile interface.

Test light and dark modes at desktop and mobile sizes.

Do not claim full WCAG compliance based only on selected table elements.

## 3. Correct automated tests

Repair the weak test assertions.

- TC-22: Execute a genuine failed application operation and click its actual retry button.
- TC-23: Verify that the retry callback successfully completes and persists the original operation.
- TC-24: Reload the page and verify persisted data.
- TC-28: Test complete donation AND expense CRUD, including verifying updated values.
- TC-29: Test complete volunteer AND opportunity CRUD, including verifying updated values.
- TC-30: Submit genuinely invalid forms and verify rejection and error feedback.
- TC-31: Interact with the actual search and filter controls and verify the rendered records.
- TC-33: Inspect both text content and CSS pseudo-element content to ensure each status indicator has exactly one icon.

Retain the valid Sentinel tests TC-19 and TC-20.

Do not mark an assertion as passed if it only checks whether a function exists.

## 4. Correct documentation

Make the project README a final-state project document.

It must explain:
- Problem statement.
- Problem analysis.
- Target users.
- Information managed.
- Data relationships.
- Objects.
- Arrays.
- Sets.
- Maps.
- Array methods.
- Event handling.
- DOM manipulation.
- Asynchronous programming.
- Error handling.
- CRUD functions.
- Integrity Sentinel.
- Volunteer matching.
- Exact source function names.
- Installation and execution.
- Screenshots.
- Actual test results.
- Limitations.

Correct all entity status values and function names against script.js.

Do not describe a derived donor relationship as an independently stored database table.

Clarify that every asynchronous operation uses simulated localStorage persistence, not a real backend.

The project README must describe the finished application without references such as "changed from the previous version" or "fixed since last submission."

## 5. Complete AI evaluation

Preserve the actual development prompt history and independent review findings.

Do not fabricate second AI tool responses.

Clearly distinguish:
- Original development prompt.
- AI-generated suggestions.
- Independent technical findings.
- Accepted recommendations.
- Rejected recommendations.
- Implemented decisions.
- Actual test evidence.

## 6. Final screenshots

Regenerate the affected screenshots from the running application.

Include:
- Clean dashboard with academic demonstration wording.
- Light-mode dashboard.
- Dark-mode dashboard.
- Mobile dashboard with readable text.
- Light-mode donation ledger.
- Dark-mode donation ledger.
- Financial reconciliation table.
- Genuine asynchronous failure and retry.
- Donation modal with today's date.

Restore seed data and clear test notifications before capture.

## 7. Final verification

Run:
- JavaScript syntax validation.
- HTML validation.
- CSS inspection.
- Duplicate ID detection.
- Missing asset detection.
- Complete CRUD testing.
- Sentinel tests.
- Volunteer matching tests.
- Actual asynchronous failure and retry tests.
- localStorage reload testing.
- Light/dark theme inspection.
- Responsive layout inspection.

Report only tests that actually ran and passed.

Keep the project README accurate, concise enough to navigate, and detailed enough for the examiner to locate every JavaScript concept in the source.
```

### C.4 Prompt provenance note

The three correction prompts above are ChatGPT-authored prompts from the project conversation. Appendix C.2 uses the project-documentation wording requested for the final audit; it is not presented as an untouched transcript of the earlier title wording. The initial Antigravity generation prompt remains a brief because the complete verbatim prompt is not available in the current record.

The prompts in this appendix must be attributed to ChatGPT as independent review instructions, not to Antigravity. Antigravity is the development assistant that received the instructions and generated or modified the project files.
