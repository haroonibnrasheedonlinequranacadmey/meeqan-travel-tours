/* Meeqan CRM frontend scaffold. Demo mode stores non-sensitive sample data in this browser only.
   Supabase is intentionally NOT connected yet. Do not enter real customer/passport/payment data until backend auth + RLS are configured. */
const CRM={modules:[{"id": "dashboard", "label": "Dashboard"}, {"id": "notifications", "label": "Notifications"}, {"id": "customers", "label": "Customers"}, {"id": "bookings", "label": "Bookings"}, {"id": "inquiries", "label": "Inquiries & Leads"}, {"id": "packages", "label": "Packages"}, {"id": "hotels", "label": "Hotels"}, {"id": "flights", "label": "Flights & Ticketing"}, {"id": "transport", "label": "Transport"}, {"id": "visas", "label": "Visa Management"}, {"id": "tours", "label": "Tours & Ziyarat"}, {"id": "payments", "label": "Payments & Invoices"}, {"id": "staff", "label": "Staff Management"}, {"id": "reports", "label": "Reports & Analytics"}, {"id": "website-content", "label": "Website Content"}, {"id": "settings", "label": "Settings"}]};
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const key=()=>`meeqan-crm-${document.body.dataset.page||'data'}`;
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sampleData={
 customers:[{id:'CUS-1001',name:'Sample Customer',email:'customer@example.com',phone:'+92 300 0000000',country:'Pakistan',created:'2026-10-01',status:'Active'}],
 bookings:[{id:'BK-1001',customer:'Sample Customer',service:'Package',date:'2026-11-12',amount:'250000',status:'Pending'}],
 inquiries:[{id:'LD-1001',name:'Sample Lead',contact:'+92 300 0000000',interest:'Umrah package',followup:'2026-10-20',status:'New'}],
 packages:[{id:'PKG-1001',name:'Sample Umrah Package',destination:'Makkah & Madinah',duration:'14 days',price:'350000',status:'Draft'}],
 hotels:[{id:'HTL-1001',name:'Sample Hotel Partner',city:'Makkah',country:'Saudi Arabia',contact:'Not configured',status:'Active'}],
 flights:[{id:'FLT-1001',customer:'Sample Passenger',route:'ISB-JED',date:'2026-11-12',pnr:'Not ticketed',status:'Requested'}],
 transport:[{id:'TR-1001',customer:'Sample Customer',vehicle:'Airport transfer',date:'2026-11-12',driver:'Unassigned',status:'Scheduled'}],
 visas:[{id:'VISA-1001',applicant:'Sample Applicant',country:'Saudi Arabia',type:'Umrah',submitted:'',status:'Documents needed'}],
 tours:[{id:'TOUR-1001',name:'Sample Ziyarat Tour',destination:'Madinah',date:'2026-11-15',capacity:'20',status:'Planned'}],
 payments:[{id:'PAY-1001',reference:'BK-1001',customer:'Sample Customer',amount:'250000',due:'2026-10-30',status:'Pending'}],
 staff:[{id:'STF-1001',name:'CRM Administrator',email:'admin@example.com',role:'Admin',lastactive:'',status:'Active'}],
 'website-content':[{id:'WEB-1001',page:'Home',title:'Homepage content placeholder',updated:'2026-10-18',by:'Admin',status:'Draft'}]
};
function getData(){try{let v=JSON.parse(localStorage.getItem(key()));if(Array.isArray(v))return v;}catch(e){} return structuredClone(sampleData[document.body.dataset.page]||[])}
function saveData(data){localStorage.setItem(key(),JSON.stringify(data))}
function toast(msg){let t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function idFor(page,n){let p=({customers:'CUS',bookings:'BK',inquiries:'LD',packages:'PKG',hotels:'HTL',flights:'FLT',transport:'TR',visas:'VISA',tours:'TOUR',payments:'PAY',staff:'STF','website-content':'WEB'})[page]||'REC';return p+'-'+String(n).padStart(4,'0')}
function renderTable(data){const cfg=PAGE_CONFIG;if(!cfg)return;const q=($('#search')?.value||'').toLowerCase();const rows=data.filter(row=>Object.values(row).join(' ').toLowerCase().includes(q));const tbody=$('#data-rows');if(!tbody)return;tbody.innerHTML=rows.map((row)=>`<tr>${cfg.keys.map(k=>{let val=row[k]??'—';if(k==='status')return `<td><span class="status ${esc(String(val).toLowerCase().replaceAll(' ','-'))}">${esc(val)}</span></td>`;if(k==='amount'||k==='price')return `<td>${esc(Number(val||0).toLocaleString('en-PK'))}</td>`;return `<td>${esc(val)}</td>`}).join('')}<td><button class="btn" data-edit="${esc(row.id)}">Edit</button> <button class="btn danger" data-delete="${esc(row.id)}">Delete</button></td></tr>`).join('')||`<tr><td colspan="${cfg.keys.length+1}" class="empty">No records found. Add a record to get started.</td></tr>`;$('#record-count').textContent=`${rows.length} record${rows.length===1?'':'s'}`}
function initCrud(){const cfg=PAGE_CONFIG;if(!cfg)return;let data=getData();renderTable(data);$('#search')?.addEventListener('input',()=>renderTable(data));$('#add-record')?.addEventListener('click',()=>openForm());$('#record-form')?.addEventListener('submit',e=>{e.preventDefault();const id=$('#record-id').value;const obj={};cfg.fields.forEach((f,i)=>obj[f.key]=$(`[name="${f.key}"]`,e.currentTarget).value.trim());if(id){data=data.map(r=>r.id===id?{...r,...obj}:r);toast('Record updated in demo mode.')}else{obj.id=idFor(document.body.dataset.page,data.length+1);data.unshift(obj);toast('Record added in demo mode.')}saveData(data);renderTable(data);closeForm()});$('#data-rows')?.addEventListener('click',e=>{const edit=e.target.closest('[data-edit]');const del=e.target.closest('[data-delete]');if(edit){const row=data.find(r=>r.id===edit.dataset.edit);openForm(row)}if(del){if(confirm('Delete this demo record?')){data=data.filter(r=>r.id!==del.dataset.delete);saveData(data);renderTable(data);toast('Demo record deleted.')}}});$('#export-csv')?.addEventListener('click',()=>{const csv=[cfg.headers.join(','),...data.map(r=>cfg.keys.map(k=>'"'+String(r[k]??'').replaceAll('"','""')+'"').join(','))].join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=(document.body.dataset.page||'crm')+'.csv';a.click();URL.revokeObjectURL(a.href)});function openForm(row={}){const modal=$('#record-modal');$('#record-id').value=row.id||'';$('#modal-title').textContent=row.id?'Edit '+cfg.singular:'Add '+cfg.singular;const fields=$('#form-fields');fields.innerHTML=cfg.fields.map(f=>`<div class="field ${f.type==='textarea'?'full':''}"><label for="f-${f.key}">${esc(f.label)}</label>${f.type==='select'?`<select id="f-${f.key}" name="${f.key}" required>${f.options.map(o=>`<option ${String(row[f.key]||f.options[0])===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`:f.type==='textarea'?`<textarea id="f-${f.key}" name="${f.key}" rows="3">${esc(row[f.key]||'')}</textarea>`:`<input id="f-${f.key}" name="${f.key}" type="${f.type}" value="${esc(row[f.key]||'')}" ${f.required?'required':''} ${f.type==='number'?'min="0"':''}>`}</div>`).join('');modal.classList.add('open');modal.setAttribute('aria-hidden','false')}function closeForm(){$('#record-modal').classList.remove('open');$('#record-modal').setAttribute('aria-hidden','true')}$('#cancel-form')?.addEventListener('click',closeForm);$('#close-modal')?.addEventListener('click',closeForm);$('#record-modal')?.addEventListener('click',e=>{if(e.target.id==='record-modal')closeForm()})}
function setupLayout(){const sidebar=$('.sidebar'),overlay=$('.mobile-overlay');$('#menu-toggle')?.addEventListener('click',()=>{sidebar.classList.toggle('open');overlay.classList.toggle('open')});overlay?.addEventListener('click',()=>{sidebar.classList.remove('open');overlay.classList.remove('open')});$('#logout')?.addEventListener('click',()=>{sessionStorage.removeItem('meeqan-crm-session');location.replace('crm-login.html')});const page=document.body.dataset.page;$$('.nav a').forEach(a=>{if(a.dataset.page===page)a.classList.add('active')});$('#today')&&( $('#today').textContent=new Date().toLocaleDateString(undefined,{weekday:'short',year:'numeric',month:'short',day:'numeric'}));}
function initLogin(){
 const form=$('#login-form');
 if(sessionStorage.getItem('meeqan-crm-session')==='demo') { location.replace('dashboard.html'); return; }
 form?.addEventListener('submit',e=>{
  e.preventDefault();
  const email=$('#email')?.value.trim();
  const password=$('#password')?.value;
  if(!email||!password){toast('Enter your email and password.');return;}
  // Temporary frontend-only preview access. Replace with Supabase Auth before production.
  sessionStorage.setItem('meeqan-crm-session','demo');
  sessionStorage.setItem('meeqan-crm-user',email);
  location.replace('dashboard.html');
 });
}
function enforceLogin(){
 const page=document.body.dataset.page;
 if(page!=='login' && sessionStorage.getItem('meeqan-crm-session')!=='demo'){
  location.replace('crm-login.html');
  return false;
 }
 return true;
}
function initDashboard(){const sums=[['Total Customers',sampleData.customers.length,'♙'],['Active Bookings',sampleData.bookings.length,'▣'],['Open Inquiries',sampleData.inquiries.length,'✉'],['Pending Payments',sampleData.payments.filter(x=>x.status==='Pending').length,'＄']];const box=$('#dashboard-stats');if(box)box.innerHTML=sums.map(s=>`<div class="stat"><div class="stat-top"><span>${s[0]}</span><span class="stat-icon">${s[2]}</span></div><strong>${s[1]}</strong><small>Sample/demo figures only</small></div>`).join('');}
if(enforceLogin()){if(document.body.dataset.page==='login')initLogin();else {setupLayout();if(document.body.dataset.page==='dashboard')initDashboard();else initCrud();}}
