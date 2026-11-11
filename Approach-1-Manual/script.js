// GiveTrack demo interactions. All figures are sample data for the lab exercise.
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // Mobile navigation toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  menuToggle?.addEventListener('click', () => {
    const isOpen = !mainNav.classList.contains('hidden');
    mainNav.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.innerHTML = isOpen ? '<i data-lucide="menu"></i>' : '<i data-lucide="x"></i>';
    if (window.lucide) lucide.createIcons();
  });
  mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      mainNav.classList.add('hidden');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    }
  }));

  // Donation utilisation chart
  const chartCanvas = document.getElementById('fundChart');
  if (chartCanvas && window.Chart) {
    new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Amount spent', 'Remaining balance'],
        datasets: [{ data: [65000, 35000], backgroundColor: ['#0c8277', '#f5a34e'], borderWidth: 0, hoverOffset: 5 }]
      },
      options: {
        responsive: true,
        cutout: '76%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.label}: ₹${context.raw.toLocaleString('en-IN')}` } } }
      }
    });
  }

  // Donation demo modal
  const modal = document.getElementById('donation-modal');
  const selectedCampaign = document.getElementById('selected-campaign');
  const donationMessage = document.getElementById('donation-message');
  document.querySelectorAll('.donate-button').forEach(button => {
    button.addEventListener('click', () => {
      selectedCampaign.textContent = `You selected: ${button.dataset.campaign}`;
      donationMessage.textContent = '';
      modal.classList.remove('hidden');
      document.getElementById('donation-amount').focus();
    });
  });
  const closeModal = () => modal.classList.add('hidden');
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  document.getElementById('donation-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const amount = Number(document.getElementById('donation-amount').value);
    if (!Number.isFinite(amount) || amount < 1) return;
    donationMessage.textContent = `Thank you! Your ₹${amount.toLocaleString('en-IN')} pledge has been recorded in this demo.`;
    event.target.reset();
  });

  // Volunteer matching assistant: matches the selected interest to sample roles.
  const opportunities = {
    teaching: { title: 'Digital Learning Buddy', detail: 'Your interest in teaching fits this role. Help school students with computer skills and online learning.', when: 'weekend' },
    technology: { title: 'Digital Learning Buddy', detail: 'Your technology skills can help students build confidence with computers and digital tools.', when: 'weekend' },
    creative: { title: 'Community Storyteller', detail: 'Use photography or writing to share stories about local projects and the people they support.', when: 'flexible' },
    environment: { title: 'Green Streets Volunteer', detail: 'Join tree-planting drives and neighbourhood clean-ups in your community.', when: 'saturday' },
    community: { title: 'Green Streets Volunteer', detail: 'Your interest in community work fits our local environmental and neighbourhood activities.', when: 'saturday' }
  };
  document.getElementById('match-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const skill = document.getElementById('skills').value;
    const availability = document.getElementById('availability').value;
    const result = document.getElementById('match-result');
    if (!skill || !availability) return;
    const match = opportunities[skill];
    if (match.when !== availability && availability !== 'flexible') {
      result.innerHTML = `<p class="text-sm font-bold text-brand-900">We found a possible match: ${match.title}</p><p class="mt-1 text-xs leading-5 text-slate-600">${match.detail}</p><p class="mt-2 text-xs text-slate-500">The listed schedule may need to be confirmed with the NGO.</p>`;
    } else {
      result.innerHTML = `<p class="text-sm font-bold text-brand-900"><span class="mr-1">✓</span> Your suggested match: ${match.title}</p><p class="mt-1 text-xs leading-5 text-slate-600">${match.detail}</p><p class="mt-2 text-xs font-semibold text-brand-700">This opportunity matches your selected availability.</p>`;
    }
    result.classList.remove('hidden');
  });
});
