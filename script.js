/**
 * ==============================================================================
 * GiveTrack — Comprehensive JavaScript Application Logic (Lab 3)
 * Tagline: Every Contribution. Accounted For.
 * Domain: NGO Donation Transparency, Expense Verification & Volunteer Matching
 * Architecture: Clean Vanilla ES6+ (Separated script.js, style.css, index.html)
 * ==============================================================================
 * 
 * TABLE OF MODULES:
 * 1. Data Models & Initial Seed Data
 * 2. Storage Service & Asynchronous Layer (Promises, async/await, latency, simulated errors)
 * 3. State Management (Active Sets, Maps, In-Memory Collections)
 * 4. Calculations, Financial Reconciliation & Analytics (map, filter, reduce, sort, every, some)
 * 5. GiveTrack Integrity Sentinel (Automated Financial Anomaly Detection Engine)
 * 6. Intelligent Volunteer Skill Matching Algorithm
 * 7. Interactive SVG Chart Engine (Donations vs Expenses & Allocation Doughnut)
 * 8. DOM Rendering & View Controllers (Dashboard, Campaigns, Donations, Expenses, Volunteers, Sentinel, Reports)
 * 9. Form Validation & Full CRUD Handlers (Campaign, Donation, Expense, Volunteer, Opportunity)
 * 10. Modals, Toasts & UI Notifications
 * 11. Event Delegation & Listener Binding
 * 12. Application Bootstrap & Initialization
 */

'use strict';

// ==============================================================================
// 1. DATA MODELS & INITIAL SEED DATA
// ==============================================================================

/**
 * Factory functions for structured, typed application entities
 */
function createCampaign({ id, name, description, category, target, startDate, endDate, status = 'active' }) {
  return {
    id: String(id).trim(),
    name: String(name).trim(),
    description: String(description).trim(),
    category: String(category).trim(),
    target: Number(target) || 0,
    startDate: String(startDate),
    endDate: String(endDate),
    status: ['active', 'completed', 'paused'].includes(status) ? status : 'active'
  };
}

function createDonation({ id, donorId, donorName, campaignId, amount, date, paymentMethod, transactionRef }) {
  return {
    id: String(id).trim(),
    donorId: String(donorId).trim(),
    donorName: String(donorName).trim(),
    campaignId: String(campaignId).trim(),
    amount: Number(amount) || 0,
    date: String(date),
    paymentMethod: String(paymentMethod).trim(),
    transactionRef: String(transactionRef).trim().toUpperCase()
  };
}

function createExpense({ id, campaignId, title, category, amount, date, description = '', receiptRef = '', recordedBy = 'Field Coordinator', status = 'verified' }) {
  return {
    id: String(id).trim(),
    campaignId: String(campaignId).trim(),
    title: String(title).trim(),
    category: String(category).trim(),
    amount: Number(amount) || 0,
    date: String(date),
    description: String(description).trim(),
    receiptRef: String(receiptRef || '').trim(),
    recordedBy: String(recordedBy || 'Field Coordinator').trim(),
    status: ['verified', 'pending', 'rejected'].includes(status) ? status : 'verified'
  };
}

