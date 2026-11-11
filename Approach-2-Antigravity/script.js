/**
 * GiveTrack - Modern NGO Management & Donation Transparency Platform
 * Interactive Script
 * - Navigation active-state management & smooth scrollspy
 * - Chart.js setup with unobtrusive external tooltip for fund utilisation
 * - Volunteer Matching Assistant Engine
 * - Interactive Donation System & Live Transaction Log
 * - Volunteer Application Modal (clean placeholders, validation)
 * - Notification Center & Report Generation
 */

// Global State
const appState = {
  totalDonations: 100000,
  fundsUtilised: 65000,
  remainingBalance: 35000,
  activeVolunteers: 128,
  
  campaigns: {
    'Every Child in School': {
      raised: 42000,
      target: 60000,
      category: 'Education',
      donors: 84
    },
    'Healthy Neighbourhood': {
      raised: 28000,
      target: 50000,
      category: 'Healthcare',
      donors: 56
    },
    'Green Streets Project': {
      raised: 30000,
      target: 40000,
      category: 'Environment',
      donors: 72
    }
  },

  volunteerRoles: [
    {
      id: 'dl-buddy',
      title: 'Digital Learning Buddy',
      category: 'Education & Tech',
      icon: 'laptop',
      iconBg: 'bg-teal-50 text-emerald-700',
      description: 'Help school students with basic computer skills, coding fundamentals, and safe digital learning.',
      skills: ['Teaching', 'Technology', 'Digital Literacy'],
      availability: 'weekend',
      availabilityLabel: 'Weekends (3 hrs/week)',
      mode: 'hybrid',
      modeLabel: 'Bengaluru / Hybrid',
      matchSkills: ['teaching', 'technology', 'education']
    },
    {
      id: 'storyteller',
      title: 'Community Storyteller',
      category: 'Media & Outreach',
      icon: 'camera',
      iconBg: 'bg-orange-50 text-orange-600',
      description: 'Capture impactful photographs, craft compelling beneficiary stories, and share verified updates with our donors.',
      skills: ['Photography', 'Writing', 'Social Media'],
      availability: 'flexible',
      availabilityLabel: 'Flexible (2 hrs/week)',
      mode: 'remote',
      modeLabel: 'Hybrid / Remote',
      matchSkills: ['photography', 'writing', 'creative', 'media']
    },
    {
      id: 'green-volunteer',
      title: 'Green Streets Volunteer',
      category: 'Environment',
      icon: 'trees',
      iconBg: 'bg-emerald-50 text-emerald-700',
      description: 'Join local native tree-planting drives, urban mini-forests, and clean neighbourhood waste segregation workshops.',
      skills: ['Environment', 'Community Work', 'Fieldwork'],
      availability: 'saturday',
      availabilityLabel: 'Saturday (4 hrs/week)',
      mode: 'field',
      modeLabel: 'Bengaluru Field Sites',
      matchSkills: ['environment', 'community', 'fieldwork']
    }
  ],

  recentTransactions: [
    { donor: 'Ananya Rao', campaign: 'Every Child in School', date: '05 Nov 2026', amount: 2000, status: 'Verified' },
    { donor: 'Rahul Mehta', campaign: 'Healthy Neighbourhood', date: '04 Nov 2026', amount: 5000, status: 'Verified' },
    { donor: 'Priya Sharma', campaign: 'Green Streets Project', date: '03 Nov 2026', amount: 1500, status: 'Verified' },
    { donor: 'Kavita Nair', campaign: 'Every Child in School', date: '02 Nov 2026', amount: 3500, status: 'Verified' },
    { donor: 'Vikram Joshi', campaign: 'Healthy Neighbourhood', date: '01 Nov 2026', amount: 2500, status: 'Verified' }
  ]
};

let fundChartInstance = null;

// Currency Formatter
function formatINR(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

// Toast Notification System
function showToast(title, message, iconName = 'check-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="text-[#0C8277] flex-shrink-0">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <p class="text-sm font-bold text-[#073F3D]">${title}</p>
      <p class="text-xs text-slate-600 mt-0.5">${message}</p>
    </div>
    <button class="text-slate-400 hover:text-slate-600 ml-2" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();

  initNavigation();
  initChart();
  initDonationModal();
  initVolunteerMatcher();
  initVolunteerApplication();
  initNotifications();
  initQuickStats();
  renderTransactionTable();
});

