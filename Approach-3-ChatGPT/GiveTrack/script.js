const money = n => "₹" + Math.round(n).toLocaleString("en-IN");
const donationState = { total: 100000, spent: 65000, remaining: 35000 };
const campaignTotals = {
  "Every Child in School": { raised: 42000, target: 60000 },
  "Healthy Neighbourhood": { raised: 28000, target: 50000 },
  "Green Streets Project": { raised: 30000, target: 40000 }
};
let donationChart;
let toastTimer;

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  const date = new Date();
  document.getElementById("todayLabel").textContent = date.toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"});
  initChart();
  initNavigation();
  initDonation();
  initVolunteerMatching();
  document.getElementById("exportDonations").addEventListener("click", exportDonations);
  document.getElementById("accountButton").addEventListener("click", () => showToast("Demo workspace account"));
  document.getElementById("privacyLink").addEventListener("click", e => { e.preventDefault(); showToast("Demo site: no personal data is stored."); });
});

function initChart(){
  const canvas = document.getElementById("donationChart");
  if (!canvas || !window.Chart) return;
  donationChart = new Chart(canvas, {
    type:"doughnut",
    data:{labels:["Funds utilised","Remaining balance"],datasets:[{data:[donationState.spent,donationState.remaining],backgroundColor:["#0c8277","#f5ad5c"],borderWidth:0,hoverOffset:5,borderRadius:4,spacing:3}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:"78%",plugins:{legend:{display:false},tooltip:{backgroundColor:"#123f3a",padding:10,displayColors:true,callbacks:{label:ctx=>" "+ctx.label+": "+money(ctx.raw)}}}}
  });
}
function updateFinancials(){
  document.getElementById("totalDonations").textContent=money(donationState.total);
  document.getElementById("fundsSpent").textContent=money(donationState.spent);
  document.getElementById("remainingBalance").textContent=money(donationState.remaining);
  document.getElementById("legendRemaining").textContent=money(donationState.remaining);
  document.getElementById("legendPercent").textContent=Math.round(donationState.remaining/donationState.total*100)+"%";
  document.getElementById("reconciliation").textContent=`${money(donationState.spent)} + ${money(donationState.remaining)} = ${money(donationState.total)}`;
  if(donationChart){donationChart.data.datasets[0].data=[donationState.spent,donationState.remaining];donationChart.update();}
}
function initNavigation(){
  const sidebar=document.getElementById("sidebar");
  document.getElementById("menuToggle").addEventListener("click",()=>sidebar.classList.toggle("open"));
  document.addEventListener("click",e=>{if(window.innerWidth<=850 && sidebar.classList.contains("open") && !sidebar.contains(e.target) && !e.target.closest("#menuToggle"))sidebar.classList.remove("open");});
  document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>{
    document.querySelectorAll(".nav-link").forEach(n=>n.classList.remove("active"));
    link.classList.add("active");sidebar.classList.remove("open");
  }));
  const notify=document.getElementById("notificationButton"), pop=document.getElementById("notificationPopover");
  notify.addEventListener("click",e=>{e.stopPropagation();pop.classList.toggle("show");});
  document.addEventListener("click",e=>{if(!e.target.closest(".notification-wrap"))pop.classList.remove("show");});
}
function openModal(id){document.getElementById(id).classList.add("open");document.body.style.overflow="hidden";}
function closeModal(id){document.getElementById(id).classList.remove("open");document.body.style.overflow="";}
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(backdrop=>backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal(backdrop.id);}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal-backdrop.open").forEach(m=>closeModal(m.id));});