function createVolunteer({ id, name, email, phone, skills = [], availability, registrationDate, status = 'active' }) {
  return {
    id: String(id).trim(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    skills: Array.isArray(skills) ? skills.map(s => String(s).trim()).filter(Boolean) : [],
    availability: String(availability).trim(),
    registrationDate: String(registrationDate || new Date().toISOString().split('T')[0]),
    status: ['active', 'pending', 'inactive'].includes(status) ? status : 'active'
  };
}

function createOpportunity({ id, campaignId, title, description, requiredSkills = [], requiredVolunteers, location, shiftDate, shiftTiming, status = 'open' }) {
  return {
    id: String(id).trim(),
    campaignId: campaignId ? String(campaignId).trim() : 'CMP-CFSP-01',
    title: String(title).trim(),
    description: String(description).trim(),
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills.map(s => String(s).trim()).filter(Boolean) : [],
    requiredVolunteers: Number(requiredVolunteers) || 1,
    location: String(location).trim(),
    shiftDate: String(shiftDate),
    shiftTiming: String(shiftTiming).trim(),
    status: ['open', 'filled', 'completed'].includes(status) ? status : 'open'
  };
}

function createApplication({ id, volunteerId, opportunityId, appliedDate, status = 'approved' }) {
  return {
    id: String(id).trim(),
    volunteerId: String(volunteerId).trim(),
    opportunityId: String(opportunityId).trim(),
    appliedDate: String(appliedDate || new Date().toISOString().split('T')[0]),
    status: ['pending', 'approved', 'rejected'].includes(status) ? status : 'approved'
  };
}

/**
 * Initial Seed Dataset — preserves continuity with previous Lab 1 & Lab 2 values
 * Flagship Community Food Support Programme (CFSP): ₹1,20,000 raised, ₹85,000 spent, ₹35,000 remaining
 */
const SEED_DATA = {
  campaigns: [
    createCampaign({
      id: 'CMP-CFSP-01',
      name: 'Community Food Support Programme (Bengaluru Hub)',
      description: 'Providing 320 monthly nutrition kits, fortified grains, and warm meals for underserved urban families in Bengaluru with audited voucher accounting.',
      category: 'Food & Nutrition',
      target: 150000,
      startDate: '2026-10-01',
      endDate: '2026-12-31',
      status: 'active'
    }),
    createCampaign({
      id: 'CMP-EDU-02',
      name: 'Every Child in School',
      description: 'Providing comprehensive learning kits, STEM textbooks, and classroom supplies for primary students in underserved urban government schools.',
      category: 'Education',
      target: 100000,
      startDate: '2026-09-15',
      endDate: '2026-12-15',
      status: 'active'
    }),
    createCampaign({
      id: 'CMP-HLTH-03',
      name: 'Healthy Neighbourhood Primary Clinic',
      description: 'Mobile basic diagnostic health camps, maternal care kits, and essential medicines for 450 families in urban informal settlements.',
      category: 'Healthcare',
      target: 80000,
      startDate: '2026-08-01',
      endDate: '2026-11-30',
      status: 'active'
    }),
    createCampaign({
      id: 'CMP-ENV-04',
      name: 'Green Streets Urban Plantation',
      description: 'Planting 1,000 indigenous shade trees and establishing community rainwater harvesting pits across North Bengaluru wards.',
      category: 'Environment',
      target: 60000,
      startDate: '2026-07-01',
      endDate: '2026-10-31',
      status: 'completed'
    })
  ],
  donations: [
    // CFSP Donations (Total = ₹1,20,000)
    createDonation({ id: 'DON-2026-001', donorId: 'DNR-101', donorName: 'Aarav Sharma', campaignId: 'CMP-CFSP-01', amount: 40000, date: '2026-10-05', paymentMethod: 'UPI Transfer (Demo)', transactionRef: 'TXN-UPI-881920' }),
    createDonation({ id: 'DON-2026-002', donorId: 'DNR-102', donorName: 'Priya Sundaram', campaignId: 'CMP-CFSP-01', amount: 25000, date: '2026-10-12', paymentMethod: 'Net Banking (Demo)', transactionRef: 'TXN-NET-449102' }),
    createDonation({ id: 'DON-2026-003', donorId: 'DNR-103', donorName: 'TechVentures Social Fund', campaignId: 'CMP-CFSP-01', amount: 30000, date: '2026-10-20', paymentMethod: 'Corporate Wire (Demo)', transactionRef: 'TXN-COR-991204' }),
    createDonation({ id: 'DON-2026-004', donorId: 'DNR-104', donorName: 'Rohan & Sneha Gupta', campaignId: 'CMP-CFSP-01', amount: 15000, date: '2026-10-28', paymentMethod: 'UPI Transfer (Demo)', transactionRef: 'TXN-UPI-771239' }),
    createDonation({ id: 'DON-2026-005', donorId: 'DNR-105', donorName: 'Kavita Ramachandran', campaignId: 'CMP-CFSP-01', amount: 10000, date: '2026-11-02', paymentMethod: 'Debit Card (Demo)', transactionRef: 'TXN-DC-330192' }),
    // EDU Donations (Total = ₹68,000)
    createDonation({ id: 'DON-2026-006', donorId: 'DNR-106', donorName: 'Aditya Mehta', campaignId: 'CMP-EDU-02', amount: 35000, date: '2026-09-20', paymentMethod: 'UPI Transfer (Demo)', transactionRef: 'TXN-UPI-119284' }),
    createDonation({ id: 'DON-2026-007', donorId: 'DNR-107', donorName: 'Meera Iyer', campaignId: 'CMP-EDU-02', amount: 33000, date: '2026-10-04', paymentMethod: 'Net Banking (Demo)', transactionRef: 'TXN-NET-559102' }),
    // HLTH Donations (Total = ₹52,000)
    createDonation({ id: 'DON-2026-008', donorId: 'DNR-108', donorName: 'Sunita Menon', campaignId: 'CMP-HLTH-03', amount: 32000, date: '2026-08-10', paymentMethod: 'UPI Transfer (Demo)', transactionRef: 'TXN-UPI-661902' }),
    createDonation({ id: 'DON-2026-009', donorId: 'DNR-109', donorName: 'Rajesh Iyer', campaignId: 'CMP-HLTH-03', amount: 20000, date: '2026-09-01', paymentMethod: 'Debit Card (Demo)', transactionRef: 'TXN-DC-881293' }),
    // ENV Donations (Total = ₹35,000)
    createDonation({ id: 'DON-2026-010', donorId: 'DNR-110', donorName: 'Deepa Narayan', campaignId: 'CMP-ENV-04', amount: 35000, date: '2026-07-15', paymentMethod: 'UPI Transfer (Demo)', transactionRef: 'TXN-UPI-228193' })
  ],
  expenses: [
    // CFSP Expenses (Verified Total = ₹85,000)
    createExpense({ id: 'EXP-CFSP-01', campaignId: 'CMP-CFSP-01', title: 'Bulk Fortified Rice & Lentils (3,000 kg)', category: 'Grains & Pulses', amount: 40000, date: '2026-11-02', description: 'Bulk purchase of certified fortified grains for nutrition kit assembly.', receiptRef: 'INV-BLR-8841', recordedBy: 'Logistics Hub Lead', status: 'verified' }),
    createExpense({ id: 'EXP-CFSP-02', campaignId: 'CMP-CFSP-01', title: 'Fresh Seasonal Vegetables & Cooking Oil', category: 'Produce', amount: 25000, date: '2026-11-03', description: 'Wholesale APMC mandi procurement of fresh seasonal vegetables and cooking oil.', receiptRef: 'INV-MKT-1092', recordedBy: 'Field Procurement Officer', status: 'verified' }),
    createExpense({ id: 'EXP-CFSP-03', campaignId: 'CMP-CFSP-01', title: 'Biodegradable Packaging & Ration Bags', category: 'Packaging', amount: 15000, date: '2026-11-04', description: 'Eco-friendly compostable bags and packing materials for 320 dry ration packs.', receiptRef: 'INV-ECO-3390', recordedBy: 'Packing Coordinator', status: 'verified' }),
    createExpense({ id: 'EXP-CFSP-04', campaignId: 'CMP-CFSP-01', title: 'Distribution Van Fuel & Driver Allowance', category: 'Logistics', amount: 5000, date: '2026-11-05', description: 'Fuel and transport charges for direct doorstep handover to 320 recipient households.', receiptRef: 'INV-LOG-4412', recordedBy: 'Logistics Lead', status: 'verified' }),
    // Pending voucher: Demonstrates Missing Receipt & Sentinel warning
    createExpense({ id: 'EXP-CFSP-05', campaignId: 'CMP-CFSP-01', title: 'Logistics Hub Sanitation & Pest Barrier', category: 'Maintenance', amount: 8500, date: '2026-11-08', description: 'Warehouse sanitation and pest protection treatment; held in pending reserve awaiting receipt verification.', receiptRef: '', recordedBy: 'Operations Assistant', status: 'pending' }),
    createExpense({ id: 'EXP-CFSP-06', campaignId: 'CMP-CFSP-01', title: 'Unapproved Private Taxi Conveyance', category: 'Travel', amount: 3200, date: '2026-11-09', description: 'Unapproved personal conveyance; disallowed under standard NGO procurement guidelines.', receiptRef: 'TAX-DIS-1102', recordedBy: 'Field Volunteer', status: 'rejected' }),
    // EDU Expenses (Total = ₹45,000)
    createExpense({ id: 'EXP-EDU-01', campaignId: 'CMP-EDU-02', title: 'STEM Textbooks & Workbooks (500 sets)', category: 'Educational Material', amount: 30000, date: '2026-09-28', description: 'Bilingual science and math workbooks for primary learners.', receiptRef: 'INV-EDU-5512', recordedBy: 'Education Coordinator', status: 'verified' }),
    createExpense({ id: 'EXP-EDU-02', campaignId: 'CMP-EDU-02', title: 'Classroom Whiteboards & School Kits', category: 'Educational Material', amount: 15000, date: '2026-10-15', description: 'Interactive magnetic boards and stationery packs.', receiptRef: 'INV-EDU-6623', recordedBy: 'Education Coordinator', status: 'verified' }),
    // HLTH Expenses (Total = ₹38,000)
    createExpense({ id: 'EXP-HLTH-01', campaignId: 'CMP-HLTH-03', title: 'Essential Medicines & Antibiotics Batch', category: 'Medical Supplies', amount: 26000, date: '2026-08-22', description: 'Prescription generic drugs from Jan Aushadhi Kendra.', receiptRef: 'INV-MED-7719', recordedBy: 'Clinic Doctor', status: 'verified' }),
    createExpense({ id: 'EXP-HLTH-02', campaignId: 'CMP-HLTH-03', title: 'Diagnostic Glucometers & BP Monitors', category: 'Medical Supplies', amount: 12000, date: '2026-09-10', description: 'Portable digital diagnostic apparatus for triage desks.', receiptRef: 'INV-MED-8831', recordedBy: 'Lead Nurse', status: 'verified' }),
    // ENV Expenses (Total = ₹20,000)
    createExpense({ id: 'EXP-ENV-01', campaignId: 'CMP-ENV-04', title: 'Indigenous Saplings & Organic Compost', category: 'Horticulture', amount: 20000, date: '2026-07-28', description: '1,000 neem, peepal, and fruit saplings with natural fertilizer.', receiptRef: 'INV-SAP-1011', recordedBy: 'Environment Lead', status: 'verified' })
  ],
  volunteers: [
    createVolunteer({ id: 'VOL-001', name: 'Ananya Deshmukh', email: 'ananya.d@example.org', phone: '+91 98765 43210', skills: ['Ration Assembly', 'Inventory Tracking', 'Food Handling', 'First Aid'], availability: 'Weekends', registrationDate: '2026-09-01', status: 'active' }),
    createVolunteer({ id: 'VOL-002', name: 'Karthik Ramanathan', email: 'karthik.r@example.org', phone: '+91 98450 12345', skills: ['Mathematics Tutoring', 'STEM Teaching', 'Curriculum Design'], availability: 'Saturday Afternoon', registrationDate: '2026-09-10', status: 'active' }),
    createVolunteer({ id: 'VOL-003', name: 'Dr. Shalini Varma', email: 'dr.shalini@example.org', phone: '+91 97312 88901', skills: ['Medical Triage', 'First Aid', 'Patient Counseling', 'Health Screening'], availability: 'Sunday Morning', registrationDate: '2026-08-15', status: 'active' }),
    createVolunteer({ id: 'VOL-004', name: 'Tanvi Kulkarni', email: 'tanvi.k@example.org', phone: '+91 94481 65432', skills: ['Tree Planting', 'Gardening', 'Logistics', 'Community Outreach'], availability: 'Weekday Mornings', registrationDate: '2026-07-20', status: 'active' }),
    createVolunteer({ id: 'VOL-005', name: 'Arjun Patel', email: 'arjun.p@example.org', phone: '+91 99001 22334', skills: ['Digital Storytelling', 'Photography', 'Social Media', 'Video Editing'], availability: 'Flexible', registrationDate: '2026-10-05', status: 'pending' })
  ],
  opportunities: [
    createOpportunity({
      id: 'OPP-001',
      campaignId: 'CMP-CFSP-01',
      title: 'Ration Kit Assembly & Quality Check',
      description: 'Physical packing of dry ration kits, grain weighing, batch inspection, and carton loading for distribution.',
      requiredSkills: ['Ration Assembly', 'Food Handling', 'Inventory Tracking'],
      requiredVolunteers: 15,
      location: 'Bengaluru Central Logistics Hub, Yeshwanthpur',
      shiftDate: '2026-11-21',
      shiftTiming: '08:30–12:30',
      status: 'open'
    }),
    createOpportunity({
      id: 'OPP-002',
      campaignId: 'CMP-EDU-02',
      title: 'Remedial Mathematics & Reading Tutor',
      description: 'Conducting small-group learning sessions for primary school students in foundational literacy and numeracy.',
      requiredSkills: ['Mathematics Tutoring', 'STEM Teaching'],
      requiredVolunteers: 8,
      location: 'Community Study Centre, Shivaji Nagar',
      shiftDate: '2026-11-21',
      shiftTiming: '14:00–17:30',
      status: 'open'
    }),
    createOpportunity({
      id: 'OPP-003',
      campaignId: 'CMP-HLTH-03',
      title: 'Primary Health Camp Triage Assistant',
      description: 'Assisting medical officers with patient registration, crowd coordination, temperature recording, and medicine distribution.',
      requiredSkills: ['Medical Triage', 'First Aid', 'Patient Counseling'],
      requiredVolunteers: 6,
      location: 'Ward 84 Community Health Hall, Rajajinagar',
      shiftDate: '2026-11-22',
      shiftTiming: '09:00–13:30',
      status: 'open'
    }),
    createOpportunity({
      id: 'OPP-004',
      campaignId: 'CMP-ENV-04',
      title: 'General River Greenway Clean-up',
      description: 'Community environmental clearing and sapling maintenance open to all public participants without technical prerequisites.',
      requiredSkills: [], // Intentionally empty to test Not-Applicable / Open Shift logic
      requiredVolunteers: 20,
      location: 'Vrishabhavathi River Basin Greenway, Kengeri',
      shiftDate: '2026-11-22',
      shiftTiming: '06:30–10:30',
      status: 'open'
    })
  ],
  applications: [
    createApplication({ id: 'APP-001', volunteerId: 'VOL-001', opportunityId: 'OPP-001', appliedDate: '2026-11-10', status: 'approved' })
  ]
};

// ==============================================================================
// 2. STORAGE SERVICE & ASYNCHRONOUS LAYER (Promises, async/await, latency, simulated errors)
// ==============================================================================

const STORAGE_KEYS = {
  CAMPAIGNS: 'givetrack_campaigns_v3',
  DONATIONS: 'givetrack_donations_v3',
  EXPENSES: 'givetrack_expenses_v3',
  VOLUNTEERS: 'givetrack_volunteers_v3',
  OPPORTUNITIES: 'givetrack_opportunities_v3',
  APPLICATIONS: 'givetrack_applications_v3'
};

/**
 * StorageService wraps localStorage access in native Promises with simulated network latency
 * and controlled failure mechanisms for laboratory demonstration.
 */
class StorageService {
  constructor() {
    this.latencyMs = 250;      // Simulated roundtrip delay in milliseconds
    this.forceFailure = false; // Controlled failure flag for test demonstration
    this.failureCount = 0;
  }

  setSimulatedLatency(ms) {
    this.latencyMs = Number(ms) || 0;
  }

  setForceFailure(flag) {
    this.forceFailure = Boolean(flag);
  }

  // Internal asynchronous guard simulating network latency and controlled failure
  async _guardOperation(opName = 'Storage Operation') {
    if (this.latencyMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.latencyMs));
    }
    if (this.forceFailure) {
      this.failureCount++;
      // Auto-turn off after one failure so the immediate retry succeeds
      this.forceFailure = false;
      const btn = document.getElementById('btn-toggle-failure');
      if (btn) {
        btn.textContent = '⚡ Network Error: OFF';
        btn.classList.remove('active-error-mode');
      }
      throw new Error(`Simulated Network Latency Timeout: Connection to GiveTrack ledger failed during "${opName}".`);
    }
  }

  _read(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (err) {
      console.warn(`[StorageService] Failed to read ${key} from localStorage, returning fallback:`, err);
      return fallback;
    }
  }

  _write(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error(`[StorageService] Storage quota exceeded or write failed for ${key}:`, err);
      throw new Error('Local storage capacity reached. Unable to persist updates.');
    }
  }

  initStorageIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
      this._write(STORAGE_KEYS.CAMPAIGNS, SEED_DATA.campaigns);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      this._write(STORAGE_KEYS.DONATIONS, SEED_DATA.donations);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      this._write(STORAGE_KEYS.EXPENSES, SEED_DATA.expenses);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEERS)) {
      this._write(STORAGE_KEYS.VOLUNTEERS, SEED_DATA.volunteers);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
      this._write(STORAGE_KEYS.OPPORTUNITIES, SEED_DATA.opportunities);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      this._write(STORAGE_KEYS.APPLICATIONS, SEED_DATA.applications);
    }
  }

  async resetAllToSeed() {
    await this._guardOperation('Reset All Data');
    this._write(STORAGE_KEYS.CAMPAIGNS, SEED_DATA.campaigns);
    this._write(STORAGE_KEYS.DONATIONS, SEED_DATA.donations);
    this._write(STORAGE_KEYS.EXPENSES, SEED_DATA.expenses);
    this._write(STORAGE_KEYS.VOLUNTEERS, SEED_DATA.volunteers);
    this._write(STORAGE_KEYS.OPPORTUNITIES, SEED_DATA.opportunities);
    this._write(STORAGE_KEYS.APPLICATIONS, SEED_DATA.applications);
    return true;
  }

  // --- Campaign Async Methods ---
  async getAllCampaigns() {
    await this._guardOperation('Fetch Campaigns');
    return this._read(STORAGE_KEYS.CAMPAIGNS, SEED_DATA.campaigns);
  }

  async saveCampaign(campaignData) {
    await this._guardOperation('Save Campaign');
    const list = this._read(STORAGE_KEYS.CAMPAIGNS);
    const index = list.findIndex(c => c.id === campaignData.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...campaignData };
    } else {
      list.push(campaignData);
    }
    this._write(STORAGE_KEYS.CAMPAIGNS, list);
    return campaignData;
  }

  async deleteCampaign(campaignId) {
    await this._guardOperation('Delete Campaign');
    const list = this._read(STORAGE_KEYS.CAMPAIGNS);
    const updated = list.filter(c => c.id !== campaignId);
    this._write(STORAGE_KEYS.CAMPAIGNS, updated);
    return true;
  }

  // --- Donation Async Methods ---
  async getAllDonations() {
    await this._guardOperation('Fetch Donations');
    return this._read(STORAGE_KEYS.DONATIONS, SEED_DATA.donations);
  }

  async saveDonation(donationData) {
    await this._guardOperation('Save Donation');
    const list = this._read(STORAGE_KEYS.DONATIONS, SEED_DATA.donations);
    const campaigns = this._read(STORAGE_KEYS.CAMPAIGNS, SEED_DATA.campaigns);

    // Normalize transactionRef
    const normRef = (donationData.transactionRef || '').trim().toUpperCase();

    // 1. Duplicate transaction reference check (excluding current record if editing)
    const duplicate = list.find(d => (d.transactionRef || '').trim().toUpperCase() === normRef && d.id !== donationData.id);
    if (duplicate) {
      throw new Error(`Transaction reference "${normRef}" is already registered on donation record ${duplicate.id}. Duplicate references are prohibited.`);
    }

    // 2. Campaign restriction check: prevent donations to completed or inactive campaigns
    const targetCamp = campaigns.find(c => c.id === donationData.campaignId);
    if (targetCamp && targetCamp.status !== 'active') {
      throw new Error(`Campaign "${targetCamp.name}" is currently ${targetCamp.status} and cannot accept donations.`);
    }

    // 3. Maintain donor ID continuity across repeat contributions
    if (!donationData.donorId) {
      const existingDonorDonation = list.find(d => (d.donorName || '').trim().toLowerCase() === (donationData.donorName || '').trim().toLowerCase());
      if (existingDonorDonation && existingDonorDonation.donorId) {
        donationData.donorId = existingDonorDonation.donorId;
      } else {
        const nextNum = list.reduce((max, d) => {
          const match = d.donorId && d.donorId.match(/\d+/);
          return match ? Math.max(max, parseInt(match[0], 10)) : max;
        }, 100);
        donationData.donorId = `DNR-${nextNum + 1}`;
      }
    }

    const index = list.findIndex(d => d.id === donationData.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...donationData };
    } else {
      list.push(donationData);
    }
    this._write(STORAGE_KEYS.DONATIONS, list);
    return donationData;
  }

  async deleteDonation(donationId) {
    await this._guardOperation('Delete Donation');
    const list = this._read(STORAGE_KEYS.DONATIONS);
    const updated = list.filter(d => d.id !== donationId);
    this._write(STORAGE_KEYS.DONATIONS, updated);
    return true;
  }

  // --- Expense Async Methods ---
  async getAllExpenses() {
    await this._guardOperation('Fetch Expenses');
    return this._read(STORAGE_KEYS.EXPENSES, SEED_DATA.expenses);
  }

  async saveExpense(expenseData) {
    await this._guardOperation('Save Expense');
    const list = this._read(STORAGE_KEYS.EXPENSES, SEED_DATA.expenses);
    const donations = this._read(STORAGE_KEYS.DONATIONS, SEED_DATA.donations);
    const existingIndex = list.findIndex(e => e.id === expenseData.id);

    // Calculate available balance for the target campaign
    const targetCampaignId = expenseData.campaignId;
    const totalRaised = donations
      .filter(d => d.campaignId === targetCampaignId)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    // Sum other verified expenses for target campaign
    const otherExpenses = list
      .filter(e => e.campaignId === targetCampaignId && e.id !== expenseData.id && e.status !== 'rejected')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const availableBalance = totalRaised - otherExpenses;
    if (Number(expenseData.amount) > availableBalance) {
      throw new Error(`Disbursement amount of ₹${expenseData.amount} exceeds available funds (₹${availableBalance}) for campaign ${targetCampaignId}.`);
    }

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...expenseData };
    } else {
      list.push(expenseData);
    }
    this._write(STORAGE_KEYS.EXPENSES, list);
    return expenseData;
  }

  async deleteExpense(expenseId) {
    await this._guardOperation('Delete Expense');
    const list = this._read(STORAGE_KEYS.EXPENSES);
    const updated = list.filter(e => e.id !== expenseId);
    this._write(STORAGE_KEYS.EXPENSES, updated);
    return true;
  }

  // --- Volunteer Async Methods ---
  async getAllVolunteers() {
    await this._guardOperation('Fetch Volunteers');
    return this._read(STORAGE_KEYS.VOLUNTEERS, SEED_DATA.volunteers);
  }

  async saveVolunteer(volunteerData) {
    await this._guardOperation('Save Volunteer');
    const list = this._read(STORAGE_KEYS.VOLUNTEERS);
    const index = list.findIndex(v => v.id === volunteerData.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...volunteerData };
    } else {
      list.push(volunteerData);
    }
    this._write(STORAGE_KEYS.VOLUNTEERS, list);
    return volunteerData;
  }

  async deleteVolunteer(volunteerId) {
    await this._guardOperation('Delete Volunteer');
    const list = this._read(STORAGE_KEYS.VOLUNTEERS);
    const updated = list.filter(v => v.id !== volunteerId);
    this._write(STORAGE_KEYS.VOLUNTEERS, updated);
    return true;
  }

  // --- Opportunity & Application Async Methods ---
  async getAllOpportunities() {
    await this._guardOperation('Fetch Opportunities');
    return this._read(STORAGE_KEYS.OPPORTUNITIES, SEED_DATA.opportunities);
  }

  async saveOpportunity(opportunityData) {
    await this._guardOperation('Save Opportunity');
    const list = this._read(STORAGE_KEYS.OPPORTUNITIES);
    const index = list.findIndex(o => o.id === opportunityData.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...opportunityData };
    } else {
      list.push(opportunityData);
    }
    this._write(STORAGE_KEYS.OPPORTUNITIES, list);
    return opportunityData;
  }

  async deleteOpportunity(opportunityId) {
    await this._guardOperation('Delete Opportunity');
    const list = this._read(STORAGE_KEYS.OPPORTUNITIES);
    const updated = list.filter(o => o.id !== opportunityId);
    this._write(STORAGE_KEYS.OPPORTUNITIES, updated);
    return true;
  }

  async getAllApplications() {
    await this._guardOperation('Fetch Applications');
    return this._read(STORAGE_KEYS.APPLICATIONS, SEED_DATA.applications);
  }

  async saveApplication(appData) {
    await this._guardOperation('Save Application');
    const list = this._read(STORAGE_KEYS.APPLICATIONS, SEED_DATA.applications);
    const existing = list.find(a => a.volunteerId === appData.volunteerId && a.opportunityId === appData.opportunityId && a.id !== appData.id);
    if (existing) {
      throw new Error('This volunteer is already enrolled for this shift.');
    }
    const index = list.findIndex(a => a.id === appData.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...appData };
    } else {
      list.push(appData);
    }
    this._write(STORAGE_KEYS.APPLICATIONS, list);
    return appData;
  }

  async deleteApplication(applicationId) {
    await this._guardOperation('Delete Application');
    const list = this._read(STORAGE_KEYS.APPLICATIONS);
    const updated = list.filter(a => a.id !== applicationId);
    this._write(STORAGE_KEYS.APPLICATIONS, updated);
    return true;
  }
}

// Single service instance
const storageService = new StorageService();

// ==============================================================================
// 3. STATE MANAGEMENT (Sets, Maps, In-Memory Collections)
// ==============================================================================

/**
 * AppState holds the reactive in-memory state of the application.
 * Demonstrates active Set and Map data structures reconstructed from storage.
 */
class AppState {
  constructor() {
    // Primary Arrays
    this.campaigns = [];
    this.donations = [];
    this.expenses = [];
    this.volunteers = [];
    this.opportunities = [];
    this.applications = [];
    this.sentinelAlerts = [];

    // Mandatory Sets (Tracking Uniqueness)
    this.uniqueTxRefs = new Set();
    this.uniqueDonorIds = new Set();
    this.uniqueVolunteerSkills = new Set();
    this.volunteerApplicationKeys = new Set(); // volunteerId_opportunityId

    // Mandatory Maps (Supporting Calculations and Lookups)
    this.campaignDonationMap = new Map(); // campaignId => totalDonations
    this.campaignExpenseMap = new Map();  // campaignId => totalVerifiedExpenses
    this.campaignBalanceMap = new Map();  // campaignId => remainingBalance
    this.categorySpendingMap = new Map(); // category => totalAmount
    this.skillFrequencyMap = new Map();   // skillName => volunteerCount

    // UI & Active Selection State
    this.activeView = 'dashboard';
    this.selectedCampaignId = null;
    this.selectedVolunteerId = null;
    this.selectedOpportunityId = null;

    // Filter & Search State
    this.campaignFilter = { search: '', category: 'all', status: 'all', sortBy: 'progress_desc' };
    this.donationFilter = { search: '', campaignId: 'all', dateFrom: '', dateTo: '', sortBy: 'date_desc' };
    this.expenseFilter = { search: '', campaignId: 'all', category: 'all', sortBy: 'date_desc' };
    this.volunteerFilter = { search: '', skill: 'all', status: 'all' };
    this.sentinelFilter = { severity: 'all', category: 'all' };
  }