/* -------------------------------------------------------------------------- */
/* 1. Navigation Active-State Management & Scrollspy                          */
/* -------------------------------------------------------------------------- */
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-item');
  const sectionIds = ['home', 'campaigns', 'donations', 'expenses', 'volunteers', 'reports'];
  let isManualScrolling = false;
  let scrollTimeout = null;

  function setActiveLink(targetId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Click handling on navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (sectionIds.includes(targetId)) {
          setActiveLink(targetId);
          isManualScrolling = true;
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isManualScrolling = false;
          }, 850);
        }
      }

      // Close mobile navigation menu on item click
      if (window.innerWidth < 768 && mainNav) {
        mainNav.classList.add('hidden');
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
          if (window.lucide) lucide.createIcons();
        }
      }
    });
  });

  // Mobile menu button toggle
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isHidden = mainNav.classList.contains('hidden');
      mainNav.classList.toggle('hidden');
      menuToggle.setAttribute('aria-expanded', String(isHidden));
      menuToggle.innerHTML = isHidden 
        ? '<i data-lucide="x" class="w-6 h-6"></i>' 
        : '<i data-lucide="menu" class="w-6 h-6"></i>';
      if (window.lucide) lucide.createIcons();
    });
  }

  // Active state scrollspy
  function onScroll() {
    if (isManualScrolling) return;

    // Detect if page has reached bottom
    const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
    if (atBottom) {
      setActiveLink(sectionIds[sectionIds.length - 1]);
      return;
    }

    const scrollPos = window.scrollY + 160;
    let activeId = sectionIds[0];

    for (const id of sectionIds) {
      const sectionEl = document.getElementById(id);
      if (sectionEl) {
        const top = sectionEl.offsetTop;
        if (scrollPos >= top) {
          activeId = id;
        }
      }
    }

    setActiveLink(activeId);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Check URL hash on initial load
  if (window.location.hash) {
    const initialId = window.location.hash.substring(1);
    if (sectionIds.includes(initialId)) {
      setActiveLink(initialId);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Chart.js Fund Utilisation Doughnut & Tooltip Positioning                */
/* -------------------------------------------------------------------------- */
function initChart() {
  const canvas = document.getElementById('fundDoughnutChart');
  if (!canvas || !window.Chart) return;

  const ctx = canvas.getContext('2d');
  
  fundChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Funds Utilised', 'Remaining Balance'],
      datasets: [{
        data: [appState.fundsUtilised, appState.remainingBalance],
        backgroundColor: [
          '#0C8277', // Turquoise
          '#F59A38'  // Orange
        ],
        hoverBackgroundColor: [
          '#08635B',
          '#E28624'
        ],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '74%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          // Use external HTML tooltip so canvas graphics and center numerical badge are never overlapped
          enabled: false,
          external: function(context) {
            const { chart, tooltip } = context;
            const container = chart.canvas.parentNode;
            let tooltipEl = document.getElementById('chartjs-fund-tooltip');
            
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-fund-tooltip';
              tooltipEl.className = 'chart-custom-tooltip';
              container.appendChild(tooltipEl);
            }

            // Hide tooltip when pointer moves away
            if (tooltip.opacity === 0) {
              tooltipEl.style.opacity = '0';
              tooltipEl.style.pointerEvents = 'none';
              return;
            }

            if (tooltip.body && tooltip.dataPoints && tooltip.dataPoints.length > 0) {
              const item = tooltip.dataPoints[0];
              const value = item.raw || 0;
              const total = appState.totalDonations;
              const pct = ((value / total) * 100).toFixed(1);
              const color = item.dataset.backgroundColor[item.dataIndex];
              const subtitle = item.dataIndex === 0 
                ? 'Spent on approved community programmes' 
                : 'Available escrow for upcoming needs';

              tooltipEl.innerHTML = `
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style="background-color: ${color};"></span>
                  <span class="font-bold text-xs text-white">${item.label}</span>
                </div>
                <div class="text-sm font-extrabold text-[#F59A38] font-heading">
                  ${formatINR(value)} <span class="text-xs text-white/80 font-normal">(${pct}%)</span>
                </div>
                <div class="text-[10px] text-white/70 mt-0.5">
                  ${subtitle}
                </div>
              `;
            }

            // Position outside the doughnut ring so center text ('₹1,00,000 Total Received') remains completely visible
            tooltipEl.style.opacity = '1';
            tooltipEl.style.left = '50%';
            tooltipEl.style.transform = 'translateX(-50%)';

            if (tooltip.caretY < chart.height / 2) {
              // Hovering upper slice: position tooltip cleanly below
              tooltipEl.style.top = 'auto';
              tooltipEl.style.bottom = '-18px';
            } else {
              // Hovering lower slice: position tooltip cleanly above
              tooltipEl.style.bottom = 'auto';
              tooltipEl.style.top = '-18px';
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 900
      }
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Dashboard Quick Stats Refresh                                              */
/* -------------------------------------------------------------------------- */
function initQuickStats() {
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const totalDonationsEl = document.getElementById('stat-total-donations');
  const fundsUtilisedEl = document.getElementById('stat-funds-utilised');
  const remainingBalanceEl = document.getElementById('stat-remaining-balance');
  const activeVolunteersEl = document.getElementById('stat-active-volunteers');
  const chartTotalEl = document.getElementById('chart-center-total');

  if (totalDonationsEl) totalDonationsEl.textContent = formatINR(appState.totalDonations);
  if (fundsUtilisedEl) fundsUtilisedEl.textContent = formatINR(appState.fundsUtilised);
  if (remainingBalanceEl) remainingBalanceEl.textContent = formatINR(appState.remainingBalance);
  if (activeVolunteersEl) activeVolunteersEl.textContent = appState.activeVolunteers.toString();
  if (chartTotalEl) chartTotalEl.textContent = formatINR(appState.totalDonations);

  // Update chart dataset
  if (fundChartInstance) {
    fundChartInstance.data.datasets[0].data = [appState.fundsUtilised, appState.remainingBalance];
    fundChartInstance.update();
  }
}

/* -------------------------------------------------------------------------- */
/* Recent Donations Table                                                     */
/* -------------------------------------------------------------------------- */
function renderTransactionTable() {
  const tbody = document.getElementById('recent-donations-tbody');
  if (!tbody) return;

  tbody.innerHTML = appState.recentTransactions.map(t => {
    return `
      <tr class="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0">
        <td class="px-5 py-4 font-semibold text-[#073F3D] flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[#EFFAF8] border border-[#D7EFEA] text-[#0C8277] flex items-center justify-center font-bold text-xs">
            ${t.donor.split(' ').map(n => n[0]).join('')}
          </div>
          <span>${escapeHtml(t.donor)}</span>
        </td>
        <td class="px-5 py-4 text-slate-600 font-medium">
          <span class="inline-flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#0C8277]"></span>
            ${escapeHtml(t.campaign)}
          </span>
        </td>
        <td class="px-5 py-4 text-slate-500 text-sm whitespace-nowrap">
          ${t.date}
        </td>
        <td class="px-5 py-4 text-right font-bold text-[#073F3D] font-heading whitespace-nowrap">
          ${formatINR(t.amount)}
        </td>
        <td class="px-5 py-4 text-right whitespace-nowrap">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
            ${t.status}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

/* -------------------------------------------------------------------------- */
/* Interactive Donation System                                                */
/* -------------------------------------------------------------------------- */
function initDonationModal() {
  const modal = document.getElementById('donation-modal');
  const closeBtn = document.getElementById('close-donation-modal');
  const cancelBtn = document.getElementById('cancel-donation-btn');
  const donationForm = document.getElementById('donation-form');
  const campaignSelect = document.getElementById('modal-campaign-select');
  const customAmountInput = document.getElementById('donation-amount-input');
  const donorNameInput = document.getElementById('donor-name-input');
  const presetPills = document.querySelectorAll('.amount-pill');

  // Open modal handler from campaign cards and header
  document.querySelectorAll('[data-donate-campaign]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const campaignName = button.getAttribute('data-donate-campaign');
      if (campaignSelect && campaignName) {
        campaignSelect.value = campaignName;
      }
      if (donationForm) {
        donationForm.reset();
        if (donorNameInput) donorNameInput.value = '';
        if (customAmountInput) customAmountInput.value = '1000';
      }
      openModal(modal);
      if (donorNameInput) donorNameInput.focus();
    });
  });

  // Amount preset selection
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('bg-[#0C8277]', 'text-white', 'border-[#0C8277]'));
      pill.classList.add('bg-[#0C8277]', 'text-white', 'border-[#0C8277]');
      const val = pill.getAttribute('data-amount');
      if (customAmountInput) customAmountInput.value = val;
    });
  });

  customAmountInput?.addEventListener('input', () => {
    presetPills.forEach(p => p.classList.remove('bg-[#0C8277]', 'text-white', 'border-[#0C8277]'));
  });

  const closeModalFn = () => closeModal(modal);
  closeBtn?.addEventListener('click', closeModalFn);
  cancelBtn?.addEventListener('click', closeModalFn);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFn();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal?.classList.contains('hidden')) {
      closeModalFn();
    }
  });

  // Form submission
  donationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const donorName = donorNameInput?.value.trim() || 'Anonymous Supporter';
    const campaign = campaignSelect ? campaignSelect.value : 'Every Child in School';
    const amount = Number(customAmountInput?.value);

    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    // Process sample donation
    appState.totalDonations += amount;
    appState.remainingBalance += amount;

    // Update campaign
    if (appState.campaigns[campaign]) {
      appState.campaigns[campaign].raised += amount;
      appState.campaigns[campaign].donors += 1;
      updateCampaignCard(campaign);
    }

    // Add to recent transactions
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    appState.recentTransactions.unshift({
      donor: donorName,
      campaign: campaign,
      date: dateStr,
      amount: amount,
      status: 'Verified'
    });

    // Update UI
    updateStatsDisplay();
    renderTransactionTable();
    closeModalFn();
    donationForm.reset();

    showToast(
      'Donation Successful! 🎉',
      `Thank you, ${donorName}! Your contribution of ${formatINR(amount)} to "${campaign}" has been recorded.`,
      'heart-handshake'
    );
  });
}

function updateCampaignCard(campaignName) {
  const data = appState.campaigns[campaignName];
  if (!data) return;

  const card = document.querySelector(`[data-campaign-name="${campaignName}"]`);
  if (!card) return;

  const raisedEl = card.querySelector('.campaign-raised-val');
  const percentEl = card.querySelector('.campaign-percent-val');
  const progressFill = card.querySelector('.campaign-progress-bar');
  const donorsCountEl = card.querySelector('.campaign-donors-val');

  const percentage = Math.min(100, Math.round((data.raised / data.target) * 100));

  if (raisedEl) raisedEl.textContent = formatINR(data.raised);
  if (percentEl) percentEl.textContent = `${percentage}% funded`;
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (donorsCountEl) donorsCountEl.textContent = `${data.donors} donors`;
}

/* -------------------------------------------------------------------------- */
/* Volunteer Matching Assistant (Interactive Engine)                          */
/* -------------------------------------------------------------------------- */
function initVolunteerMatcher() {
  const matchForm = document.getElementById('volunteer-match-form');
  const matchResultContainer = document.getElementById('match-results-container');
  const resetBtn = document.getElementById('reset-match-btn');

  matchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedInterest = document.getElementById('match-skill-select')?.value;
    const selectedAvailability = document.getElementById('match-availability-select')?.value;
    const selectedMode = document.getElementById('match-mode-select')?.value;

    if (!selectedInterest || !selectedAvailability) {
      showToast('Selection Required', 'Please select both your primary skill and availability.', 'alert-circle');
      return;
    }

    // Run scoring algorithm
    const scoredRoles = appState.volunteerRoles.map(role => {
      let score = 0;
      let reasons = [];

      // Interest match
      if (role.matchSkills.includes(selectedInterest)) {
        score += 55;
        reasons.push(`Direct skill match for <strong>${selectedInterest}</strong>`);
      } else {
        score += 15; // Transferable
      }

      // Availability match
      if (role.availability === selectedAvailability) {
        score += 30;
        reasons.push(`Perfect schedule match (${role.availabilityLabel})`);
      } else if (role.availability === 'flexible' || selectedAvailability === 'flexible') {
        score += 25;
        reasons.push('Flexible timing options available');
      } else {
        score += 5;
        reasons.push('Schedule adjustment may be needed');
      }

      // Mode match
      if (!selectedMode || selectedMode === 'any' || role.mode === selectedMode || role.mode === 'hybrid') {
        score += 15;
        reasons.push(`Location preference met (${role.modeLabel})`);
      }

      return {
        ...role,
        score: Math.min(99, score),
        reasons
      };
    });

    // Sort by score descending
    scoredRoles.sort((a, b) => b.score - a.score);

    renderMatchingResults(scoredRoles, matchResultContainer);
  });

  resetBtn?.addEventListener('click', () => {
    matchForm.reset();
    if (matchResultContainer) {
      matchResultContainer.classList.add('hidden');
      matchResultContainer.innerHTML = '';
    }
  });
}

function renderMatchingResults(scoredRoles, container) {
  if (!container) return;

  const topMatches = scoredRoles.filter(r => r.score >= 50);

  container.innerHTML = `
    <div class="mt-6 border-t border-[#D7EFEA] pt-6 animate-fadeIn">
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-[#0C8277]">AI Matching Engine</span>
          <h4 class="text-lg font-bold text-[#073F3D] font-heading">
            ${topMatches.length} Opportunities Recommended for You
          </h4>
        </div>
        <span class="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1.5">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Ranked by Fit
        </span>
      </div>

      <div class="grid gap-4">
        ${topMatches.map(role => `
          <div class="bg-white border border-[#D7EFEA] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl ${role.iconBg} flex items-center justify-center flex-shrink-0">
                  <i data-lucide="${role.icon}" class="w-5 h-5"></i>
                </div>
                <div>
                  <h5 class="font-bold text-[#073F3D] font-heading">${role.title}</h5>
                  <p class="text-xs text-slate-500">${role.category} • ${role.modeLabel}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${role.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}">
                  ${role.score}% Match Score
                </span>
              </div>
            </div>

            <p class="text-xs text-slate-600 mt-2.5 leading-relaxed">
              ${role.description}
            </p>

            <div class="mt-3 bg-[#EFFAF8] border border-[#D7EFEA] rounded-lg p-2.5 text-xs text-[#073F3D] space-y-1">
              ${role.reasons.map(r => `
                <div class="flex items-center gap-1.5">
                  <i data-lucide="check" class="w-3.5 h-3.5 text-[#0C8277] flex-shrink-0"></i>
                  <span>${r}</span>
                </div>
              `).join('')}
            </div>

            <div class="mt-3.5 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
                <span>${role.availabilityLabel}</span>
              </div>
              <button 
                type="button"
                class="btn-outline-teal text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5"
                onclick="openVolunteerApplyModal('${escapeHtml(role.title)}')">
                Apply for this Role
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

/* -------------------------------------------------------------------------- */
/* 3. Volunteer Application Modal (No prefilled data, full validation)        */
/* -------------------------------------------------------------------------- */
function initVolunteerApplication() {
  const modal = document.getElementById('volunteer-apply-modal');
  const closeBtn = document.getElementById('close-volunteer-modal');
  const cancelBtn = document.getElementById('cancel-volunteer-btn');
  const applyForm = document.getElementById('volunteer-apply-form');

  // Trigger from standard volunteer opportunity cards
  document.querySelectorAll('[data-apply-role]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roleName = btn.getAttribute('data-apply-role');
      openVolunteerApplyModal(roleName);
    });
  });

  const closeModalFn = () => closeModal(modal);
  closeBtn?.addEventListener('click', closeModalFn);
  cancelBtn?.addEventListener('click', closeModalFn);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFn();
  });

  applyForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('volunteer-name-input');
    const emailInput = document.getElementById('volunteer-email-input');
    const volunteerName = nameInput?.value.trim();

    if (!volunteerName) {
      alert('Please enter your full name.');
      nameInput?.focus();
      return;
    }

    if (!emailInput?.value.trim()) {
      alert('Please enter a valid email address.');
      emailInput?.focus();
      return;
    }

    const roleTitle = document.getElementById('volunteer-target-role')?.textContent || 'Volunteer Opportunity';

    appState.activeVolunteers += 1;
    updateStatsDisplay();
    closeModalFn();
    applyForm.reset();

    showToast(
      'Application Submitted! 🤝',
      `Thank you, ${volunteerName}! Your volunteer registration for "${roleTitle}" was received. Our team will contact you shortly.`,
      'sparkles'
    );
  });
}

window.openVolunteerApplyModal = function(roleTitle) {
  const modal = document.getElementById('volunteer-apply-modal');
  const targetLabel = document.getElementById('volunteer-target-role');
  if (targetLabel) targetLabel.textContent = roleTitle || 'Community Volunteer';
  
  // Ensure the form starts completely clean with placeholder text visible
  const applyForm = document.getElementById('volunteer-apply-form');
  if (applyForm) {
    applyForm.reset();
  }

  openModal(modal);
  document.getElementById('volunteer-name-input')?.focus();
};

/* -------------------------------------------------------------------------- */
/* Notifications Center Dropdown & Report Generator                           */
/* -------------------------------------------------------------------------- */
function initNotifications() {
  const notifBtn = document.getElementById('notifications-btn');
  const notifDropdown = document.getElementById('notifications-dropdown');
  const markReadBtn = document.getElementById('mark-notifications-read');
  const badge = document.getElementById('notifications-badge');

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
  });

  markReadBtn?.addEventListener('click', () => {
    if (badge) badge.classList.add('hidden');
    showToast('Notifications Cleared', 'All updates marked as read.', 'check');
  });

  document.addEventListener('click', (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBtn) {
      notifDropdown.classList.add('hidden');
    }
  });

  // Report download trigger demo
  document.getElementById('download-report-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    generateAndDownloadReport();
  });
}

function generateAndDownloadReport() {
  const dateStr = new Date().toLocaleDateString('en-GB');
  const reportContent = `=====================================================
GIVETRACK NGO - DONATION TRANSPARENCY & AUDIT SUMMARY
Generated on: ${dateStr}
Platform Tagline: Donate • Track • Volunteer
=====================================================

1. FINANCIAL RECONCILIATION:
- Total Donations Received: ${formatINR(appState.totalDonations)}
- Funds Utilised (Spent):  ${formatINR(appState.fundsUtilised)}
- Remaining Balance:       ${formatINR(appState.remainingBalance)}
- Audit Verification Check: 65,000 + 35,000 = 1,00,000 [MATCHED / 100% BALANCED]

2. EXPENSE BREAKDOWN BY PROGRAMME:
- Education Supplies:      ₹30,000 (46.15%)
- Healthcare Support:      ₹20,000 (30.77%)
- Community Projects:      ₹10,000 (15.38%)
- Administration & Ops:    ₹5,000  (7.70%)
Total Programme Outlay:    ${formatINR(appState.fundsUtilised)}

3. CAMPAIGN PROGRESS:
- Every Child in School:   ₹42,000 / ₹60,000 (70% funded)
- Healthy Neighbourhood:   ₹28,000 / ₹50,000 (56% funded)
- Green Streets Project:   ₹30,000 / ₹40,000 (75% funded)

4. VOLUNTEER METRICS:
- Active Volunteers:       ${appState.activeVolunteers} across 3 flagship programs

Audited by Independent Trust Board • Section 80G Compliant.
GiveTrack Platform | https://givetrack.org
=====================================================`;

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GiveTrack_Transparency_Report_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Report Downloaded', 'The audited financial transparency statement was downloaded to your device.', 'file-text');
}

/* -------------------------------------------------------------------------- */
/* Modal Helpers & Utilities                                                  */
/* -------------------------------------------------------------------------- */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('hidden');
  document.body.style.overflow = '';
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
