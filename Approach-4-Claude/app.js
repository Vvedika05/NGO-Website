(() => {
'use strict';
const inr = n => '₹' + Number(n).toLocaleString('en-IN');
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const state = {
  volunteers: 128,
  spent: 65000,
  campaigns: [
    {id:'school', name:'Every Child in School', raised:42000, goal:60000, icon:'graduation-cap', desc:'Pays for uniforms, books and fees so children in nearby communities can stay enrolled.'},
    {id:'health', name:'Healthy Neighbourhood', raised:28000, goal:50000, icon:'heart-pulse', desc:'Funds monthly health camps, basic medicines and hygiene kits for families.'},
    {id:'green', name:'Green Streets Project', raised:30000, goal:40000, icon:'trees', desc:'Plants and maintains trees along local streets and sets up community compost points.'}
  ],
  expenses: [
    {label:'Education supplies', amt:24000, color:'#073F3D'},
    {label:'Health camps and medicines', amt:18000, color:'#0C8277'},
    {label:'Plantation and street greening', amt:13000, color:'#F59A38'},
    {label:'Operations and administration', amt:6000, color:'#5BB5AA'},
    {label:'Outreach and awareness', amt:4000, color:'#9AD6CD'}
  ],
  donations: [
    {name:'Meera Nair', campaign:'Every Child in School', date:'2026-11-08', amt:5000},
    {name:'Karthik Subramanian', campaign:'Healthy Neighbourhood', date:'2026-11-06', amt:2500},
    {name:'Fatima Sheikh', campaign:'Green Streets Project', date:'2026-11-03', amt:1500},
    {name:'Rohan Mehta', campaign:'Every Child in School', date:'2026-10-29', amt:10000},
    {name:'Priya Iyer', campaign:'Healthy Neighbourhood', date:'2026-10-24', amt:3000},
    {name:'Anonymous donor', campaign:'Green Streets Project', date:'2026-10-18', amt:2000}
  ],
  opps: [
    {name:'Digital Learning Buddy', icon:'laptop', desc:'Help students learn basic computer and internet skills in weekly small-group sessions.', skills:['Teaching','Digital literacy','Patience'], avail:['weekday','flexible'], label:'Weekday evenings, 3 hours a week'},
    {name:'Community Storyteller', icon:'mic', desc:'Meet beneficiaries and volunteers, then write and photograph their stories for our reports.', skills:['Storytelling','Writing','Photography'], avail:['weekend','flexible'], label:'Weekends, 4 hours a week'},
    {name:'Green Streets Volunteer', icon:'sprout', desc:'Plant saplings, water them and organise neighbourhood clean-up drives.', skills:['Gardening','Event coordination','Teamwork'], avail:['weekend','flexible'], label:'Weekends and flexible slots'}
  ]
};
const allSkills = ['Teaching','Digital literacy','Patience','Storytelling','Writing','Photography','Gardening','Event coordination','Teamwork'];
const availOpts = [['weekday','Weekday evenings'],['weekend','Weekends'],['flexible','Flexible']];

const totals = () => {
  const total = state.campaigns.reduce((s, c) => s + c.raised, 0);
  return {total, spent: state.spent, left: total - state.spent};
};

function renderStats() {
  const t = totals();
  const items = [
    ['Total Donations', inr(t.total), 'wallet'], ['Funds Utilised', inr(t.spent), 'receipt'],
    ['Remaining Balance', inr(t.left), 'piggy-bank'], ['Active Volunteers', state.volunteers, 'users']
  ];
  $('#stats').innerHTML = items.map(([l, v, i]) => `
    <div class="bg-white rounded-3xl border border-line shadow-card p-5">
      <span class="w-10 h-10 rounded-2xl bg-mint text-teal grid place-items-center"><i data-lucide="${i}" class="w-5 h-5"></i></span>
      <p class="mt-4 text-sm text-ink/70">${l}</p><p class="font-heading font-extrabold text-teal text-2xl sm:text-3xl">${v}</p></div>`).join('');
  $('#heroTotal').textContent = inr(t.total);
  $('#heroSpent').textContent = inr(t.spent);
  $('#heroLeft').textContent = inr(t.left);
  $('#heroBar').style.width = (t.spent / t.total * 100) + '%';
  $('#donutTotal').textContent = inr(t.total);
  $('#tTotal').textContent = inr(t.total); $('#tSpent').textContent = inr(t.spent); $('#tLeft').textContent = inr(t.left);
}

function renderCampaigns() {
  $('#campaignGrid').innerHTML = state.campaigns.map(c => {
    const pct = Math.round(c.raised / c.goal * 100);
    return `<article class="bg-white rounded-3xl border border-line shadow-card p-6 flex flex-col">
      <span class="w-11 h-11 rounded-2xl bg-mint text-turq grid place-items-center"><i data-lucide="${c.icon}"></i></span>
      <h3 class="font-heading font-bold text-teal text-xl mt-4">${c.name}</h3>
      <p class="text-ink/75 mt-2 flex-1">${c.desc}</p>
      <div class="mt-5 flex justify-between text-sm"><span><b class="font-heading">${inr(c.raised)}</b> raised</span><span class="text-ink/70">of ${inr(c.goal)}</span></div>
      <div class="progress mt-2" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${c.name} progress"><div style="width:${pct}%"></div></div>
      <p class="text-xs text-ink/70 mt-1">${pct}% funded</p>
      <button class="btn btn-accent mt-5" data-donate="${c.id}">Donate</button></article>`;
  }).join('');
  $('#fCampaign').innerHTML = state.campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderExpenses() {
  const max = Math.max(...state.expenses.map(e => e.amt));
  $('#expenseList').innerHTML = state.expenses.map(e => `
    <li><div class="flex justify-between text-sm font-medium"><span><span class="inline-block w-2.5 h-2.5 rounded-full mr-2" style="background:${e.color}"></span>${e.label}</span><span class="font-heading font-bold">${inr(e.amt)}</span></div>
    <div class="progress mt-2"><div style="width:${e.amt / max * 100}%;background:${e.color}"></div></div></li>`).join('');
}

let chart;
function renderChart() {
  const t = totals();
  const data = [...state.expenses.map(e => e.amt), t.left];
  const labels = [...state.expenses.map(e => e.label), 'Remaining balance'];
  const colors = [...state.expenses.map(e => e.color), '#E3EDEB'];
  if (chart) { chart.data.datasets[0].data = data; chart.update(); return; }
  if (typeof Chart === 'undefined') return;
  chart = new Chart($('#donut'), {
    type: 'doughnut',
    data: {labels, datasets: [{data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff'}]},
    options: {cutout: '68%', plugins: {legend: {display: false}, tooltip: {callbacks: {label: c => ` ${c.label}: ${inr(c.parsed)}`}}}}
  });
}

function renderDonations() {
  $('#donationRows').innerHTML = state.donations.slice(0, 8).map(d => `
    <tr class="bg-white"><td class="p-4 font-medium">${esc(d.name)}</td><td class="p-4">${esc(d.campaign)}</td>
    <td class="p-4 whitespace-nowrap">${new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</td>
    <td class="p-4 text-right font-heading font-bold">${inr(d.amt)}</td>
    <td class="p-4"><span class="tag inline-flex items-center gap-1"><i data-lucide="badge-check" class="w-4 h-4 text-turq"></i>Verified</span></td></tr>`).join('');
}

function renderOpps() {
  $('#oppGrid').innerHTML = state.opps.map(o => `
    <article class="bg-white rounded-3xl border border-line shadow-card p-6">
      <span class="w-11 h-11 rounded-2xl bg-mint text-turq grid place-items-center"><i data-lucide="${o.icon}"></i></span>
      <h3 class="font-heading font-bold text-teal text-xl mt-4">${o.name}</h3>
      <p class="text-ink/75 mt-2">${o.desc}</p>
      <div class="mt-4 flex flex-wrap gap-2">${o.skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>
      <p class="mt-4 text-sm flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-orange"></i>${o.label}</p></article>`).join('');
}

// Volunteer matching
const picked = {skills: new Set(), avail: new Set()};
function renderChips() {
  const mk = (id, items, set) => {
    $(id).innerHTML = items.map(([v, l]) => `<button type="button" class="chip" aria-pressed="false" data-v="${v}">${l}</button>`).join('');
    $(id).onclick = e => {
      const b = e.target.closest('.chip'); if (!b) return;
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on); on ? set.add(b.dataset.v) : set.delete(b.dataset.v);
    };
  };
  mk('#skillChips', allSkills.map(s => [s, s]), picked.skills);
  mk('#availChips', availOpts, picked.avail);
}
function match() {
  const out = $('#matchResults');
  if (!picked.skills.size && !picked.avail.size) {
    out.innerHTML = '<p class="rounded-2xl bg-mint p-5 text-teal">Select at least one skill or availability slot to see matches.</p>'; return;
  }
  const scored = state.opps.map(o => {
    const common = o.skills.filter(s => picked.skills.has(s));
    const slot = o.avail.some(a => picked.avail.has(a));
    const skillPart = picked.skills.size ? common.length / o.skills.length : 0;
    const score = Math.round((picked.skills.size && picked.avail.size ? skillPart * 70 + (slot ? 30 : 0) : picked.skills.size ? skillPart * 100 : (slot ? 100 : 0)));
    return {o, common, slot, score};
  }).sort((a, b) => b.score - a.score);
  out.innerHTML = scored.map((m, i) => `
    <div class="rounded-2xl border ${m.score >= 50 ? 'border-turq bg-mint' : 'border-line bg-white'} p-4">
      <div class="flex justify-between items-center gap-3"><h4 class="font-heading font-bold text-teal">${m.o.name}</h4><span class="font-heading font-extrabold ${m.score >= 50 ? 'text-turq' : 'text-ink/60'}">${m.score}%</span></div>
      <p class="text-sm mt-1 text-ink/80">${m.common.length ? 'Matching skills: ' + m.common.join(', ') + '. ' : 'No matching skills yet. '}${picked.avail.size ? (m.slot ? 'Your availability fits.' : 'Your availability does not fit this role.') : ''}</p>
      ${i === 0 && m.score > 0 ? '<p class="text-sm mt-2 font-medium text-teal">Best match for you</p>' : ''}</div>`).join('');
}

// Donation demo
const dlg = $('#donateDlg');
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.style.opacity = 1;
  clearTimeout(toast.id); toast.id = setTimeout(() => t.style.opacity = 0, 3200);
}
function openDonate(id) {
  if (id) $('#fCampaign').value = id;
  dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
}
function refresh() { renderStats(); renderCampaigns(); renderDonations(); renderChart(); lucide.createIcons(); }

document.addEventListener('click', e => {
  const d = e.target.closest('[data-donate]'); if (d) openDonate(d.dataset.donate);
});
$('#closeDlg').onclick = () => dlg.close();
$('#quickAmts').onclick = e => { const b = e.target.closest('[data-amt]'); if (b) $('#fAmount').value = b.dataset.amt; };
$('#donateForm').addEventListener('submit', e => {
  e.preventDefault();
  const amt = Math.floor(Number($('#fAmount').value)), name = $('#fName').value.trim();
  if (!name || !(amt >= 100)) { toast('Enter your name and an amount of at least ₹100.'); return; }
  const c = state.campaigns.find(x => x.id === $('#fCampaign').value);
  c.raised += amt;
  state.donations.unshift({name, campaign: c.name, date: new Date().toISOString().slice(0, 10), amt});
  dlg.close(); $('#donateForm').reset(); refresh();
  toast(`Thank you, ${name}. Your ${inr(amt)} donation to ${c.name} is recorded (demo).`);
});

// Reports
function download(file, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv'})); a.download = file; a.click(); URL.revokeObjectURL(a.href);
}
$('#dlDonations').onclick = () => download('givetrack-donations.csv', [['Donor','Campaign','Date','Amount (INR)','Status'], ...state.donations.map(d => [d.name, d.campaign, d.date, d.amt, 'Verified'])]);
$('#dlExpenses').onclick = () => { const t = totals(); download('givetrack-expenses.csv', [['Category','Amount (INR)'], ...state.expenses.map(e => [e.label, e.amt]), ['Total spent', t.spent], ['Remaining balance', t.left], ['Total donations', t.total]]); };

// Navigation, notifications, privacy
const toggle = (btn, panel) => btn.onclick = () => { const h = panel.classList.toggle('hidden'); btn.setAttribute('aria-expanded', !h); };
toggle($('#menuBtn'), $('#mobileNav')); toggle($('#bellBtn'), $('#bellMenu'));
$('#mobileNav').addEventListener('click', e => { if (e.target.closest('a')) $('#mobileNav').classList.add('hidden'); });
document.addEventListener('click', e => { if (!e.target.closest('#bellBtn,#bellMenu')) $('#bellMenu').classList.add('hidden'); });
$('#privacyLink').onclick = e => { e.preventDefault(); toast('GiveTrack stores no personal data in this demo.'); };
const links = [...document.querySelectorAll('#nav .nav-link')];
const secs = links.map(l => document.querySelector(l.getAttribute('href')));
const spy = () => {
  const y = window.scrollY + 120; let i = 0;
  secs.forEach((s, k) => { if (s.offsetTop <= y) i = k; });
  links.forEach((l, k) => l.classList.toggle('active', k === i));
};
window.addEventListener('scroll', spy, {passive: true});

$('#matchBtn').onclick = match;
renderExpenses(); renderOpps(); renderChips(); refresh(); spy();
})();