  /**
   * Synchronises Sets and Maps from the current array collections.
   * Demonstrates Set methods: add(), has(), delete(), iteration.
   * Demonstrates Map methods: set(), get(), has(), delete(), entries().
   */
  rebuildIndices() {
    // Reconstruct Sets
    this.uniqueTxRefs.clear();
    this.uniqueDonorIds.clear();
    this.uniqueVolunteerSkills.clear();
    this.volunteerApplicationKeys.clear();

    // Set demonstration: add() and iteration
    this.donations.forEach(donation => {
      if (donation.transactionRef) {
        this.uniqueTxRefs.add(donation.transactionRef.toUpperCase());
      }
      if (donation.donorId) {
        this.uniqueDonorIds.add(donation.donorId);
      }
    });

    this.volunteers.forEach(volunteer => {
      if (Array.isArray(volunteer.skills)) {
        volunteer.skills.forEach(skill => {
          this.uniqueVolunteerSkills.add(skill.trim());
        });
      }
    });

    this.applications.forEach(app => {
      this.volunteerApplicationKeys.add(`${app.volunteerId}_${app.opportunityId}`);
    });

    // Reconstruct Maps
    this.campaignDonationMap.clear();
    this.campaignExpenseMap.clear();
    this.campaignBalanceMap.clear();
    this.categorySpendingMap.clear();
    this.skillFrequencyMap.clear();

    // Initialise all campaigns in Maps to zero
    this.campaigns.forEach(c => {
      this.campaignDonationMap.set(c.id, 0);
      this.campaignExpenseMap.set(c.id, 0);
      this.campaignBalanceMap.set(c.id, 0);
    });

    // Populate campaign donations map
    this.donations.forEach(d => {
      const current = this.campaignDonationMap.get(d.campaignId) || 0;
      this.campaignDonationMap.set(d.campaignId, current + d.amount);
    });

    // Populate campaign expenses map (counting verified expenses)
    this.expenses.forEach(e => {
      if (e.status === 'verified') {
        const current = this.campaignExpenseMap.get(e.campaignId) || 0;
        this.campaignExpenseMap.set(e.campaignId, current + e.amount);
      }
    });

    // Calculate campaign balances map using Map.prototype.has()
    this.campaigns.forEach(c => {
      const donations = this.campaignDonationMap.has(c.id) ? this.campaignDonationMap.get(c.id) : 0;
      const expenses = this.campaignExpenseMap.has(c.id) ? this.campaignExpenseMap.get(c.id) : 0;
      this.campaignBalanceMap.set(c.id, donations - expenses);
    });

    // Populate category spending map
    this.expenses.forEach(e => {
      if (e.status === 'verified') {
        const cat = e.category || 'General';
        const current = this.categorySpendingMap.has(cat) ? this.categorySpendingMap.get(cat) : 0;
        this.categorySpendingMap.set(cat, current + e.amount);
      }
    });

    // Populate skill frequencies map
    this.volunteers.forEach(v => {
      if (Array.isArray(v.skills)) {
        v.skills.forEach(skill => {
          const count = this.skillFrequencyMap.has(skill) ? this.skillFrequencyMap.get(skill) : 0;
          this.skillFrequencyMap.set(skill, count + 1);
        });
      }
    });
  }

  // Safe removal helper using Map.prototype.delete()
  deleteCampaignFromState(campaignId) {
    if (this.campaignDonationMap.has(campaignId)) {
      this.campaignDonationMap.delete(campaignId);
    }
    if (this.campaignExpenseMap.has(campaignId)) {
      this.campaignExpenseMap.delete(campaignId);
    }
    if (this.campaignBalanceMap.has(campaignId)) {
      this.campaignBalanceMap.delete(campaignId);
    }
  }

  // Safe removal helper using Set.prototype.delete()
  deleteDonationFromState(donationId) {
    const donation = this.donations.find(d => d.id === donationId);
    if (donation && donation.transactionRef && this.uniqueTxRefs.has(donation.transactionRef.toUpperCase())) {
      this.uniqueTxRefs.delete(donation.transactionRef.toUpperCase());
    }
  }

  deleteApplicationFromState(applicationId) {
    const app = this.applications.find(a => a.id === applicationId);
    if (app) {
      const key = `${app.volunteerId}_${app.opportunityId}`;
      if (this.volunteerApplicationKeys.has(key)) {
        this.volunteerApplicationKeys.delete(key);
      }
    }
  }

  deleteVolunteerFromState(volunteerId) {
    const vol = this.volunteers.find(v => v.id === volunteerId);
    if (vol && Array.isArray(vol.skills)) {
      vol.skills.forEach(skill => {
        const hasOther = this.volunteers.some(other => other.id !== volunteerId && other.skills.includes(skill));
        if (!hasOther && this.uniqueVolunteerSkills.has(skill)) {
          this.uniqueVolunteerSkills.delete(skill);
        }
      });
    }
  }
}

const appState = new AppState();

// ==============================================================================
// 4. CALCULATIONS, FINANCIAL RECONCILIATION & ANALYTICS
// ==============================================================================

/**
 * Array processing helpers demonstrating map, filter, reduce, find, some, every, sort
 */
function getLocalTodayDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const Analytics = {
  // Format currency in Indian Rupees
  formatINR(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  },

  formatPercent(val) {
    const num = Number(val) || 0;
    return `${num.toFixed(1)}%`;
  },

  // Calculate global totals using reduce()
  calculateGlobalFinancials(donations, expenses) {
    // Array.prototype.reduce() for total donations
    const totalDonations = donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    // Array.prototype.filter() + reduce() for verified expenses
    const totalVerifiedExpenses = expenses
      .filter(e => e.status === 'verified')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    // Pending expenses held in reserve
    const totalPendingExpenses = expenses
      .filter(e => e.status === 'pending')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    // Remaining funds strictly following non-profit pooling formula
    const remainingFunds = totalDonations - totalVerifiedExpenses;

    // Overall utilisation ratio
    const utilisationRatio = totalDonations > 0 ? (totalVerifiedExpenses / totalDonations) * 100 : 0;

    return {
      totalDonations,
      totalVerifiedExpenses,
      totalPendingExpenses,
      remainingFunds,
      utilisationRatio
    };
  },

  // Campaign-specific financials demonstrating find(), filter(), reduce()
  getCampaignFinancials(campaignId, donations, expenses, campaigns) {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return null;

    const campaignDonations = donations.filter(d => d.campaignId === campaignId);
    const campaignExpenses = expenses.filter(e => e.campaignId === campaignId);

    const raised = campaignDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const spent = campaignExpenses
      .filter(e => e.status === 'verified')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const pending = campaignExpenses
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const balance = raised - spent;
    const progress = campaign.target > 0 ? (raised / campaign.target) * 100 : 0;

    return {
      campaign,
      raised,
      spent,
      pending,
      balance,
      progress,
      donationsCount: campaignDonations.length,
      expensesCount: campaignExpenses.length
    };
  },

  // Check if every campaign is balanced using every()
  isEveryCampaignSolvent(campaigns, donationMap, expenseMap) {
    return campaigns.every(c => {
      const raised = donationMap.has(c.id) ? donationMap.get(c.id) : 0;
      const spent = expenseMap.has(c.id) ? expenseMap.get(c.id) : 0;
      return raised >= spent;
    });
  },

  // Check if any expense violates available funds using some()
  hasAnyOverdrawnCampaign(campaigns, donationMap, expenseMap) {
    return campaigns.some(c => {
      const raised = donationMap.has(c.id) ? donationMap.get(c.id) : 0;
      const spent = expenseMap.has(c.id) ? expenseMap.get(c.id) : 0;
      return spent > raised;
    });
  }
};

// ==============================================================================
// 5. GIVETRACK INTEGRITY SENTINEL (Automated Financial Anomaly Detection Engine)
// ==============================================================================

/**
 * GiveTrack Integrity Sentinel analyzes all transactions and produces actionable alerts.
 * Implements 5 comprehensive integrity checks:
 * 1. Duplicate transaction references
 * 2. Missing receipt references
 * 3. Expenses exceeding available campaign funds
 * 4. Campaign financial reconciliation discrepancies (independent calculation vs cache)
 * 5. Unusual expense amounts compared with category averages (excluding the tested item)
 */
class IntegritySentinel {
  constructor() {
    this.alerts = [];
  }

  runFullAudit(campaigns, donations, expenses, donationMap, expenseMap) {
    const alerts = [];
    let alertCounter = 1;

    // Helper to push structured alerts
    const addAlert = ({ category, severity, relatedEntity, explanation, recommendedAction }) => {
      alerts.push({
        id: `SNT-${String(alertCounter++).padStart(3, '0')}`,
        category,          // 'Duplicate Reference' | 'Missing Documentation' | 'Fund Deficit' | 'Reconciliation' | 'Statistical Anomaly'
        severity,          // 'Critical' | 'Warning' | 'Informational'
        relatedEntity,     // ID or description
        explanation,
        recommendedAction,
        detectionDate: new Date().toISOString().split('T')[0]
      });
    };

    // --- CHECK 1: Duplicate Transaction References ---
    // Uses Map.prototype.has(), set(), and entries()
    const refCounts = new Map();
    donations.forEach(d => {
      if (!d.transactionRef) return;
      const ref = d.transactionRef.trim().toUpperCase();
      if (!refCounts.has(ref)) {
        refCounts.set(ref, []);
      }
      refCounts.get(ref).push(d);
    });

    for (const [ref, items] of refCounts.entries()) {
      if (items.length > 1) {
        addAlert({
          category: 'Duplicate Reference',
          severity: 'Critical',
          relatedEntity: `Transaction Ref: ${ref}`,
          explanation: `The transaction reference "${ref}" appears in ${items.length} different donation records (${items.map(i => i.id).join(', ')}).`,
          recommendedAction: 'Inspect bank/gateway records and verify if duplicate entries were submitted. Amend or delete spurious duplicate records.'
        });
      }
    }

    // --- CHECK 2: Missing Receipt References on Expenses ---
    // Filters expenses that have empty receipt references or are pending
    const missingReceiptExpenses = expenses.filter(e => !e.receiptRef || e.receiptRef.trim() === '' || e.status === 'pending');
    missingReceiptExpenses.forEach(e => {
      const isPending = e.status === 'pending';
      addAlert({
        category: 'Missing Documentation',
        severity: isPending ? 'Warning' : 'Critical',
        relatedEntity: `Expense ${e.id} (${e.title})`,
        explanation: isPending 
          ? `Disbursement voucher "${e.id}" is held in pending status awaiting receipt verification.`
          : `Expense "${e.id}" for ${Analytics.formatINR(e.amount)} does not contain a verified vendor tax invoice or receipt reference.`,
        recommendedAction: 'Attach an official vendor invoice or procurement bill reference code.'
      });
    });

    // --- CHECK 3: Expenses Exceeding Available Campaign Balance ---
    // Checks if any campaign has verified expenses greater than donations received
    campaigns.forEach(c => {
      const raised = donationMap.has(c.id) ? donationMap.get(c.id) : 0;
      const spent = expenseMap.has(c.id) ? expenseMap.get(c.id) : 0;
      if (spent > raised) {
        const deficit = spent - raised;
        addAlert({
          category: 'Fund Deficit',
          severity: 'Critical',
          relatedEntity: `Campaign: ${c.name} (${c.id})`,
          explanation: `Verified expenses (${Analytics.formatINR(spent)}) exceed total received donations (${Analytics.formatINR(raised)}) by ${Analytics.formatINR(deficit)}.`,
          recommendedAction: 'Halt further disbursements immediately. Allocate bridge funds from general reserves or reassign misallocated expense entries.'
        });
      }
    });

    // --- CHECK 4: Campaign Financial Reconciliation Discrepancy ---
    // Compares independently calculated transaction totals against campaign indexes and balances
    campaigns.forEach(c => {
      const rawDonations = donations
        .filter(d => d.campaignId === c.id)
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
      const rawVerifiedExpenses = expenses
        .filter(e => e.campaignId === c.id && e.status === 'verified')
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const mapDonations = donationMap.has(c.id) ? donationMap.get(c.id) : 0;
      const mapExpenses = expenseMap.has(c.id) ? expenseMap.get(c.id) : 0;
      const indexedBalance = appState.campaignBalanceMap.has(c.id) ? appState.campaignBalanceMap.get(c.id) : 0;
      const trueBalance = rawDonations - rawVerifiedExpenses;

      if (Math.abs(mapDonations - rawDonations) > 0.01 || Math.abs(mapExpenses - rawVerifiedExpenses) > 0.01) {
        addAlert({
          category: 'Reconciliation',
          severity: 'Critical',
          relatedEntity: `Campaign: ${c.name} (${c.id})`,
          explanation: `Ledger index mismatch in ${c.name}: Cached totals (Raised: ${Analytics.formatINR(mapDonations)}, Spent: ${Analytics.formatINR(mapExpenses)}) diverge from raw transaction sums (Raised: ${Analytics.formatINR(rawDonations)}, Spent: ${Analytics.formatINR(rawVerifiedExpenses)}).`,
          recommendedAction: 'Rebuild campaign indices and verify in-memory ledger state.'
        });
      } else if (Math.abs(indexedBalance - trueBalance) > 0.01) {
        addAlert({
          category: 'Reconciliation',
          severity: 'Critical',
          relatedEntity: `Campaign: ${c.name} (${c.id})`,
          explanation: `Balance disparity detected in ${c.name}: Indexed balance (${Analytics.formatINR(indexedBalance)}) does not match raw calculated reserve (${Analytics.formatINR(trueBalance)}).`,
          recommendedAction: 'Recalculate campaign ledger entries and check for uncommitted transaction writes.'
        });
      }
    });

    // --- CHECK 5: Unusual Expense Amounts Compared With Category Averages ---
    // Excludes the tested transaction from its comparison average
    expenses.forEach(e => {
      if (e.status === 'verified') {
        const cat = e.category || 'General';
        const otherExpenses = expenses.filter(x => x.id !== e.id && x.category === cat && x.status === 'verified');
        if (otherExpenses.length >= 1) {
          const sumOther = otherExpenses.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);
          const avgOther = sumOther / otherExpenses.length;
          // Flag if expense is more than 2.5 times the category baseline average (and at least ₹20,000)
          if (avgOther > 0 && e.amount >= 20000 && e.amount > avgOther * 2.5) {
            addAlert({
              category: 'Statistical Anomaly',
              severity: 'Informational',
              relatedEntity: `Expense Voucher ${e.id} (${Analytics.formatINR(e.amount)})`,
              explanation: `Disbursement amount is ${(e.amount / avgOther).toFixed(1)}x higher than the baseline average of other disbursements in category "${cat}" (${Analytics.formatINR(avgOther)} across ${otherExpenses.length} vouchers). This variance warrants administrative review.`,
              recommendedAction: 'Conduct secondary review with field coordinator to confirm competitive market quotations were documented.'
            });
          }
        }
      }
    });

    this.alerts = alerts;
    return alerts;
  }
}

const integritySentinel = new IntegritySentinel();

// ==============================================================================
// 6. INTELLIGENT VOLUNTEER SKILL MATCHING ALGORITHM
// ==============================================================================

/**
 * Transparent rule-based skill matching formula:
 * Match % = (Count of Matched Skills / Total Required Skills) * 100
 */
const SkillMatcher = {
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

    let grade = 'Low Match';
    let level = 'low';
    if (score >= 75) {
      grade = 'High Match';
      level = 'high';
    } else if (score >= 40) {
      grade = 'Moderate Match';
      level = 'medium';
    }

    return {
      score,
      percentage: score,
      matchedSkills,
      missingSkills,
      grade,
      level,
      isNA: false
    };
  },

  // Find best matching opportunities for a given volunteer
  getRecommendationsForVolunteer(volunteer, opportunities) {
    if (!volunteer) return [];
    return opportunities
      .map(opp => {
        const match = this.calculateMatch(volunteer.skills, opp.requiredSkills);
        return {
          opportunity: opp,
          match
        };
      })
      .sort((a, b) => b.match.score - a.match.score);
  },

  // Find best matching volunteers for a given opportunity
  getRecommendationsForOpportunity(opportunity, volunteers) {
    if (!opportunity) return [];
    return volunteers
      .map(vol => {
        const match = this.calculateMatch(vol.skills, opportunity.requiredSkills);
        return {
          volunteer: vol,
          match
        };
      })
      .sort((a, b) => b.match.score - a.match.score);
  }
};

// ==============================================================================
// 7. INTERACTIVE SVG CHART ENGINE (Donations vs Expenses & Allocation Doughnut)
// ==============================================================================

/**
 * Pure SVG Chart Generators — Responsive, accessible, lightweight, zero dependencies
 */
