# GiveTrack — JavaScript Concepts & Architectural Implementation Guide (Lab 3)

**Application:** GiveTrack  
**Domain:** NGO Donation Transparency & Volunteer Skill Matching Platform  
**File:** `script.js` (100% Vanilla ES6+, Zero External Dependencies, Zero Frameworks)  

---

## 1. Executive Concept Mapping Matrix

| JavaScript Concept | Implementation Location in `script.js` | Purpose & Concrete Technical Application |
| :--- | :--- | :--- |
| **Object Models & Factories** | Lines 30–120 (`createCampaign`, `createDonation`, `createExpense`, `createVolunteer`, `createOpportunity`, `createApplication`) | Coerces types, trims inputs, provides immutable defaults, and validates status enumerations across all 5 core entities. |
| **Array Methods: `map`** | Lines 575–620, 1310–1450 (`Analytics`, `DOMRenderer`) | Transforms raw data arrays into financial metrics, chart slice coordinate arrays, and dynamic HTML template strings. |
| **Array Methods: `filter`** | Lines 580–615, 1340–1620 (`DOMRenderer`) | Multi-criteria client-side search, category filtering, date-range filtering, and status filtering across all views. |
| **Array Methods: `reduce`** | Lines 580–625 (`calculateGlobalFinancials`, `getCampaignFinancials`) | Sums total backer donations, total verified disbursements, category allocations, and derives remaining balances. |
| **Array Methods: `find` / `findIndex`** | Lines 395, 422, 450, 478, 502, 2040–2060 (`StorageService`, `CRUDHandlers`) | O(n) lookup of campaign records, volunteer profiles, and index positioning for in-place entity mutation. |
| **Array Methods: `some` / `every`** | Lines 725–760, 2615–2625 (`promptDeleteCampaign`, `IntegritySentinel`) | Validates safe deletion constraints (e.g. `hasTransactions = donations.some(d => d.campaignId === id)` prevents deleting funded initiatives). |
| **Array Methods: `sort`** | Lines 1350–1370, 1480–1500 (`DOMRenderer.renderCampaigns`) | Dynamic multi-field sorting by progress %, target amount, date, or alphabetical name. |
| **Array Methods: `forEach`** | Lines 665–705 (`AppState.rebuildIndices`) | Efficient single-pass traversal to populate active `Set` and `Map` indexing data structures upon state synchronization. |
| **Set: `add`, `has`, `delete`** | Lines 670–700, 725–752 (`rebuildIndices`, `deleteDonationFromState`, `deleteApplicationFromState`) | Active uniqueness enforcement for transaction references, donor tracking, and composite enrollment keys with explicit `Set.prototype.delete()`. |
| **Set: Iteration** | Lines 690–705, 1275–1290 (`uniqueVolunteerSkills`, `populateDynamicFilters`) | Iterating unique skill catalogs via `Array.from(set)` to populate dynamic search filters without duplicates. |
| **Map: `set`, `get`, `has`** | Lines 675–695, 938–982 (`campaignDonationMap`, `campaignExpenseMap`, `campaignBalanceMap`) | O(1) balance lookups for instant deficit protection during expense logging, plus sentinel status verification via `Map.prototype.has()`. |
| **Map: `entries` / `delete`** | Lines 712–722, 1175–1215 (`deleteCampaignFromState`, `ChartEngine.renderCategoryAllocation`) | Safe campaign map unlinking via `Map.prototype.delete()` and key-value pair iteration over spending categories via `Map.prototype.entries()`. |
| **DOM Manipulation** | Lines 1250–1900 (`DOMRenderer`) | Safe DOM element rendering with template literals, escaped text nodes (`escapeHTML`), attribute binding, and responsive SVG vector construction. |
| **Event Handling & Delegation** | Lines 3015–3060, 3215–3265 (`AppEvents.bindDelegatedListeners`) | Centralized event delegation listening on root containers (`.main-navigation`, data tables) to dispatch actions without per-row listener thrashing. |
| **Asynchronous Promises & `async/await`** | Lines 275–530 (`StorageService`) | Asynchronous persistence layer wrapping browser storage operations in native ES6 `Promise`s with simulated network delay. |
| **Simulated Failure & Retry Action** | Lines 295–310, 2305–2355 (`StorageService.forceFailure`, `ToastNotification`) | Controlled network disruption simulation (HTTP 503) with non-blocking toast notifications and executable one-click operation retry closures. |
| **Defensive Error Handling** | Lines 2000–2250 (`CRUDHandlers`) | `try...catch...finally` blocks with input validation, graceful exception containment, UI loading state teardown, and informative toasts. |
| **`localStorage` Persistence** | Lines 285–350 (`StorageService._read`, `StorageService._write`) | Robust client-side persistence with automatic fallback to baseline `SEED_DATA` and instant demo data restoration. |

---

## 2. In-Depth Technical Walkthroughs

### 2.1. Object Factory Models
Instead of fragile free-form literals, all entities are created via explicit factory functions ensuring data type coercion, string trimming, and default fallback states:
```javascript
function createExpense({ id, campaignId, title, category, amount, date, description = '', receiptRef = '', recordedBy = 'Field Coordinator', status = 'verified' }) {
  return {
    id: String(id).trim(),
    campaignId: String(campaignId).trim(),
    title: String(title).trim(),
    category: String(category).trim(),
    amount: Number(amount) || 0,
    date: String(date),
    description: String(description).trim(),
    receiptRef: String(receiptRef).trim(),
    recordedBy: String(recordedBy).trim(),
    status: ['verified', 'pending', 'rejected'].includes(status) ? status : 'verified'
  };
}
```

---