function initDonation(){
  document.querySelectorAll(".donate-trigger").forEach(btn=>btn.addEventListener("click",()=>{
    document.getElementById("donationCampaign").value=btn.dataset.campaign;openModal("donationModal");
  }));
  document.querySelectorAll(".quick-amounts button").forEach(btn=>btn.addEventListener("click",()=>document.getElementById("donationAmount").value=btn.dataset.amount));
  document.getElementById("donationForm").addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.getElementById("donorName").value.trim();
    const email=document.getElementById("donorEmail").value.trim();
    const amount=Number(document.getElementById("donationAmount").value);
    const campaign=document.getElementById("donationCampaign").value;
    if(!name||!email||!Number.isFinite(amount)||amount<1){showToast("Please enter valid donation details.");return;}
    if(amount>1000000){showToast("For this demo, donations are capped at ₹10,00,000.");return;}
    donationState.total+=amount;donationState.remaining+=amount;campaignTotals[campaign].raised+=amount;
    updateFinancials();updateCampaign(campaign);
    addDonationRow(name,campaign,amount);
    closeModal("donationModal");
    document.getElementById("successMessage").textContent=`Your demo contribution of ${money(amount)} to ${campaign} has been added to the dashboard. No payment was collected.`;
    openModal("successModal");e.target.reset();document.getElementById("donationAmount").value=500;
  });
}
function updateCampaign(name){
  const cards=[...document.querySelectorAll(".campaign-card")];
  const card=cards.find(c=>c.querySelector("h3")?.textContent===name);
  if(!card)return;
  const item=campaignTotals[name],pct=Math.min(100,item.raised/item.target*100);
  card.querySelector(".raised").textContent=money(item.raised)+" raised";
  card.querySelector(".progress-label span").textContent="of "+money(item.target);
  card.querySelector(".progress-track span").style.width=pct+"%";
  card.querySelector(".campaign-bottom span").textContent=Math.round(pct)+"% funded";
}
function addDonationRow(name,campaign,amount){
  const tbody=document.getElementById("donationRows"), initials=name.split(/\s+/).slice(0,2).map(s=>s[0]).join("").toUpperCase();
  const tr=document.createElement("tr");
  const td1=document.createElement("td"), donor=document.createElement("div"), avatar=document.createElement("span"), strong=document.createElement("strong");
  donor.className="donor-cell";avatar.className="donor-avatar av-mint";avatar.textContent=initials;strong.textContent=name;donor.append(avatar,strong);td1.append(donor);
  const td2=document.createElement("td");td2.textContent=campaign;
  const td3=document.createElement("td");td3.textContent=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
  const td4=document.createElement("td");td4.className="amount-cell";td4.textContent=money(amount);
  const td5=document.createElement("td");const status=document.createElement("span");status.className="status status-verified";status.innerHTML='<i data-lucide="check-circle-2"></i> Demo recorded';td5.append(status);
  tr.append(td1,td2,td3,td4,td5);tbody.prepend(tr);
  document.getElementById("donationCount").textContent=`Showing ${tbody.rows.length} recent donations`;
  if(window.lucide)lucide.createIcons();
}
function exportDonations(){
  const rows=[["Donor","Campaign","Date","Amount","Status"]];
  document.querySelectorAll("#donationRows tr").forEach(tr=>rows.push([...tr.children].map((td,i)=>i===0?td.innerText.replace(/\n/g," "):td.innerText.trim())));
  const csv=rows.map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="givetrack-donations.csv";a.click();URL.revokeObjectURL(url);showToast("Donation records exported as CSV.");
}

const opportunities=[
  {name:"Digital Learning Buddy",skills:["Teaching","Communication","Digital skills"],availability:["Weekends"],desc:"Support students with digital learning."},
  {name:"Community Storyteller",skills:["Writing","Photography","Communication"],availability:["Flexible","Weekdays"],desc:"Share community stories and impact."},
  {name:"Green Streets Volunteer",skills:["Teamwork","Gardening","Community work"],availability:["Weekends","Flexible"],desc:"Join local planting and clean-up drives."}
];
function initVolunteerMatching(){
  document.getElementById("matchForm").addEventListener("submit",e=>{
    e.preventDefault();
    const skills=[...document.querySelectorAll('input[name="skills"]:checked')].map(i=>i.value);
    const availability=document.querySelector('input[name="availability"]:checked')?.value;
    const result=document.getElementById("matchResults");
    if(!skills.length||!availability){result.innerHTML="<p class='match-error'>Please select at least one skill and your availability.</p>";result.classList.add("show");return;}
    const matches=opportunities.map(o=>{
      const common=o.skills.filter(s=>skills.includes(s));
      const timeMatch=o.availability.includes(availability);
      return {...o,score:common.length+(timeMatch?1:0),common,timeMatch};
    }).filter(o=>o.common.length>0&&o.timeMatch).sort((a,b)=>b.score-a.score);
    result.classList.add("show");
    if(!matches.length){result.innerHTML="<h4>No exact match yet</h4><p class='match-error'>Try choosing Flexible availability or adding another skill. You can also browse all three opportunities above.</p>";return;}
    result.innerHTML="<h4>Opportunities that fit your preferences</h4>"+matches.map(m=>`<div class="match-result"><div><strong>${m.name}</strong><div style="color:#8a9b95;font-size:9px;margin-top:3px">${m.common.join(" · ")}</div></div><span>${m.common.length} skill match${m.common.length>1?"es":""}</span></div>`).join("");
  });
  document.querySelectorAll(".apply-trigger").forEach(btn=>btn.addEventListener("click",()=>{
    const role=btn.dataset.role;
    document.querySelectorAll('input[name="skills"]').forEach(i=>i.checked=false);
    document.querySelectorAll('input[name="availability"]').forEach(i=>i.checked=false);
    const mapping={"Digital Learning Buddy":["Teaching","Weekends"],"Community Storyteller":["Writing","Flexible"],"Green Streets Volunteer":["Teamwork","Weekends"]};
    const [skill,time]=mapping[role];
    const skillInput=[...document.querySelectorAll('input[name="skills"]')].find(i=>i.value===skill);if(skillInput)skillInput.checked=true;
    const timeInput=document.querySelector(`input[name="availability"][value="${time}"]`);if(timeInput)timeInput.checked=true;
    document.getElementById("matchResults").classList.remove("show");
    document.getElementById("volunteer-match").scrollIntoView({behavior:"smooth"});
    showToast(`${role} selected as a starting match. Review and submit your preferences.`);
  }));
}
function showToast(message){
  const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),3000);
}