const ChartEngine = {
  // Render Bar Comparison Chart: Raised vs Spent per Campaign
  renderComparisonBarChart(containerId, campaigns, donationMap, expenseMap) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!campaigns || campaigns.length === 0) {
      container.innerHTML = '<p class="empty-state-text">No campaigns available to display charts.</p>';
      return;
    }

    const width = 640;
    const height = 280;
    const padding = { top: 30, right: 30, bottom: 65, left: 70 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate max value for Y-axis scale
    let maxVal = 0;
    campaigns.forEach(c => {
      const raised = donationMap.has(c.id) ? donationMap.get(c.id) : 0;
      const spent = expenseMap.has(c.id) ? expenseMap.get(c.id) : 0;
      if (raised > maxVal) maxVal = raised;
      if (spent > maxVal) maxVal = spent;
      if (c.target > maxVal) maxVal = c.target;
    });
    if (maxVal === 0) maxVal = 100000;
    maxVal = Math.ceil(maxVal / 25000) * 25000;

    const groupWidth = chartWidth / campaigns.length;
    const barWidth = Math.min(32, (groupWidth - 20) / 2);

    let barsSvg = '';
    let xLabelsSvg = '';

    campaigns.forEach((c, i) => {
      const raised = donationMap.has(c.id) ? donationMap.get(c.id) : 0;
      const spent = expenseMap.has(c.id) ? expenseMap.get(c.id) : 0;

      const groupX = padding.left + i * groupWidth + (groupWidth - barWidth * 2 - 4) / 2;

      const raisedHeight = (raised / maxVal) * chartHeight;
      const raisedY = padding.top + (chartHeight - raisedHeight);

      const spentHeight = (spent / maxVal) * chartHeight;
      const spentY = padding.top + (chartHeight - spentHeight);

      // Short label safely escaped
      const safeName = DOMRenderer.escapeHTML(c.name);
      const shortName = safeName.length > 14 ? safeName.substring(0, 13) + '…' : safeName;

      barsSvg += `
        <g class="chart-group" tabindex="0" role="graphics-symbol" aria-label="${safeName}: Raised ${Analytics.formatINR(raised)}, Spent ${Analytics.formatINR(spent)}">
          <!-- Raised Bar (Turquoise) -->
          <rect x="${groupX}" y="${raisedY}" width="${barWidth}" height="${raisedHeight}" rx="4" fill="#0C8277">
            <title>${safeName} - Raised: ${Analytics.formatINR(raised)}</title>
          </rect>
          <!-- Spent Bar (Orange) -->
          <rect x="${groupX + barWidth + 4}" y="${spentY}" width="${barWidth}" height="${spentHeight}" rx="4" fill="#F59A38">
            <title>${safeName} - Spent: ${Analytics.formatINR(spent)}</title>
          </rect>
        </g>
      `;

      xLabelsSvg += `
        <text x="${groupX + barWidth + 2}" y="${height - 25}" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.85">${shortName}</text>
        <text x="${groupX + barWidth + 2}" y="${height - 10}" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.6">${c.id}</text>
      `;
    });

    // Y-axis grid lines
    const yTicks = 4;
    let yGridSvg = '';
    for (let t = 0; t <= yTicks; t++) {
      const val = (maxVal / yTicks) * t;
      const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
      yGridSvg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="currentColor" stroke-dasharray="3,3" opacity="0.15" />
        <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="currentColor" opacity="0.75">₹${(val / 1000).toFixed(0)}k</text>
      `;
    }

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="interactive-chart-svg" role="img" aria-label="Campaign donations versus expenses comparison chart">
        ${yGridSvg}
        ${barsSvg}
        ${xLabelsSvg}
        <!-- Legend -->
        <g transform="translate(${width - 220}, 12)">
          <rect x="0" y="0" width="12" height="12" rx="2" fill="#0C8277" />
          <text x="18" y="10" font-size="11" fill="currentColor" opacity="0.9">Donations (₹)</text>
          <rect x="110" y="0" width="12" height="12" rx="2" fill="#F59A38" />
          <text x="128" y="10" font-size="11" fill="currentColor" opacity="0.9">Expenses (₹)</text>
        </g>
      </svg>
    `;
  },

  // Render Category Breakdown Donut / Progress chart using Map.prototype.entries()
  renderCategoryAllocation(containerId, categoryMap) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!categoryMap || categoryMap.size === 0) {
      container.innerHTML = '<p class="empty-state-text">No expense categories to display.</p>';
      return;
    }

    let totalSpent = 0;
    // Iterating Map entries
    for (const [, amount] of categoryMap.entries()) {
      totalSpent += amount;
    }

    const colors = ['#0C8277', '#F59A38', '#2563EB', '#10B981', '#8B5CF6', '#EC4899', '#F97316'];
    let html = '<div class="category-breakdown-list">';
    let colorIdx = 0;

    // Direct iteration via Map.prototype.entries()
    for (const [category, amount] of categoryMap.entries()) {
      const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      const color = colors[colorIdx % colors.length];
      colorIdx++;

      html += `
        <div class="category-bar-item">
          <div class="category-bar-header">
            <span class="category-bar-name">
              <span class="category-bullet" style="background-color: ${color}"></span>
              ${DOMRenderer.escapeHTML(category)}
            </span>
            <span class="category-bar-val"><strong>${Analytics.formatINR(amount)}</strong> (${pct.toFixed(1)}%)</span>
          </div>
          <div class="category-progress-track">
            <div class="category-progress-fill" style="width: ${pct}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    }

    html += '</div>';
    container.innerHTML = html;
  }
};

// ==============================================================================
// 8. DOM RENDERING & VIEW CONTROLLERS
// ==============================================================================

const DOMRenderer = {
  // Update dashboard KPI metric counters
  renderDashboardMetrics() {
    const financials = Analytics.calculateGlobalFinancials(appState.donations, appState.expenses);

    const elTotalDonations = document.getElementById('metric-total-donations');
    const elTotalExpenses = document.getElementById('metric-total-expenses');
    const elRemainingFunds = document.getElementById('metric-remaining-funds');
    const elActiveCampaigns = document.getElementById('metric-active-campaigns');
    const elTotalDonors = document.getElementById('metric-total-donors');
    const elTotalVolunteers = document.getElementById('metric-total-volunteers');
    const elPendingApps = document.getElementById('metric-pending-apps');
    const elFundRatio = document.getElementById('metric-fund-ratio');

    if (elTotalDonations) elTotalDonations.textContent = Analytics.formatINR(financials.totalDonations);
    if (elTotalExpenses) elTotalExpenses.textContent = Analytics.formatINR(financials.totalVerifiedExpenses);
    if (elRemainingFunds) elRemainingFunds.textContent = Analytics.formatINR(financials.remainingFunds);
    if (elActiveCampaigns) elActiveCampaigns.textContent = appState.campaigns.filter(c => c.status === 'active').length;
    if (elTotalDonors) elTotalDonors.textContent = appState.uniqueDonorIds.size;
    if (elTotalVolunteers) elTotalVolunteers.textContent = appState.volunteers.length;
    if (elPendingApps) elPendingApps.textContent = appState.applications.filter(a => a.status === 'pending').length;
    if (elFundRatio) elFundRatio.textContent = Analytics.formatPercent(financials.utilisationRatio);

    // Update flagship reconciliation display
    const heroFormulaSpan = document.querySelector('.reconciliation-formula');
    if (heroFormulaSpan) {
      const cfspFin = Analytics.getCampaignFinancials('CMP-CFSP-01', appState.donations, appState.expenses, appState.campaigns);
      if (cfspFin) {
        heroFormulaSpan.innerHTML = `Audited Reconciliation: <span>${Analytics.formatINR(cfspFin.spent)} Verified Spent</span> + <span>${Analytics.formatINR(cfspFin.balance)} Remaining</span> = <span>${Analytics.formatINR(cfspFin.raised)} Total Raised</span>`;
      }
    }
  },

  // Dynamically populate all filter and select dropdowns across the application
  populateDynamicFilters() {
    // 1. Campaign Categories Filter
    const catSelect = document.getElementById('filter-campaign-category');
    if (catSelect) {
      const currentVal = appState.campaignFilter.category;
      const uniqueCats = Array.from(new Set(appState.campaigns.map(c => c.category))).sort();
      catSelect.innerHTML = '<option value="all">All Categories</option>' + 
        uniqueCats.map(cat => `<option value="${this.escapeHTML(cat)}"${cat === currentVal ? ' selected' : ''}>${this.escapeHTML(cat)}</option>`).join('');
    }

    // 2. Donation Campaign Filter
    const donCampSelect = document.getElementById('filter-donation-campaign');
    if (donCampSelect) {
      const currentVal = appState.donationFilter.campaignId;
      donCampSelect.innerHTML = '<option value="all">All Campaigns</option>' + 
        appState.campaigns.map(c => `<option value="${c.id}"${c.id === currentVal ? ' selected' : ''}>${this.escapeHTML(c.name)}</option>`).join('');
    }

    // 3. Expense Campaign Filter
    const expCampSelect = document.getElementById('filter-expense-campaign');
    if (expCampSelect) {
      const currentVal = appState.expenseFilter.campaignId;
      expCampSelect.innerHTML = '<option value="all">All Campaigns</option>' + 
        appState.campaigns.map(c => `<option value="${c.id}"${c.id === currentVal ? ' selected' : ''}>${this.escapeHTML(c.name)}</option>`).join('');
    }

    // 4. Expense Category Filter
    const expCatSelect = document.getElementById('filter-expense-category');
    if (expCatSelect) {
      const currentVal = appState.expenseFilter.category;
      const uniqueExpCats = Array.from(new Set(appState.expenses.map(e => e.category))).sort();
      expCatSelect.innerHTML = '<option value="all">All Categories</option>' + 
        uniqueExpCats.map(cat => `<option value="${this.escapeHTML(cat)}"${cat === currentVal ? ' selected' : ''}>${this.escapeHTML(cat)}</option>`).join('');
    }

    // 5. Volunteer Skill Filter
    const volSkillSelect = document.getElementById('filter-volunteer-skill');
    if (volSkillSelect) {
      const currentVal = appState.volunteerFilter.skill;
      const uniqueSkills = Array.from(appState.uniqueVolunteerSkills).sort();
      volSkillSelect.innerHTML = '<option value="all">All Skills</option>' + 
        uniqueSkills.map(s => `<option value="${this.escapeHTML(s)}"${s === currentVal ? ' selected' : ''}>${this.escapeHTML(s)}</option>`).join('');
    }

    // 6. Form Selects: Donation Modal Campaign Dropdown (Active Campaigns Only!)
    const formDonCamp = document.getElementById('donation-campaign');
    if (formDonCamp) {
      const activeCampaigns = appState.campaigns.filter(c => c.status === 'active');
      formDonCamp.innerHTML = '<option value="" disabled selected>Select Active Campaign</option>' + 
        activeCampaigns.map(c => `<option value="${c.id}">${this.escapeHTML(c.name)}</option>`).join('');
    }

    // 7. Form Selects: Expense Modal Campaign Dropdown
    const formExpCamp = document.getElementById('expense-campaign');
    if (formExpCamp) {
      formExpCamp.innerHTML = '<option value="" disabled selected>Select Campaign</option>' + 
        appState.campaigns.map(c => `<option value="${c.id}">${this.escapeHTML(c.name)} (Balance: ${Analytics.formatINR(appState.campaignBalanceMap.get(c.id) || 0)})</option>`).join('');
    }

    // 8. Form Selects: Expense Modal Category Dropdown
    const formExpCat = document.getElementById('expense-category');
    if (formExpCat) {
      const allKnownCats = Array.from(new Set([
        ...appState.expenses.map(e => e.category),
        'Grains & Pulses', 'Produce', 'Packaging', 'Logistics', 'Maintenance', 'Educational Material', 'Medical Supplies', 'Horticulture'
      ])).sort();
      formExpCat.innerHTML = allKnownCats.map(cat => `<option value="${this.escapeHTML(cat)}">${this.escapeHTML(cat)}</option>`).join('');
    }
  },

  // Render recent activity feed on dashboard
  renderRecentActivity() {
    const container = document.getElementById('dashboard-recent-activity');
    if (!container) return;

    // Combine recent donations and expenses, sort by date desc
    const activityItems = [
      ...appState.donations.map(d => ({ type: 'donation', title: `Donation: ${d.donorName}`, amount: d.amount, date: d.date, meta: d.paymentMethod })),
      ...appState.expenses.map(e => ({ type: 'expense', title: `Expense: ${e.title}`, amount: e.amount, date: e.date, meta: e.category }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

    if (activityItems.length === 0) {
      container.innerHTML = '<p class="empty-state-text">No recent transactions logged.</p>';
      return;
    }

    container.innerHTML = activityItems.map(item => `
      <div class="activity-feed-item">
        <div class="activity-badge ${item.type === 'donation' ? 'badge-inflow' : 'badge-outflow'}">
          ${item.type === 'donation' ? '↓ Inflow' : '↑ Outflow'}
        </div>
        <div class="activity-details">
          <div class="activity-title">${this.escapeHTML(item.title)}</div>
          <div class="activity-meta">${item.date} &bull; ${this.escapeHTML(item.meta)}</div>
        </div>
        <div class="activity-amount ${item.type === 'donation' ? 'amount-green' : 'amount-orange'}">
          ${item.type === 'donation' ? '+' : '-'}${Analytics.formatINR(item.amount)}
        </div>
      </div>
    `).join('');
  },

  // Render Integrity Sentinel Alert Banners
  renderSentinelSummaryBanner() {
    const container = document.getElementById('dashboard-sentinel-banner');
    if (!container) return;

    const criticalCount = appState.sentinelAlerts.filter(a => a.severity === 'Critical').length;
    const warningCount = appState.sentinelAlerts.filter(a => a.severity === 'Warning').length;

    if (criticalCount === 0 && warningCount === 0) {
      container.className = 'sentinel-summary-banner status-all-clear';
      container.innerHTML = `
        <div class="sentinel-banner-icon">✓</div>
        <div class="sentinel-banner-content">
          <strong>GiveTrack Integrity Sentinel: All Financial Records Verified</strong>
          <p>No critical balance deficits, duplicate transaction references, or unverified claims detected.</p>
        </div>
        <button type="button" class="btn-subtle" onclick="AppEvents.navigateTo('sentinel')">View Audit Log</button>
      `;
    } else {
      container.className = 'sentinel-summary-banner status-action-required';
      container.innerHTML = `
        <div class="sentinel-banner-icon">⚠️</div>
        <div class="sentinel-banner-content">
          <strong>Integrity Sentinel Notice: ${criticalCount} Critical, ${warningCount} Warning Anomaly Detected</strong>
          <p>Automated verification identified records requiring administrative review before reconciliation.</p>
        </div>
        <button type="button" class="btn-primary-small" onclick="AppEvents.navigateTo('sentinel')">Inspect Anomalies</button>
      `;
    }
  },

  // Render Campaigns View
  renderCampaigns() {
    const container = document.getElementById('campaigns-grid-container');
    if (!container) return;

    let filtered = [...appState.campaigns];
    const { search, category, status, sortBy } = appState.campaignFilter;

    // Filter by search text
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(c => c.category === category);
    }
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }

    // Sort
    filtered.sort((a, b) => {
      const finA = Analytics.getCampaignFinancials(a.id, appState.donations, appState.expenses, appState.campaigns);
      const finB = Analytics.getCampaignFinancials(b.id, appState.donations, appState.expenses, appState.campaigns);
      if (sortBy === 'progress_desc') return (finB?.progress || 0) - (finA?.progress || 0);
      if (sortBy === 'progress_asc') return (finA?.progress || 0) - (finB?.progress || 0);
      if (sortBy === 'target_desc') return b.target - a.target;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state-card"><p>No campaigns match your filter criteria.</p></div>';
      return;
    }

    container.innerHTML = filtered.map(c => {
      const fin = Analytics.getCampaignFinancials(c.id, appState.donations, appState.expenses, appState.campaigns);
      const progressClamped = Math.min(100, fin ? fin.progress : 0);

      return `
        <article class="campaign-management-card gt-card" data-campaign-id="${c.id}">
          <div class="campaign-card-header">
            <span class="campaign-category-badge cat-${(c.category || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${this.escapeHTML(c.category)}</span>
            <span class="status-pill status-${c.status}">${c.status}</span>
          </div>
          <div class="campaign-card-body">
            <h3 class="campaign-card-title">${this.escapeHTML(c.name)}</h3>
            <p class="campaign-card-desc">${this.escapeHTML(c.description)}</p>
            
            <div class="campaign-financial-metrics">
              <div class="metric-row">
                <span>Raised: <strong>${Analytics.formatINR(fin?.raised || 0)}</strong></span>
                <span>Target: <strong>${Analytics.formatINR(c.target)}</strong></span>
              </div>
              <div class="metric-row">
                <span>Spent: <strong>${Analytics.formatINR(fin?.spent || 0)}</strong></span>
                <span>Balance: <strong class="${(fin?.balance || 0) < 0 ? 'text-danger' : 'text-success'}">${Analytics.formatINR(fin?.balance || 0)}</strong></span>
              </div>
            </div>

            <div class="campaign-progress-bar" role="progressbar" aria-valuenow="${progressClamped.toFixed(0)}" aria-valuemin="0" aria-valuemax="100">
              <div class="campaign-progress-fill fill-turquoise" style="width: ${progressClamped}%;"></div>
            </div>
            <div class="progress-caption">${(fin?.progress || 0).toFixed(1)}% funded &bull; ${fin?.donationsCount || 0} donations logged</div>

            <div class="campaign-card-actions">
              <button type="button" class="btn-subtle" data-action="details" data-id="${c.id}">Details</button>
              <button type="button" class="btn-subtle" data-action="edit" data-id="${c.id}">Edit</button>
              <button type="button" class="btn-danger-outline" data-action="delete" data-id="${c.id}">Delete</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  // Render Donations Table
  renderDonationsTable() {
    const tbody = document.getElementById('donations-table-body');
    if (!tbody) return;

    let filtered = [...appState.donations];
    const { search, campaignId, dateFrom, dateTo, sortBy } = appState.donationFilter;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(d => d.donorName.toLowerCase().includes(q) || d.transactionRef.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
    }
    if (campaignId !== 'all') {
      filtered = filtered.filter(d => d.campaignId === campaignId);
    }
    if (dateFrom) {
      filtered = filtered.filter(d => d.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(d => d.date <= dateTo);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

    const totalFiltered = filtered.reduce((sum, d) => sum + d.amount, 0);
    const summarySpan = document.getElementById('donations-filtered-total');
    if (summarySpan) {
      summarySpan.textContent = `Showing ${filtered.length} donations (${Analytics.formatINR(totalFiltered)})`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-table-cell">No donation records found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(d => {
      const campaign = appState.campaigns.find(c => c.id === d.campaignId);
      const isDuplicate = appState.donations.filter(x => x.transactionRef.toUpperCase() === d.transactionRef.toUpperCase()).length > 1;

      return `
        <tr class="${isDuplicate ? 'row-duplicate-warning' : ''}">
          <td><code>${d.id}</code></td>
          <td><strong>${this.escapeHTML(d.donorName)}</strong><br><small class="text-muted">${d.donorId}</small></td>
          <td>${this.escapeHTML(campaign ? campaign.name : d.campaignId)}</td>
          <td><strong class="amount-green">${Analytics.formatINR(d.amount)}</strong></td>
          <td>${d.date}</td>
          <td>
            <span class="tx-ref-badge ${isDuplicate ? 'badge-danger' : ''}">${this.escapeHTML(d.transactionRef)}</span>
            ${isDuplicate ? '<span class="duplicate-indicator" title="Duplicate Transaction Reference detected!">⚠️</span>' : ''}
          </td>
          <td>
            <div class="table-row-actions">
              <button type="button" class="btn-icon" title="Edit Donation" data-action="edit-donation" data-id="${d.id}">✎</button>
              <button type="button" class="btn-icon btn-icon-danger" title="Delete Donation" data-action="delete-donation" data-id="${d.id}">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Render Expenses Table
  renderExpensesTable() {
    const tbody = document.getElementById('expenses-table-body');
    if (!tbody) return;

    let filtered = [...appState.expenses];
    const { search, campaignId, category, sortBy } = appState.expenseFilter;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e => e.title.toLowerCase().includes(q) || (e.receiptRef && e.receiptRef.toLowerCase().includes(q)) || e.id.toLowerCase().includes(q));
    }
    if (campaignId !== 'all') {
      filtered = filtered.filter(e => e.campaignId === campaignId);
    }
    if (category !== 'all') {
      filtered = filtered.filter(e => e.category === category);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

    const totalFiltered = filtered
      .filter(e => e.status === 'verified')
      .reduce((sum, e) => sum + e.amount, 0);
    const summarySpan = document.getElementById('expenses-filtered-total');
    if (summarySpan) {
      summarySpan.textContent = `Showing ${filtered.length} vouchers (${Analytics.formatINR(totalFiltered)} verified)`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-table-cell">No expense records found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(e => {
      const campaign = appState.campaigns.find(c => c.id === e.campaignId);
      const isMissingReceipt = !e.receiptRef || e.receiptRef.trim() === '';

      return `
        <tr class="status-row-${e.status}">
          <td><code>${e.id}</code></td>
          <td><strong>${this.escapeHTML(e.title)}</strong><br><small class="text-muted">${this.escapeHTML(e.description || '')}</small></td>
          <td>${this.escapeHTML(campaign ? campaign.name : e.campaignId)}</td>
          <td><span class="category-pill">${this.escapeHTML(e.category)}</span></td>
          <td><strong>${Analytics.formatINR(e.amount)}</strong></td>
          <td>${e.date}</td>
          <td>
            <span class="status-pill status-${e.status}">
              ${e.status === 'verified' ? 'Verified' : e.status === 'pending' ? 'Pending' : 'Rejected'}
            </span>
          </td>
          <td>
            ${isMissingReceipt 
              ? '<span class="badge-danger">Missing Bill</span>' 
              : `<code>${this.escapeHTML(e.receiptRef)}</code>`}
          </td>
          <td>
            <div class="table-row-actions">
              <button type="button" class="btn-icon" title="Edit Expense" data-action="edit-expense" data-id="${e.id}">✎</button>
              <button type="button" class="btn-icon btn-icon-danger" title="Delete Expense" data-action="delete-expense" data-id="${e.id}">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Render Volunteers & Matching View
  renderVolunteers() {
    const container = document.getElementById('volunteers-grid-container');
    if (!container) return;

    let filtered = [...appState.volunteers];
    const { search, skill, status } = appState.volunteerFilter;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(v => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q));
    }
    if (skill !== 'all') {
      filtered = filtered.filter(v => Array.isArray(v.skills) && v.skills.includes(skill));
    }
    if (status !== 'all') {
      filtered = filtered.filter(v => v.status === status);
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state-card"><p>No volunteers found matching your query.</p></div>';
      return;
    }

    container.innerHTML = filtered.map(v => `
      <div class="volunteer-card gt-card ${appState.selectedVolunteerId === v.id ? 'card-selected' : ''}" data-volunteer-id="${v.id}">
        <div class="volunteer-card-header">
          <div>
            <h4 class="volunteer-name">${this.escapeHTML(v.name)}</h4>
            <div class="volunteer-email">${this.escapeHTML(v.email)}</div>
          </div>
          <span class="status-pill status-${v.status}">${v.status}</span>
        </div>
        <div class="volunteer-meta" style="font-size: 0.85rem; margin: 0.5rem 0;">
          <div><strong>Availability:</strong> ${this.escapeHTML(v.availability)}</div>
          <div><strong>Phone:</strong> ${this.escapeHTML(v.phone)}</div>
        </div>
        <div class="volunteer-skills-list">
          ${v.skills.map(s => `<span class="skill-tag skill-pill">${this.escapeHTML(s)}</span>`).join('')}
        </div>
        <div class="volunteer-card-actions">
          <button type="button" class="btn-primary-small" data-action="match-volunteer" data-id="${v.id}">
            Match Shifts
          </button>
          <button type="button" class="btn-subtle" data-action="edit-volunteer" data-id="${v.id}">
            Edit
          </button>
          <button type="button" class="btn-danger-outline" data-action="delete-volunteer" data-id="${v.id}">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  },

  // Render Opportunities Grid
  renderOpportunities() {
    const container = document.getElementById('opportunities-grid-container');
    if (!container) return;

    container.innerHTML = appState.opportunities.map(opp => {
      // Count approved applications
      const approvedCount = appState.applications.filter(a => a.opportunityId === opp.id && a.status === 'approved').length;
      const isFull = approvedCount >= opp.requiredVolunteers;

      return `
        <div class="opportunity-card gt-card" data-opportunity-id="${opp.id}">
          <div class="opportunity-header">
            <h4 class="opportunity-title">${this.escapeHTML(opp.title)}</h4>
            <span class="status-pill status-${isFull ? 'rejected' : 'verified'}">${isFull ? 'Shift Full' : 'Shift Open'}</span>
          </div>
          <p class="opportunity-desc">${this.escapeHTML(opp.description)}</p>
          <div class="opportunity-meta-grid">
            <div><strong>Location:</strong> ${this.escapeHTML(opp.location)}</div>
            <div><strong>Date & Time:</strong> ${opp.shiftDate} (${this.escapeHTML(opp.shiftTiming)})</div>
            <div><strong>Capacity:</strong> ${approvedCount} of ${opp.requiredVolunteers} volunteers</div>
          </div>
          <div class="opportunity-skills-list">
            <strong>Required Skills:</strong>
            ${opp.requiredSkills.length > 0 
              ? opp.requiredSkills.map(s => `<span class="skill-tag skill-required">${this.escapeHTML(s)}</span>`).join('')
              : '<span class="text-muted" style="font-size: 0.8rem; margin-left: 0.35rem;">None (Open Participation)</span>'}
          </div>
          <div class="opportunity-actions">
            <button type="button" class="btn-subtle" data-action="apply-opp" data-id="${opp.id}" ${isFull ? 'disabled' : ''}>
              ${isFull ? 'Shift Full' : 'Apply Volunteer'}
            </button>
            <button type="button" class="btn-primary-small" data-action="match-opp" data-id="${opp.id}">
              Match Volunteers
            </button>
            <button type="button" class="btn-subtle" data-action="edit-opp" data-id="${opp.id}">
              Edit
            </button>
            <button type="button" class="btn-danger-outline" data-action="delete-opp" data-id="${opp.id}">
              Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  // Render Volunteer Skill Matching Results Panel
  renderSkillMatchingPanel() {
    const container = document.getElementById('skill-matching-results');
    if (!container) return;

    if (appState.selectedVolunteerId) {
      const vol = appState.volunteers.find(v => v.id === appState.selectedVolunteerId);
      if (!vol) return;

      const recommendations = SkillMatcher.getRecommendationsForVolunteer(vol, appState.opportunities);

      container.innerHTML = `
        <div class="matcher-header-callout">
          <h4>Skill Match Analysis for Volunteer: <strong>${this.escapeHTML(vol.name)}</strong></h4>
          <p>Skills registered: ${vol.skills.join(', ')}</p>
        </div>
        <div class="matched-recommendations-grid">
          ${recommendations.map(r => {
            const approvedCount = appState.applications.filter(a => a.opportunityId === r.opportunity.id && a.status === 'approved').length;
            const isFull = approvedCount >= r.opportunity.requiredVolunteers;
            const alreadyApplied = appState.volunteerApplicationKeys.has(`${vol.id}_${r.opportunity.id}`);

            return `
              <div class="matched-result-card match-${r.match.level}">
                <div class="match-score-badge">
                  ${r.match.isNA ? 'Open Shift' : `${r.match.score}% Match (${r.match.grade})`}
                </div>
                <h5>${this.escapeHTML(r.opportunity.title)}</h5>
                <p class="text-muted">${r.opportunity.shiftDate} &bull; ${this.escapeHTML(r.opportunity.location)}</p>
                
                <div class="skills-comparison">
                  <div class="matched-group">
                    <strong>Matched Skills:</strong>
                    ${r.match.matchedSkills.length > 0 ? r.match.matchedSkills.map(s => `<span class="skill-tag skill-matched">✓ ${this.escapeHTML(s)}</span>`).join('') : '<span class="text-muted">None</span>'}
                  </div>
                  <div class="missing-group">
                    <strong>Missing Skills:</strong>
                    ${r.match.missingSkills.length > 0 ? r.match.missingSkills.map(s => `<span class="skill-tag skill-missing">✕ ${this.escapeHTML(s)}</span>`).join('') : '<span class="text-muted">All prerequisites satisfied!</span>'}
                  </div>
                </div>

                <button type="button" class="btn-primary-small" style="margin-top: 0.75rem;" 
                  onclick="AppEvents.directApplyVolunteer('${vol.id}', '${r.opportunity.id}')"
                  ${isFull || alreadyApplied ? 'disabled' : ''}>
                  ${alreadyApplied ? 'Already Enrolled' : isFull ? 'Shift Full' : 'Enroll Volunteer for Shift'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (appState.selectedOpportunityId) {
      const opp = appState.opportunities.find(o => o.id === appState.selectedOpportunityId);
      if (!opp) return;

      const approvedCount = appState.applications.filter(a => a.opportunityId === opp.id && a.status === 'approved').length;
      const isFull = approvedCount >= opp.requiredVolunteers;
      const recommendations = SkillMatcher.getRecommendationsForOpportunity(opp, appState.volunteers);

      container.innerHTML = `
        <div class="matcher-header-callout">
          <h4>Candidate Matching for Opportunity: <strong>${this.escapeHTML(opp.title)}</strong></h4>
          <p>Required Skills: ${opp.requiredSkills.length > 0 ? opp.requiredSkills.join(', ') : 'None (Open Participation)'} &bull; Capacity: ${approvedCount}/${opp.requiredVolunteers}</p>
        </div>
        <div class="matched-recommendations-grid">
          ${recommendations.map(r => {
            const alreadyApplied = appState.volunteerApplicationKeys.has(`${r.volunteer.id}_${opp.id}`);

            return `
              <div class="matched-result-card match-${r.match.level}">
                <div class="match-score-badge">
                  ${r.match.isNA ? 'Open Eligibility' : `${r.match.score}% Match (${r.match.grade})`}
                </div>
                <h5>${this.escapeHTML(r.volunteer.name)}</h5>
                <p class="text-muted">${this.escapeHTML(r.volunteer.email)} &bull; Available: ${this.escapeHTML(r.volunteer.availability)}</p>
                
                <div class="skills-comparison">
                  <div class="matched-group">
                    <strong>Matched Skills:</strong>
                    ${r.match.matchedSkills.length > 0 ? r.match.matchedSkills.map(s => `<span class="skill-tag skill-matched">✓ ${this.escapeHTML(s)}</span>`).join('') : '<span class="text-muted">None</span>'}
                  </div>
                  <div class="missing-group">
                    <strong>Missing Skills:</strong>
                    ${r.match.missingSkills.length > 0 ? r.match.missingSkills.map(s => `<span class="skill-tag skill-missing">✕ ${this.escapeHTML(s)}</span>`).join('') : '<span class="text-muted">None</span>'}
                  </div>
                </div>

                <button type="button" class="btn-primary-small" style="margin-top: 0.75rem;" 
                  onclick="AppEvents.directApplyVolunteer('${r.volunteer.id}', '${opp.id}')"
                  ${isFull || alreadyApplied ? 'disabled' : ''}>
                  ${alreadyApplied ? 'Already Enrolled' : isFull ? 'Shift Full' : 'Assign Candidate to Shift'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="empty-state-card">
          <p>Select a volunteer or opportunity from above to run the rule-based skill matching engine.</p>
        </div>
      `;
    }
  },

  // Render Integrity Sentinel Section View
  renderIntegritySentinelSection() {
    const container = document.getElementById('sentinel-alerts-container');
    if (!container) return;

    let filtered = [...appState.sentinelAlerts];
    const { severity, category } = appState.sentinelFilter;

    if (severity !== 'all') {
      filtered = filtered.filter(a => a.severity === severity);
    }
    if (category !== 'all') {
      filtered = filtered.filter(a => a.category === category);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="sentinel-all-clear-card gt-card" style="padding: 2.5rem; text-align: center;">
          <div class="clear-icon" style="font-size: 2.5rem; color: #10B981; margin-bottom: 0.5rem;">✓</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--color-deep-teal);">Zero Matching Integrity Anomalies</h3>
          <p style="color: var(--color-muted); font-size: 0.9rem;">No records match your selected Sentinel filter criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(a => `
      <div class="sentinel-alert-card severity-${a.severity.toLowerCase()} gt-card">
        <div class="alert-header">
          <div class="alert-title-group">
            <span class="severity-badge badge-${a.severity.toLowerCase()}">${a.severity}</span>
            <span class="alert-category-tag">${a.category}</span>
            <span class="alert-id"><code>${a.id}</code></span>
          </div>
          <span class="alert-date">Detected: ${a.detectionDate}</span>
        </div>
        <div class="alert-body">
          <div class="alert-target"><strong>Entity:</strong> ${this.escapeHTML(a.relatedEntity)}</div>
          <p class="alert-explanation">${this.escapeHTML(a.explanation)}</p>
          <div class="alert-remedy">
            <strong>Recommended Action:</strong> ${this.escapeHTML(a.recommendedAction)}
          </div>
        </div>
      </div>
    `).join('');
  },

  // Render Dynamic Reports View
  renderReports() {
    const container = document.getElementById('reports-summary-container');
    if (!container) return;

    const financials = Analytics.calculateGlobalFinancials(appState.donations, appState.expenses);

    container.innerHTML = `
      <div class="reports-financial-statement gt-card">
        <div class="statement-header">
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--color-deep-teal); margin-bottom: 0.35rem;">GiveTrack™ Financial Reconciliation Statement (Demonstration)</h3>
          <p class="text-muted" style="font-size: 0.85rem;">Generated dynamically on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })} &bull; Demonstration Public Non-Profit Ledger Model &bull; Academic Evaluation</p>
        </div>

        <div class="statement-summary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
          <div class="summary-metric" style="background: var(--color-surface-alt); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-mint-border);">
            <span class="metric-label" style="font-size: 0.8rem; color: var(--color-muted); display: block;">Total Backer Contributions</span>
            <span class="metric-val" style="font-size: 1.3rem; font-weight: 800; color: var(--color-deep-teal);">${Analytics.formatINR(financials.totalDonations)}</span>
          </div>
          <div class="summary-metric" style="background: var(--color-surface-alt); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-mint-border);">
            <span class="metric-label" style="font-size: 0.8rem; color: var(--color-muted); display: block;">Verified Disbursements</span>
            <span class="metric-val" style="font-size: 1.3rem; font-weight: 800; color: var(--color-deep-teal);">${Analytics.formatINR(financials.totalVerifiedExpenses)}</span>
          </div>
          <div class="summary-metric" style="background: var(--color-surface-alt); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-mint-border);">
            <span class="metric-label" style="font-size: 0.8rem; color: var(--color-muted); display: block;">Uncommitted Reserve Balance</span>
            <span class="metric-val text-success" style="font-size: 1.3rem; font-weight: 800;">${Analytics.formatINR(financials.remainingFunds)}</span>
          </div>
          <div class="summary-metric" style="background: var(--color-surface-alt); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-mint-border);">
            <span class="metric-label" style="font-size: 0.8rem; color: var(--color-muted); display: block;">Pending Review Reserve</span>
            <span class="metric-val text-warning" style="font-size: 1.3rem; font-weight: 800;">${Analytics.formatINR(financials.totalPendingExpenses)}</span>
          </div>
        </div>

        <h4 style="margin: 1.75rem 0 0.75rem; font-size: 1.1rem; font-weight: 800; color: var(--color-deep-teal);">Campaign-Wise Financial Breakdown</h4>
        <div class="table-wrap">
          <table class="gt-data-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target</th>
                <th>Total Raised</th>
                <th>Verified Spent</th>
                <th>Remaining Balance</th>
                <th>Reconciliation Status</th>
              </tr>
            </thead>
            <tbody>
              ${appState.campaigns.map(c => {
                const fin = Analytics.getCampaignFinancials(c.id, appState.donations, appState.expenses, appState.campaigns);
                const isBalanced = (fin?.balance || 0) >= 0;
                return `
                  <tr>
                    <td><strong>${this.escapeHTML(c.name)}</strong></td>
                    <td>${Analytics.formatINR(c.target)}</td>
                    <td><strong class="amount-green">${Analytics.formatINR(fin?.raised || 0)}</strong></td>
                    <td>${Analytics.formatINR(fin?.spent || 0)}</td>
                    <td><strong class="${isBalanced ? 'text-success' : 'text-danger'}">${Analytics.formatINR(fin?.balance || 0)}</strong></td>
                    <td>
                      <span class="status-pill status-${isBalanced ? 'verified' : 'rejected'}">
                        ${isBalanced ? 'Reconciled' : 'Deficit'}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Helper to safely escape user text inside generated HTML strings
  escapeHTML(str) {
    if (typeof str !== 'string') return String(str || '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

// ==============================================================================
// 9. FORM VALIDATION & CRUD HANDLERS
// ==============================================================================

const CRUDHandlers = {
  // Campaign Form Submission (Supports Create and Edit)
  async handleSaveCampaign(e) {
    e.preventDefault();
    const form = e.target;

    const id = form.elements['campaign-id'].value.trim() || `CMP-${Date.now().toString().slice(-4)}`;
    const name = form.elements['campaign-name'].value.trim();
    const category = form.elements['campaign-category'].value.trim();
    const target = Number(form.elements['campaign-target'].value) || 0;
    const startDate = form.elements['campaign-start-date'].value;
    const endDate = form.elements['campaign-end-date'].value;
    const description = form.elements['campaign-desc'].value.trim();

    // Preserve existing status if editing
    const existingCampaign = appState.campaigns.find(c => c.id === id);
    const statusSelect = form.elements['campaign-status'];
    const status = statusSelect ? statusSelect.value : (existingCampaign ? existingCampaign.status : 'active');

    // Validation
    if (!name || name.length < 3) {
      ToastNotification.error('Campaign name must be at least 3 characters long.');
      return;
    }
    if (target <= 0) {
      ToastNotification.error('Fundraising target must be greater than ₹0.');
      return;
    }
    if (!startDate || !endDate) {
      ToastNotification.error('Start and End dates are required.');
      return;
    }
    if (endDate < startDate) {
      ToastNotification.error('Campaign end date cannot be earlier than start date.');
      return;
    }

    const campaignObj = createCampaign({
      id,
      name,
      category,
      target,
      startDate,
      endDate,
      description,
      status
    });

    UIFeedback.showLoading('Saving campaign to storage...');
    try {
      await storageService.saveCampaign(campaignObj);
      await AppEvents.reloadAllState();
      ModalManager.closeAll();
      ToastNotification.success(`Campaign "${name}" saved successfully.`);
    } catch (err) {
      ToastNotification.error(err.message, () => CRUDHandlers.handleSaveCampaign(e));
    } finally {
      UIFeedback.hideLoading();
    }
  },

  // Donation Form Submission (Supports Create and Edit)
  async handleSaveDonation(e) {
    e.preventDefault();
    const form = e.target;

    const id = form.elements['donation-id']?.value.trim() || `DON-${Date.now().toString().slice(-4)}`;
    const donorName = form.elements['donor-name'].value.trim();
    const campaignId = form.elements['donation-campaign'].value;
    const amount = Number(form.elements['donation-amount'].value) || 0;
    const date = form.elements['donation-date'].value || new Date().toISOString().split('T')[0];
    const paymentMethod = form.elements['donation-method'].value;
    const transactionRef = form.elements['donation-tx-ref'].value.trim().toUpperCase();

    // Validation
    if (!donorName || donorName.length < 2) {
      ToastNotification.error('Please enter a valid donor name.');
      return;
    }
    if (amount <= 0) {
      ToastNotification.error('Donation amount must be greater than ₹0.');
      return;
    }
    if (!campaignId) {
      ToastNotification.error('Please select a campaign.');
      return;
    }

    // Campaign Restrictions: Prevent donations to completed or inactive campaigns
    const targetCampaign = appState.campaigns.find(c => c.id === campaignId);
    if (!targetCampaign || targetCampaign.status !== 'active') {
      ToastNotification.error(`Donations can only be recorded for active campaigns. Campaign "${targetCampaign ? targetCampaign.name : campaignId}" is currently ${targetCampaign ? targetCampaign.status : 'inactive'}.`);
      return;
    }

    if (!transactionRef || transactionRef.length < 5) {
      ToastNotification.error('Please provide a valid transaction reference code (min 5 characters).');
      return;
    }

    // Duplicate transaction reference check:
    // Operates for both new and edited donations, excluding the current record ID!
    const dup = appState.donations.find(d => d.transactionRef.trim().toUpperCase() === transactionRef && d.id !== id);
    if (dup) {
      ToastNotification.error(`Transaction Reference "${transactionRef}" has already been logged on donation record ${dup.id}. Duplicates are strictly rejected.`);
      return;
    }

    // Maintain donor ID continuity: lookup existing donor ID by matching name
    let donorId = form.elements['donor-id']?.value.trim();
    const isEdit = appState.donations.some(d => d.id === id);
    if (!isEdit || !donorId) {
      const existingDonorDonation = appState.donations.find(d => d.donorName.trim().toLowerCase() === donorName.toLowerCase());
      if (existingDonorDonation) {
        donorId = existingDonorDonation.donorId;
      } else {
        const nextNum = appState.donations.reduce((max, d) => {
          const match = d.donorId && d.donorId.match(/\d+/);
          return match ? Math.max(max, parseInt(match[0], 10)) : max;
        }, 100);
        donorId = `DNR-${nextNum + 1}`;
      }
    }

    const donationObj = createDonation({
      id,
      donorId,
      donorName,
      campaignId,
      amount,
      date,
      paymentMethod,
      transactionRef
    });

    UIFeedback.showLoading('Recording donation voucher...');
    try {
      await storageService.saveDonation(donationObj);
      await AppEvents.reloadAllState();
      ModalManager.closeAll();
      ToastNotification.success(`Donation of ${Analytics.formatINR(amount)} from ${donorName} recorded.`);
    } catch (err) {
      ToastNotification.error(err.message, () => CRUDHandlers.handleSaveDonation(e));
    } finally {
      UIFeedback.hideLoading();
    }
  },

  // Expense Form Submission (Supports Create and Edit)
  async handleSaveExpense(e) {
    e.preventDefault();
    const form = e.target;

    const id = form.elements['expense-id']?.value.trim() || `EXP-${Date.now().toString().slice(-4)}`;
    const campaignId = form.elements['expense-campaign'].value;
    const title = form.elements['expense-title'].value.trim();
    const category = form.elements['expense-category'].value;
    const amount = Number(form.elements['expense-amount'].value) || 0;
    const date = form.elements['expense-date'].value || new Date().toISOString().split('T')[0];
    const receiptRef = form.elements['expense-receipt-ref'].value.trim();
    const recordedBy = form.elements['expense-recorded-by']?.value.trim() || 'Field Coordinator';
    const description = form.elements['expense-desc']?.value.trim() || '';

    // Validation
    if (!title || title.length < 3) {
      ToastNotification.error('Expense description title must be at least 3 characters long.');
      return;
    }
    if (amount <= 0) {
      ToastNotification.error('Expense amount must be greater than ₹0.');
      return;
    }
    if (!campaignId) {
      ToastNotification.error('Please select an associated campaign.');
      return;
    }

    // Financial Rule: Only restore previous verified expense amount if original and new campaign IDs are identical!
    const fin = Analytics.getCampaignFinancials(campaignId, appState.donations, appState.expenses, appState.campaigns);
    const existingExpense = appState.expenses.find(x => x.id === id);
    let existingCreditInThisCampaign = 0;
    if (existingExpense && existingExpense.campaignId === campaignId && existingExpense.status === 'verified') {
      existingCreditInThisCampaign = existingExpense.amount;
    }
    const availableBalance = (fin?.balance || 0) + existingCreditInThisCampaign;

    if (amount > availableBalance) {
      ToastNotification.error(
        `Financial Rule Violation: Proposed expense (${Analytics.formatINR(amount)}) exceeds available campaign funds (${Analytics.formatINR(availableBalance)}). Deficit disbursements are blocked.`
      );
      return;
    }

    const expenseObj = createExpense({
      id,
      campaignId,
      title,
      category,
      amount,
      date,
      description,
      receiptRef,
      recordedBy,
      status: 'verified'
    });

    UIFeedback.showLoading('Validating & logging expense voucher...');
    try {
      await storageService.saveExpense(expenseObj);
      await AppEvents.reloadAllState();
      ModalManager.closeAll();
      ToastNotification.success(`Expense voucher ${id} for ${Analytics.formatINR(amount)} logged successfully.`);
    } catch (err) {
      ToastNotification.error(err.message, () => CRUDHandlers.handleSaveExpense(e));
    } finally {
      UIFeedback.hideLoading();
    }
  },

  // Volunteer Registration & Edit Form Submission
  async handleSaveVolunteer(e) {
    e.preventDefault();
    const form = e.target;

    const id = form.elements['vol-id']?.value.trim() || `VOL-${String(appState.volunteers.length + 1).padStart(3, '0')}`;
    const name = form.elements['vol-name'].value.trim();
    const email = form.elements['vol-email'].value.trim();
    const phone = form.elements['vol-phone'].value.trim();
    const availability = form.elements['vol-availability'].value;
    const statusSelect = form.elements['vol-status'];
    const status = statusSelect ? statusSelect.value : 'active';
    const skillsRaw = form.elements['vol-skills'].value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    if (!name || name.length < 2) {
      ToastNotification.error('Please enter a valid volunteer name.');
      return;
    }
    if (!email || !email.includes('@')) {
      ToastNotification.error('Please enter a valid email address.');
      return;
    }
    if (skills.length === 0) {
      ToastNotification.error('Please enter at least one volunteer skill (e.g. Food Distribution, First Aid).');
      return;
    }

    const existingVol = appState.volunteers.find(v => v.id === id);

    const volObj = createVolunteer({
      id,
      name,
      email,
      phone,
      skills,
      availability,
      registrationDate: existingVol ? existingVol.registrationDate : new Date().toISOString().split('T')[0],
      status
    });

    UIFeedback.showLoading('Saving volunteer details...');
    try {
      await storageService.saveVolunteer(volObj);
      await AppEvents.reloadAllState();
      ModalManager.closeAll();
      ToastNotification.success(`Volunteer "${name}" saved successfully.`);
    } catch (err) {
      ToastNotification.error(err.message, () => CRUDHandlers.handleSaveVolunteer(e));
    } finally {
      UIFeedback.hideLoading();
    }
  },

  // Opportunity Shift Form Submission
  async handleSaveOpportunity(e) {
    e.preventDefault();
    const form = e.target;

    const id = form.elements['opp-id']?.value.trim() || `OPP-${Date.now().toString().slice(-4)}`;
    const title = form.elements['opp-title'].value.trim();
    const campaignId = form.elements['opp-campaign']?.value.trim() || 'CMP-CFSP-01';
    const description = form.elements['opp-desc'].value.trim();
    const location = form.elements['opp-location'].value.trim();
    const shiftDate = form.elements['opp-date'].value;
    const shiftTiming = form.elements['opp-timing'].value.trim();
    const requiredVolunteers = Number(form.elements['opp-capacity'].value) || 1;
    const status = form.elements['opp-status']?.value || 'open';
    const skillsRaw = form.elements['opp-skills'].value;
    const requiredSkills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    if (!title || title.length < 3) {
      ToastNotification.error('Opportunity title must be at least 3 characters long.');
      return;
    }
    if (!location) {
      ToastNotification.error('Please provide a physical shift reporting location.');
      return;
    }
    if (!shiftDate) {
      ToastNotification.error('Please select a shift date.');
      return;
    }
    if (requiredVolunteers <= 0) {
      ToastNotification.error('Volunteer capacity must be at least 1.');
      return;
    }

    const oppObj = createOpportunity({
      id,
      campaignId,
      title,
      description,
      requiredSkills,
      requiredVolunteers,
      location,
      shiftDate,
      shiftTiming,
      status
    });

    UIFeedback.showLoading('Saving opportunity shift...');
    try {
      await storageService.saveOpportunity(oppObj);
      await AppEvents.reloadAllState();
      ModalManager.closeAll();
      ToastNotification.success(`Opportunity shift "${title}" saved successfully.`);
    } catch (err) {
      ToastNotification.error(err.message, () => CRUDHandlers.handleSaveOpportunity(e));
    } finally {
      UIFeedback.hideLoading();
    }
  }
};

// ==============================================================================
// 10. MODALS, TOASTS & UI NOTIFICATIONS
// ==============================================================================

const ModalManager = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Accessibility focus trap
    const focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex="0"]');
    if (focusable.length > 0) focusable[0].focus();
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  },

  closeAll() {
    document.querySelectorAll('.app-modal.is-open').forEach(m => {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    });
  }
};

const ToastNotification = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
    }
  },

  clearAll() {
    this.init();
    if (this.container) {
      this.container.innerHTML = '';
    }
  },

  show({ type = 'info', title, message, duration = 4500, onRetry = null }) {
    this.init();
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.setAttribute('role', 'alert');

    let retryBtnHtml = '';
    if (typeof onRetry === 'function') {
      retryBtnHtml = '<button type="button" class="toast-retry-btn">Retry Action</button>';
    }

    toast.innerHTML = `
      <div class="toast-content" style="flex: 1;">
        ${title ? `<strong style="display:block; margin-bottom: 2px;">${DOMRenderer.escapeHTML(title)}</strong>` : ''}
        <span>${DOMRenderer.escapeHTML(message)}</span>
        ${retryBtnHtml}
      </div>
      <button type="button" class="toast-close-btn" aria-label="Close notification">&times;</button>
    `;

    if (typeof onRetry === 'function') {
      const retryBtn = toast.querySelector('.toast-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          toast.remove();
          onRetry();
        });
      }
    }

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      toast.remove();
    });

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, duration);
    }
  },

  success(msg, title = 'Success') {
    this.show({ type: 'success', title, message: msg });
  },

  error(msg, onRetry = null, title = 'Error') {
    this.show({ type: 'error', title, message: msg, onRetry, duration: 6000 });
  },

  warning(msg, title = 'Warning') {
    this.show({ type: 'warning', title, message: msg });
  },

  info(msg, title = 'Notice') {
    this.show({ type: 'info', title, message: msg });
  }
};

const UIFeedback = {
  overlay: null,

  showLoading(message = 'Processing request...') {
    if (!this.overlay) {
      this.overlay = document.getElementById('global-loading-overlay');
    }
    if (this.overlay) {
      this.overlay.querySelector('.loading-text').textContent = message;
      this.overlay.classList.add('is-loading');
      this.overlay.setAttribute('aria-hidden', 'false');
    }
  },

  hideLoading() {
    if (this.overlay) {
      this.overlay.classList.remove('is-loading');
      this.overlay.setAttribute('aria-hidden', 'true');
    }
  }
};

// ==============================================================================
// 11. EVENT DELEGATION & LISTENER BINDING
// ==============================================================================

const AppEvents = {
  // Navigation switcher between views
  navigateTo(viewId) {
    appState.activeView = viewId;

    // Update active nav links
    document.querySelectorAll('.app-nav-btn, .nav-item').forEach(link => {
      if (link.dataset.view === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle view visibility
    document.querySelectorAll('.app-view-section').forEach(sec => {
      if (sec.id === `view-${viewId}`) {
        sec.classList.add('active-view');
        sec.style.display = 'block';
      } else {
        sec.classList.remove('active-view');
        sec.style.display = 'none';
      }
    });

    // Refresh view specific elements
    if (viewId === 'dashboard') {
      DOMRenderer.renderDashboardMetrics();
      DOMRenderer.renderRecentActivity();
      DOMRenderer.renderSentinelSummaryBanner();
      ChartEngine.renderComparisonBarChart('chart-donations-vs-expenses', appState.campaigns, appState.campaignDonationMap, appState.campaignExpenseMap);
      ChartEngine.renderCategoryAllocation('chart-category-allocation', appState.categorySpendingMap);
    } else if (viewId === 'campaigns') {
      DOMRenderer.renderCampaigns();
    } else if (viewId === 'donations') {
      DOMRenderer.renderDonationsTable();
    } else if (viewId === 'expenses') {
      DOMRenderer.renderExpensesTable();
    } else if (viewId === 'volunteers') {
      DOMRenderer.renderVolunteers();
      DOMRenderer.renderOpportunities();
      DOMRenderer.renderSkillMatchingPanel();
    } else if (viewId === 'sentinel') {
      DOMRenderer.renderIntegritySentinelSection();
    } else if (viewId === 'reports') {
      DOMRenderer.renderReports();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Reload all state from StorageService and refresh active displays
  // Re-throws error to prevent misleading success notifications upon failure
  async reloadAllState() {
    try {
      const [campaigns, donations, expenses, volunteers, opportunities, applications] = await Promise.all([
        storageService.getAllCampaigns(),
        storageService.getAllDonations(),
        storageService.getAllExpenses(),
        storageService.getAllVolunteers(),
        storageService.getAllOpportunities(),
        storageService.getAllApplications()
      ]);

      appState.campaigns = campaigns;
      appState.donations = donations;
      appState.expenses = expenses;
      appState.volunteers = volunteers;
      appState.opportunities = opportunities;
      appState.applications = applications;

      // Rebuild Sets and Maps
      appState.rebuildIndices();

      // Repopulate dynamic dropdown filters based on refreshed data
      DOMRenderer.populateDynamicFilters();

      // Run Integrity Sentinel Audit
      integritySentinel.runFullAudit(
        appState.campaigns,
        appState.donations,
        appState.expenses,
        appState.campaignDonationMap,
        appState.campaignExpenseMap
      );
      appState.sentinelAlerts = integritySentinel.alerts;

      // Re-render active view
      this.navigateTo(appState.activeView);
    } catch (err) {
      ToastNotification.error(`Initialization/Reload failed: ${err.message}`, () => this.reloadAllState());
      throw err;
    }
  },

  // Campaign UI Actions
  openCreateCampaignModal() {
    const form = document.getElementById('form-campaign');
    if (form) form.reset();
    document.getElementById('modal-campaign-title').textContent = 'Create New Campaign';
    document.getElementById('campaign-id').value = `CMP-${Date.now().toString().slice(-4)}`;
    const statusSelect = document.getElementById('campaign-status');
    if (statusSelect) statusSelect.value = 'active';

    ModalManager.open('modal-campaign');
  },

  // Alias for backward compatibility with button handlers
  openAddCampaignModal() {
    return this.openCreateCampaignModal();
  },

  openEditCampaignModal(campaignId) {
    const campaign = appState.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const form = document.getElementById('form-campaign');
    if (!form) return;

    document.getElementById('modal-campaign-title').textContent = 'Edit Campaign';
    form.elements['campaign-id'].value = campaign.id;
    form.elements['campaign-name'].value = campaign.name;
    form.elements['campaign-category'].value = campaign.category;
    form.elements['campaign-target'].value = campaign.target;
    form.elements['campaign-start-date'].value = campaign.startDate;
    form.elements['campaign-end-date'].value = campaign.endDate;
    form.elements['campaign-desc'].value = campaign.description;
    if (form.elements['campaign-status']) {
      form.elements['campaign-status'].value = campaign.status;
    }

    ModalManager.open('modal-campaign');
  },

  openCampaignDetails(campaignId) {
    const campaign = appState.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const fin = Analytics.getCampaignFinancials(campaign.id, appState.donations, appState.expenses, appState.campaigns);
    const modal = document.getElementById('modal-campaign-details');
    if (!modal) return;

    document.getElementById('details-campaign-name').textContent = campaign.name;
    document.getElementById('details-campaign-id').textContent = campaign.id;
    document.getElementById('details-campaign-target').textContent = Analytics.formatINR(campaign.target);
    document.getElementById('details-campaign-raised').textContent = Analytics.formatINR(fin?.raised || 0);
    document.getElementById('details-campaign-spent').textContent = Analytics.formatINR(fin?.spent || 0);
    document.getElementById('details-campaign-balance').textContent = Analytics.formatINR(fin?.balance || 0);
    document.getElementById('details-campaign-desc').textContent = campaign.description;

    ModalManager.open('modal-campaign-details');
  },

  promptDeleteCampaign(campaignId) {
    const campaign = appState.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    // Safe Archival Protection: Check financial transactions rule
    const hasDonations = appState.donations.some(d => d.campaignId === campaignId);
    const hasExpenses = appState.expenses.some(e => e.campaignId === campaignId);

    if (hasDonations || hasExpenses) {
      ToastNotification.warning(
        `Cannot delete campaign "${campaign.name}" because active donation or expense ledger transactions are linked to it. Financial audit rules prohibit deletion of transactional accounts.`,
        'Safe Archival Protection'
      );
      return;
    }

    if (confirm(`Are you sure you want to delete campaign "${campaign.name}" (${campaign.id})? This cannot be undone.`)) {
      UIFeedback.showLoading('Deleting campaign...');
      storageService.deleteCampaign(campaignId)
        .then(() => {
          appState.deleteCampaignFromState(campaignId); // Demonstrates Map.prototype.delete()
          return this.reloadAllState();
        })
        .then(() => ToastNotification.success(`Campaign "${campaign.name}" deleted.`))
        .catch(err => ToastNotification.error(err.message))
        .finally(() => UIFeedback.hideLoading());
    }
  },

  // Donation UI Actions
  openAddDonationModal() {
    const form = document.getElementById('form-donation');
    if (form) form.reset();
    document.getElementById('modal-donation-title').textContent = 'Record Donor Contribution';
    document.getElementById('donation-id').value = `DON-${Date.now().toString().slice(-4)}`;
    document.getElementById('donation-tx-ref').value = `TXN-UPI-${Math.floor(100000 + Math.random() * 900000)}`;
    document.getElementById('donation-date').value = getLocalTodayDateString();

    DOMRenderer.populateDynamicFilters();
    ModalManager.open('modal-donation');
  },

  openEditDonationModal(donationId) {
    const donation = appState.donations.find(d => d.id === donationId);
    if (!donation) return;

    const form = document.getElementById('form-donation');
    if (!form) return;

    document.getElementById('modal-donation-title').textContent = 'Edit Donation Record';

    DOMRenderer.populateDynamicFilters();

    form.elements['donation-id'].value = donation.id;
    form.elements['donor-name'].value = donation.donorName;
    form.elements['donor-id'].value = donation.donorId;
    form.elements['donation-campaign'].value = donation.campaignId;
    form.elements['donation-amount'].value = donation.amount;
    form.elements['donation-date'].value = donation.date;
    form.elements['donation-method'].value = donation.paymentMethod;
    form.elements['donation-tx-ref'].value = donation.transactionRef;

    ModalManager.open('modal-donation');
  },

  promptDeleteDonation(donationId) {
    const donation = appState.donations.find(d => d.id === donationId);
    if (!donation) return;

    if (confirm(`Confirm deletion of donation record ${donation.id} for ${Analytics.formatINR(donation.amount)} from ${donation.donorName}?`)) {
      UIFeedback.showLoading('Removing donation record...');
      storageService.deleteDonation(donationId)
        .then(() => {
          appState.deleteDonationFromState(donationId); // Demonstrates Set.prototype.delete()
          return this.reloadAllState();
        })
        .then(() => ToastNotification.success(`Donation record ${donation.id} removed.`))
        .catch(err => ToastNotification.error(err.message))
        .finally(() => UIFeedback.hideLoading());
    }
  },

  // Expense UI Actions
  openAddExpenseModal() {
    const form = document.getElementById('form-expense');
    if (form) form.reset();
    document.getElementById('modal-expense-title').textContent = 'Log Expenditure Voucher';
    document.getElementById('expense-id').value = `EXP-${Date.now().toString().slice(-4)}`;
    document.getElementById('expense-date').value = getLocalTodayDateString();

    DOMRenderer.populateDynamicFilters();
    ModalManager.open('modal-expense');
  },

  openEditExpenseModal(expenseId) {
    const expense = appState.expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const form = document.getElementById('form-expense');
    if (!form) return;

    document.getElementById('modal-expense-title').textContent = 'Edit Expense Voucher';

    DOMRenderer.populateDynamicFilters();

    form.elements['expense-id'].value = expense.id;
    form.elements['expense-campaign'].value = expense.campaignId;
    form.elements['expense-title'].value = expense.title;
    form.elements['expense-category'].value = expense.category;
    form.elements['expense-amount'].value = expense.amount;
    form.elements['expense-date'].value = expense.date;
    form.elements['expense-receipt-ref'].value = expense.receiptRef;
    form.elements['expense-desc'].value = expense.description;

    ModalManager.open('modal-expense');
  },

  promptDeleteExpense(expenseId) {
    const expense = appState.expenses.find(e => e.id === expenseId);
    if (!expense) return;

    if (confirm(`Confirm deletion of expense voucher ${expense.id} for ${Analytics.formatINR(expense.amount)}?`)) {
      UIFeedback.showLoading('Removing expense voucher...');
      storageService.deleteExpense(expenseId)
        .then(() => this.reloadAllState())
        .then(() => ToastNotification.success(`Expense voucher ${expense.id} removed.`))
        .catch(err => ToastNotification.error(err.message))
        .finally(() => UIFeedback.hideLoading());
    }
  },

  // Volunteer UI Actions
  openRegisterVolunteerModal() {
    const form = document.getElementById('form-volunteer');
    if (form) form.reset();
    const titleEl = document.getElementById('modal-vol-reg-title');
    if (titleEl) titleEl.textContent = 'Register Community Volunteer';
    const idInput = document.getElementById('vol-id');
    if (idInput) idInput.value = `VOL-${String(appState.volunteers.length + 1).padStart(3, '0')}`;
    ModalManager.open('modal-volunteer');
  },

  openEditVolunteerModal(volunteerId) {
    const vol = appState.volunteers.find(v => v.id === volunteerId);
    if (!vol) return;

    const form = document.getElementById('form-volunteer');
    if (!form) return;

    const titleEl = document.getElementById('modal-vol-reg-title');
    if (titleEl) titleEl.textContent = 'Edit Volunteer Details';

    form.elements['vol-id'].value = vol.id;
    form.elements['vol-name'].value = vol.name;
    form.elements['vol-email'].value = vol.email;
    form.elements['vol-phone'].value = vol.phone;
    form.elements['vol-skills'].value = vol.skills.join(', ');
    form.elements['vol-availability'].value = vol.availability;
    if (form.elements['vol-status']) {
      form.elements['vol-status'].value = vol.status;
    }

    ModalManager.open('modal-volunteer');
  },

  promptDeleteVolunteer(volunteerId) {
    const vol = appState.volunteers.find(v => v.id === volunteerId);
    if (!vol) return;

    // Check if volunteer has linked applications
    const hasApps = appState.applications.some(a => a.volunteerId === volunteerId);
    if (hasApps) {
      ToastNotification.warning(
        `Cannot delete volunteer "${vol.name}" because they have active shift enrollment records. Remove or reassign enrollments first.`,
        'Linked Records Protection'
      );
      return;
    }

    if (confirm(`Confirm deletion of volunteer record "${vol.name}" (${vol.id})?`)) {
      UIFeedback.showLoading('Removing volunteer record...');
      storageService.deleteVolunteer(volunteerId)
        .then(() => {
          appState.deleteVolunteerFromState(volunteerId); // Demonstrates Set.prototype.delete()
          return this.reloadAllState();
        })
        .then(() => ToastNotification.success(`Volunteer "${vol.name}" deleted.`))
        .catch(err => ToastNotification.error(err.message))
        .finally(() => UIFeedback.hideLoading());
    }
  },

  // Opportunity UI Actions
  openCreateOpportunityModal() {
    const form = document.getElementById('form-opportunity');
    if (form) form.reset();
    const titleEl = document.getElementById('modal-opportunity-title');
    if (titleEl) titleEl.textContent = 'Create Opportunity Shift';
    const idInput = document.getElementById('opp-id');
    if (idInput) idInput.value = `OPP-${Date.now().toString().slice(-4)}`;

    const campSelect = document.getElementById('opp-campaign');
    if (campSelect) {
      campSelect.innerHTML = appState.campaigns.map(c => `<option value="${c.id}">${DOMRenderer.escapeHTML(c.name)}</option>`).join('');
    }

    ModalManager.open('modal-opportunity');
  },

  openEditOpportunityModal(opportunityId) {
    const opp = appState.opportunities.find(o => o.id === opportunityId);
    if (!opp) return;

    const form = document.getElementById('form-opportunity');
    if (!form) return;

    const titleEl = document.getElementById('modal-opportunity-title');
    if (titleEl) titleEl.textContent = 'Edit Opportunity Shift';

    const campSelect = document.getElementById('opp-campaign');
    if (campSelect) {
      campSelect.innerHTML = appState.campaigns.map(c => `<option value="${c.id}"${c.id === opp.campaignId ? ' selected' : ''}>${DOMRenderer.escapeHTML(c.name)}</option>`).join('');
    }

    form.elements['opp-id'].value = opp.id;
    form.elements['opp-title'].value = opp.title;
    form.elements['opp-location'].value = opp.location;
    form.elements['opp-date'].value = opp.shiftDate;
    form.elements['opp-timing'].value = opp.shiftTiming;
    form.elements['opp-capacity'].value = opp.requiredVolunteers;
    form.elements['opp-skills'].value = opp.requiredSkills.join(', ');
    form.elements['opp-desc'].value = opp.description;
    if (form.elements['opp-status']) {
      form.elements['opp-status'].value = opp.status;
    }

    ModalManager.open('modal-opportunity');
  },

  promptDeleteOpportunity(opportunityId) {
    const opp = appState.opportunities.find(o => o.id === opportunityId);
    if (!opp) return;

    // Check if opportunity has linked applications
    const hasApps = appState.applications.some(a => a.opportunityId === opportunityId);
    if (hasApps) {
      ToastNotification.warning(
        `Cannot delete opportunity "${opp.title}" because active volunteer applications are linked to this shift. Remove enrollments first.`,
        'Linked Shift Protection'
      );
      return;
    }

    if (confirm(`Confirm deletion of opportunity "${opp.title}" (${opp.id})?`)) {
      UIFeedback.showLoading('Removing opportunity shift...');
      storageService.deleteOpportunity(opportunityId)
        .then(() => this.reloadAllState())
        .then(() => ToastNotification.success(`Opportunity "${opp.title}" deleted.`))
        .catch(err => ToastNotification.error(err.message))
        .finally(() => UIFeedback.hideLoading());
    }
  },

  selectVolunteerForMatching(volunteerId) {
    appState.selectedVolunteerId = volunteerId;
    appState.selectedOpportunityId = null;
    DOMRenderer.renderVolunteers();
    DOMRenderer.renderSkillMatchingPanel();

    const panel = document.getElementById('skill-matching-results');
    if (panel) panel.scrollIntoView({ behavior: 'smooth' });
  },

  selectOpportunityForMatching(opportunityId) {
    appState.selectedOpportunityId = opportunityId;
    appState.selectedVolunteerId = null;
    DOMRenderer.renderOpportunities();
    DOMRenderer.renderSkillMatchingPanel();

    const panel = document.getElementById('skill-matching-results');
    if (panel) panel.scrollIntoView({ behavior: 'smooth' });
  },

  openApplyModal(opportunityId) {
    const opp = appState.opportunities.find(o => o.id === opportunityId);
    if (!opp) return;

    const select = document.getElementById('apply-volunteer-select');
    if (select) {
      select.innerHTML = '<option value="" disabled selected>Select Active Volunteer</option>' + 
        appState.volunteers
          .filter(v => v.status === 'active')
          .map(v => `<option value="${v.id}">${DOMRenderer.escapeHTML(v.name)} (${v.skills.join(', ')})</option>`).join('');
    }

    document.getElementById('apply-opp-id').value = opp.id;
    document.getElementById('apply-opp-title').textContent = opp.title;
    ModalManager.open('modal-apply-opportunity');
  },

  // Direct application / shift assignment with comprehensive validation
  async directApplyVolunteer(volunteerId, opportunityId) {
    // 1. Volunteer exists
    const vol = appState.volunteers.find(v => v.id === volunteerId);
    if (!vol) {
      ToastNotification.error('Volunteer not found.');
      throw new Error('Volunteer not found.');
    }

    // 2. Volunteer is active
    if (vol.status !== 'active') {
      const err = `Volunteer "${vol.name}" is currently ${vol.status}. Only active volunteers can be assigned to shifts.`;
      ToastNotification.error(err);
      throw new Error(err);
    }

    // 3. Opportunity exists
    const opp = appState.opportunities.find(o => o.id === opportunityId);
    if (!opp) {
      ToastNotification.error('Opportunity shift not found.');
      throw new Error('Opportunity shift not found.');
    }

    // 4. Opportunity is open
    if (opp.status !== 'open') {
      const err = `Shift "${opp.title}" is currently ${opp.status} and not accepting new enrollments.`;
      ToastNotification.error(err);
      throw new Error(err);
    }

    // 5. Opportunity has available capacity (enforced inside JS function)
    const approvedCount = appState.applications.filter(a => a.opportunityId === opportunityId && a.status === 'approved').length;
    if (approvedCount >= opp.requiredVolunteers) {
      const err = `Shift "${opp.title}" is already at full capacity (${approvedCount}/${opp.requiredVolunteers} volunteers enrolled).`;
      ToastNotification.error(err);
      throw new Error(err);
    }

    // 6. Volunteer has not already applied
    const key = `${volunteerId}_${opportunityId}`;
    if (appState.volunteerApplicationKeys.has(key)) {
      const err = 'This volunteer has already applied or been assigned to this shift. Duplicate applications are blocked.';
      ToastNotification.warning(err);
      throw new Error(err);
    }

    const appObj = createApplication({
      id: `APP-${Date.now().toString().slice(-4)}`,
      volunteerId,
      opportunityId,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'approved'
    });

    UIFeedback.showLoading('Confirming volunteer shift enrollment...');
    try {
      await storageService.saveApplication(appObj);
      await this.reloadAllState();
      ToastNotification.success(`Volunteer "${vol.name}" successfully enrolled for "${opp.title}"!`);
      return { success: true, application: appObj };
    } catch (err) {
      ToastNotification.error(err.message);
      throw err;
    } finally {
      UIFeedback.hideLoading();
    }
  },

  // Reset demo data to default baseline
  async promptResetDemoData() {
    if (confirm('Reset all GiveTrack ledger records and demo data to original baseline? Any newly added campaigns, donations, and expenses will be restored.')) {
      UIFeedback.showLoading('Resetting ledger state to baseline...');
      try {
        await storageService.resetAllToSeed();
        await this.reloadAllState();
        ToastNotification.success('Demo data restored to verified baseline.');
      } catch (err) {
        ToastNotification.error(`Reset failed: ${err.message}`);
      } finally {
        UIFeedback.hideLoading();
      }
    }
  },

  // Alias for backward compatibility with button handlers
  resetDemoData() {
    return this.promptResetDemoData();
  },

  // Toggle simulated failure for evaluation demonstration
  toggleSimulatedNetworkFailure() {
    storageService.setForceFailure(!storageService.forceFailure);
    const status = storageService.forceFailure ? 'ENABLED (Next async operation will fail)' : 'DISABLED (Normal operations)';
    ToastNotification.info(`Simulated network failure is now ${status}.`);

    const btn = document.getElementById('btn-toggle-failure');
    if (btn) {
      btn.textContent = storageService.forceFailure ? '⚠️ Network Error: ON' : '⚡ Network Error: OFF';
      btn.classList.toggle('active-error-mode', storageService.forceFailure);
    }
  },

  // Alias for backward compatibility with button handlers
  toggleSimulatedFailure() {
    return this.toggleSimulatedNetworkFailure();
  },

  // Centralized Event Delegation across the application
  bindDelegatedListeners() {
    // 1. Navigation Event Delegation
    const nav = document.querySelector('.main-navigation');
    if (nav) {
      nav.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-view]');
        if (btn) {
          e.preventDefault();
          this.navigateTo(btn.dataset.view);
        }
      });
    }

    // 2. Campaigns Grid Event Delegation
    const campGrid = document.getElementById('campaigns-grid-container');
    if (campGrid) {
      campGrid.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === 'details') this.openCampaignDetails(id);
        if (action === 'edit') this.openEditCampaignModal(id);
        if (action === 'delete') this.promptDeleteCampaign(id);
      });
    }

    // 3. Donations Table Event Delegation
    const donTbody = document.getElementById('donations-table-body');
    if (donTbody) {
      donTbody.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === 'edit-donation') this.openEditDonationModal(id);
        if (action === 'delete-donation') this.promptDeleteDonation(id);
      });
    }

    // 4. Expenses Table Event Delegation
    const expTbody = document.getElementById('expenses-table-body');
    if (expTbody) {
      expTbody.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === 'edit-expense') this.openEditExpenseModal(id);
        if (action === 'delete-expense') this.promptDeleteExpense(id);
      });
    }

    // 5. Volunteers Grid Event Delegation
    const volGrid = document.getElementById('volunteers-grid-container');
    if (volGrid) {
      volGrid.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === 'match-volunteer') this.selectVolunteerForMatching(id);
        if (action === 'edit-volunteer') this.openEditVolunteerModal(id);
        if (action === 'delete-volunteer') this.promptDeleteVolunteer(id);
      });
    }

    // 6. Opportunities Grid Event Delegation
    const oppGrid = document.getElementById('opportunities-grid-container');
    if (oppGrid) {
      oppGrid.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === 'apply-opp') this.openApplyModal(id);
        if (action === 'match-opp') this.selectOpportunityForMatching(id);
        if (action === 'edit-opp') this.openEditOpportunityModal(id);
        if (action === 'delete-opp') this.promptDeleteOpportunity(id);
      });
    }
  },

  escapeHTML(str) {
    return DOMRenderer.escapeHTML(str);
  }
};

// ==============================================================================
// 12. APPLICATION BOOTSTRAP & INITIALIZATION
// ==============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('%c GiveTrack Lab 3 Initialising... %c 100% Vanilla JavaScript Engine ', 'background: #073F3D; color: #EFFAF8; font-weight: bold; padding: 4px;', 'background: #0C8277; color: #FFFFFF; padding: 4px;');

  // Ensure storage has baseline data
  storageService.initStorageIfEmpty();

  // Bind Form Submit Handlers
  const formCampaign = document.getElementById('form-campaign');
  if (formCampaign) formCampaign.addEventListener('submit', CRUDHandlers.handleSaveCampaign);

  const formDonation = document.getElementById('form-donation');
  if (formDonation) formDonation.addEventListener('submit', CRUDHandlers.handleSaveDonation);

  const formExpense = document.getElementById('form-expense');
  if (formExpense) formExpense.addEventListener('submit', CRUDHandlers.handleSaveExpense);

  const formVolunteer = document.getElementById('form-volunteer');
  if (formVolunteer) formVolunteer.addEventListener('submit', CRUDHandlers.handleSaveVolunteer);

  const formOpportunity = document.getElementById('form-opportunity');
  if (formOpportunity) formOpportunity.addEventListener('submit', CRUDHandlers.handleSaveOpportunity);

  const formApply = document.getElementById('form-apply-opportunity');
  if (formApply) {
    formApply.addEventListener('submit', async (e) => {
      e.preventDefault();
      const oppId = document.getElementById('apply-opp-id').value;
      const volId = document.getElementById('apply-volunteer-select').value;
      if (!volId) {
        ToastNotification.error('Please select a volunteer.');
        return;
      }
      await AppEvents.directApplyVolunteer(volId, oppId);
      ModalManager.closeAll();
    });
  }

  // Bind Search and Filter Listeners
  // Campaign Filters
  const searchCampaign = document.getElementById('filter-campaign-search');
  if (searchCampaign) {
    searchCampaign.addEventListener('input', (e) => {
      appState.campaignFilter.search = e.target.value;
      DOMRenderer.renderCampaigns();
    });
  }
  const catCampaign = document.getElementById('filter-campaign-category');
  if (catCampaign) {
    catCampaign.addEventListener('change', (e) => {
      appState.campaignFilter.category = e.target.value;
      DOMRenderer.renderCampaigns();
    });
  }
  const statusCampaign = document.getElementById('filter-campaign-status');
  if (statusCampaign) {
    statusCampaign.addEventListener('change', (e) => {
      appState.campaignFilter.status = e.target.value;
      DOMRenderer.renderCampaigns();
    });
  }
  const sortCampaign = document.getElementById('filter-campaign-sort');
  if (sortCampaign) {
    sortCampaign.addEventListener('change', (e) => {
      appState.campaignFilter.sortBy = e.target.value;
      DOMRenderer.renderCampaigns();
    });
  }

  // Donation Filters
  const searchDonation = document.getElementById('filter-donation-search');
  if (searchDonation) {
    searchDonation.addEventListener('input', (e) => {
      appState.donationFilter.search = e.target.value;
      DOMRenderer.renderDonationsTable();
    });
  }
  const campDonation = document.getElementById('filter-donation-campaign');
  if (campDonation) {
    campDonation.addEventListener('change', (e) => {
      appState.donationFilter.campaignId = e.target.value;
      DOMRenderer.renderDonationsTable();
    });
  }
  const dateFromDonation = document.getElementById('filter-donation-date-from');
  if (dateFromDonation) {
    dateFromDonation.addEventListener('change', (e) => {
      appState.donationFilter.dateFrom = e.target.value;
      DOMRenderer.renderDonationsTable();
    });
  }
  const dateToDonation = document.getElementById('filter-donation-date-to');
  if (dateToDonation) {
    dateToDonation.addEventListener('change', (e) => {
      appState.donationFilter.dateTo = e.target.value;
      DOMRenderer.renderDonationsTable();
    });
  }
  const sortDonation = document.getElementById('filter-donation-sort');
  if (sortDonation) {
    sortDonation.addEventListener('change', (e) => {
      appState.donationFilter.sortBy = e.target.value;
      DOMRenderer.renderDonationsTable();
    });
  }

  // Expense Filters
  const searchExpense = document.getElementById('filter-expense-search');
  if (searchExpense) {
    searchExpense.addEventListener('input', (e) => {
      appState.expenseFilter.search = e.target.value;
      DOMRenderer.renderExpensesTable();
    });
  }
  const campExpense = document.getElementById('filter-expense-campaign');
  if (campExpense) {
    campExpense.addEventListener('change', (e) => {
      appState.expenseFilter.campaignId = e.target.value;
      DOMRenderer.renderExpensesTable();
    });
  }
  const catExpense = document.getElementById('filter-expense-category');
  if (catExpense) {
    catExpense.addEventListener('change', (e) => {
      appState.expenseFilter.category = e.target.value;
      DOMRenderer.renderExpensesTable();
    });
  }
  const sortExpense = document.getElementById('filter-expense-sort');
  if (sortExpense) {
    sortExpense.addEventListener('change', (e) => {
      appState.expenseFilter.sortBy = e.target.value;
      DOMRenderer.renderExpensesTable();
    });
  }

  // Volunteer Filters
  const searchVolunteer = document.getElementById('filter-volunteer-search');
  if (searchVolunteer) {
    searchVolunteer.addEventListener('input', (e) => {
      appState.volunteerFilter.search = e.target.value;
      DOMRenderer.renderVolunteers();
    });
  }
  const skillVolunteer = document.getElementById('filter-volunteer-skill');
  if (skillVolunteer) {
    skillVolunteer.addEventListener('change', (e) => {
      appState.volunteerFilter.skill = e.target.value;
      DOMRenderer.renderVolunteers();
    });
  }
  const statusVolunteer = document.getElementById('filter-volunteer-status');
  if (statusVolunteer) {
    statusVolunteer.addEventListener('change', (e) => {
      appState.volunteerFilter.status = e.target.value;
      DOMRenderer.renderVolunteers();
    });
  }

  // Sentinel Filters
  const sevSentinel = document.getElementById('filter-sentinel-severity');
  if (sevSentinel) {
    sevSentinel.addEventListener('change', (e) => {
      appState.sentinelFilter.severity = e.target.value;
      DOMRenderer.renderIntegritySentinelSection();
    });
  }
  const catSentinel = document.getElementById('filter-sentinel-category');
  if (catSentinel) {
    catSentinel.addEventListener('change', (e) => {
      appState.sentinelFilter.category = e.target.value;
      DOMRenderer.renderIntegritySentinelSection();
    });
  }

  // Bind Event Delegation
  AppEvents.bindDelegatedListeners();

  // Modal Backdrop Click & Escape Key Handlers
  document.querySelectorAll('.app-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        ModalManager.close(modal.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ModalManager.closeAll();
    }
  });

  // Initial Data Load & Render
  try {
    await AppEvents.reloadAllState();
  } catch (err) {
    console.error('Initial state load failed:', err);
  }
});

// Explicit global attachments for window scope and test harnesses
if (typeof window !== 'undefined') {
  window.AppEvents = AppEvents;
  window.ModalManager = ModalManager;
  window.storageService = storageService;
  window.appState = appState;
  window.integritySentinel = integritySentinel;
  window.ToastNotification = ToastNotification;
  window.SkillMatcher = SkillMatcher;
  window.DOMRenderer = DOMRenderer;
  window.Analytics = Analytics;
}