### 2.2. Functional Array Methods (`reduce`, `filter`, `some`, `every`)
In `script.js` (Module 4, `Analytics`), global and campaign-level balances are derived dynamically using pure functional array compositions:
```javascript
// Calculate Global Financial Summary
calculateGlobalFinancials(donations, expenses) {
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  
  const totalVerifiedExpenses = expenses
    .filter(e => e.status === 'verified')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPendingExpenses = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const remainingFunds = totalDonations - totalVerifiedExpenses;
  const utilisationRatio = totalDonations > 0 ? (totalVerifiedExpenses / totalDonations) * 100 : 0;

  return { totalDonations, totalVerifiedExpenses, totalPendingExpenses, remainingFunds, utilisationRatio };
}
```

---

### 2.3. Active State Management with `Set` and `Map`
GiveTrack maintains in-memory `Set` and `Map` data structures that are updated upon every state reload:
```javascript
// In AppState.rebuildIndices():
this.uniqueTxRefs.clear();
this.uniqueDonorIds.clear();
this.uniqueVolunteerSkills.clear();
this.volunteerApplicationKeys.clear();

// 1. Enforce unique banking transaction reference codes via Set
this.donations.forEach(d => {
  this.uniqueTxRefs.add(d.transactionRef.toUpperCase());
  this.uniqueDonorIds.add(d.donorId);
});

// 2. Prevent duplicate volunteer applications via Set
this.applications.forEach(a => {
  this.volunteerApplicationKeys.add(`${a.volunteerId}_${a.opportunityId}`);
});

// 3. Fast O(1) Campaign Balances via Map
this.campaigns.forEach(c => {
  const raised = this.campaignDonationMap.get(c.id) || 0;
  const spent = this.campaignExpenseMap.get(c.id) || 0;
  this.campaignBalanceMap.set(c.id, raised - spent);
});
```

#### Safe Entity Removal via `Set.prototype.delete()` and `Map.prototype.delete()`
When records are deleted, the application cleans up associated in-memory indices immediately:
```javascript
// Safe removal helper using Map.prototype.delete()
deleteCampaignFromState(campaignId) {
  this.campaigns = this.campaigns.filter(c => c.id !== campaignId);
  this.campaignDonationMap.delete(campaignId);
  this.campaignExpenseMap.delete(campaignId);
  this.campaignBalanceMap.delete(campaignId);
}

// Safe removal helper using Set.prototype.delete()
deleteDonationFromState(donationId) {
  const donation = this.donations.find(d => d.id === donationId);
  if (donation && donation.transactionRef) {
    this.uniqueTxRefs.delete(donation.transactionRef.toUpperCase());
  }
  this.donations = this.donations.filter(d => d.id !== donationId);
}
```

---

### 2.4. Rule-Based Intelligent Volunteer Skill Matching Formula
Skill matching is calculated deterministically with zero non-deterministic or fabricated claims:
$$\text{Match Percentage} = \text{round}\left( \frac{|\text{Volunteer Skills} \cap \text{Required Skills}|}{|\text{Required Skills}|} \times 100 \right)$$

When an opportunity requires zero prerequisite skills, the algorithm does not award an unearned 100% score; it explicitly flags the opportunity as an open shift:
```javascript
calculateMatch(volunteerSkills = [], requiredSkills = []) {
  // If opportunity has no required skills, do NOT award an automatic 100% match
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      score: 0,
      percentage: 0,
      matchedSkills: [],
      missingSkills: [],
      grade: 'Open Shift (No Specific Prerequisites)',
      level: 'open',
      isNA: true
    };
  }

  const normVolunteerSkills = new Set(volunteerSkills.map(s => String(s).toLowerCase().trim()));
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(req => {
    const cleanReq = String(req).trim();
    if (normVolunteerSkills.has(cleanReq.toLowerCase())) {
      matchedSkills.push(cleanReq);
    } else {
      missingSkills.push(cleanReq);
    }
  });

  const score = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  let grade = score >= 75 ? 'High Match' : (score >= 40 ? 'Moderate Match' : 'Low Match');
  let level = score >= 75 ? 'high' : (score >= 40 ? 'medium' : 'low');

  return { score, percentage: score, matchedSkills, missingSkills, grade, level, isNA: false };
}
```

---

### 2.5. GiveTrack Integrity Sentinel (Automated Anomaly Engine)
Integrity Sentinel continuously inspects all ledger records across 5 distinct audit dimensions:
1. **Duplicate Transaction References:** Detects when two donations share identical gateway reference strings.
2. **Missing Receipt References:** Detects disbursements logged without an official vendor bill/invoice code.
3. **Overdrawn Campaign Balances:** Detects campaigns where verified disbursements exceed raised funds.
4. **Independent Sum Reconciliation:** Avoids tautological arithmetic ($balance = raised - spent$) by independently computing raw transaction summations directly from the underlying donation and expense arrays and cross-referencing against indexed map values and campaign reserve balances.
5. **Statistical Category Outliers:** Excludes the tested transaction from its comparison category average to prevent self-distortion, flagging disbursements exceeding $2.5\times$ the historical category average for administrative review without prematurely accusing coordinators of fraud.

---

### 2.6. Asynchronous Service Layer & Controlled Network Simulation
`StorageService` wraps all operations in native ES6 `Promise`s with simulated network delay (250ms). When the "Network Error" toggle is activated, operations reject with controlled errors that display on toast notifications with a built-in one-click **Retry** button:
```javascript
async _guardOperation(operationName) {
  await this._simulateLatency();
  if (this.forceFailure) {
    throw new Error(`[Simulated Failure: HTTP 503 Service Unavailable] Connection to GiveTrack central ledger failed during "${operationName}".`);
  }
}
```
If an error occurs, `ToastNotification.show({ type: 'error', title, message, onRetry })` attaches the operation's execution closure to a Retry button, allowing seamless recovery without page reloads.
