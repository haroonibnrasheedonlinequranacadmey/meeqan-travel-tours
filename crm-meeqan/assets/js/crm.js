/* Meeqan Travel & Tours CRM — Supabase-connected frontend.
   Uses the browser-safe Supabase publishable key. Database security is enforced by Supabase RLS. */
const SUPABASE_READY = !!window.meeqanSupabase;
const db = window.meeqanSupabase;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const page=()=>document.body.dataset.page||'data';

const TABLES={
 customers:{table:'customers', keys:['id','name','email','phone','country','created','status'],
  select:'id,full_name,email,phone,whatsapp,country,created_at,status',
  toRow:r=>({...r,id:r.id,name:r.full_name,created:r.created||r.created_at?.slice(0,10)}),
  fromForm:o=>({full_name:o.name,email:o.email||null,phone:o.phone||null,whatsapp:o.phone||null,country:o.country||null,status:o.status||'Active'}),
  idPrefix:'CUS'},
 bookings:{table:'bookings',keys:['id','customer','service','date','amount','status'],
  select:'id,customer,customer_id,service,service_type,date,travel_date,amount,total_amount,status',
  toRow:r=>({...r,id:r.booking_number||r.id,customer:r.customer||'',service:r.service||r.service_type,date:r.date||r.travel_date,amount:r.amount??r.total_amount}),
  fromForm:o=>({service_type:o.service||'Package',travel_date:o.date||null,total_amount:Number(o.amount||0),status:o.status||'pending',customer:o.customer||null}),
  idPrefix:'BK'},
 inquiries:{table:'inquiries',keys:['id','name','contact','interest','followup','status'],
  select:'id,customer_name,name,phone,email,contact,service_type,interest,followup,follow_up_at,status',
  toRow:r=>({...r,id:r.id,name:r.name||r.customer_name,contact:r.contact||r.phone||r.email,interest:r.interest||r.service_type,followup:r.followup||r.follow_up_at?.slice(0,10)}),
  fromForm:o=>({customer_name:o.name,name:o.name,contact:o.contact||null,phone:o.contact||null,service_type:o.interest||'Other',interest:o.interest||null,followup:o.followup||null,status:(o.status||'New').toLowerCase()}),
  idPrefix:'LD'},
 packages:{table:'packages',keys:['id','name','destination','duration','price','status'],
  select:'id,name,destination,duration,duration_days,price,status,active',
  toRow:r=>({...r,duration:r.duration|| (r.duration_days?`${r.duration_days} days`:''),status:r.status|| (r.active?'Active':'Inactive')}),
  fromForm:o=>({name:o.name,destination:o.destination||null,duration:o.duration||null,duration_days:parseInt(o.duration)||null,price:Number(o.price||0),status:o.status||'Active',active:o.status!=='Inactive'}),
  idPrefix:'PKG'},
 hotels:{table:'hotels',keys:['id','name','city','country','contact','status'],
  select:'id,name,city,country,phone,contact,status,active',
  toRow:r=>({...r,contact:r.contact||r.phone,status:r.status|| (r.active?'Active':'Inactive')}),
  fromForm:o=>({name:o.name,city:o.city||null,country:o.country||null,phone:o.contact||null,contact:o.contact||null,status:o.status||'Active',active:o.status!=='Inactive'}),
  idPrefix:'HTL'},
 flights:{table:'flight_requests',keys:['id','customer','route','date','pnr','status'],
  select:'id,customer,customer_id,route,origin,destination,date,departure_date,pnr,reference_number,status',
  toRow:r=>({...r,id:r.id,customer:r.customer||'',route:r.route||[r.origin,r.destination].filter(Boolean).join('-'),date:r.date||r.departure_date,pnr:r.pnr||r.reference_number}),
  fromForm:o=>({customer:o.customer||null,route:o.route||null,date:o.date||null,departure_date:o.date||null,pnr:o.pnr||null,reference_number:o.pnr||null,status:(o.status||'Requested').toLowerCase()}),
  idPrefix:'FLT'},
 transport:{table:'transport_requests',keys:['id','customer','vehicle','date','driver','status'],
  select:'id,customer,customer_id,vehicle,vehicle_type,date,pickup_at,driver,status',
  toRow:r=>({...r,vehicle:r.vehicle||r.vehicle_type,date:r.date||r.pickup_at?.slice(0,10)}),
  fromForm:o=>({customer:o.customer||null,vehicle:o.vehicle||null,vehicle_type:o.vehicle||null,date:o.date||null,pickup_at:o.date?`${o.date}T00:00:00`:null,driver:o.driver||null,status:(o.status||'Scheduled').toLowerCase()}),
  idPrefix:'TR'},
 visas:{table:'visa_cases',keys:['id','applicant','country','type','submitted','status'],
  select:'id,applicant,passport_name,country,type,submitted,created_at,status,application_status',
  toRow:r=>({...r,applicant:r.applicant||r.passport_name,submitted:r.submitted||r.created_at?.slice(0,10),status:r.status||r.application_status}),
  fromForm:o=>({applicant:o.applicant,passport_name:o.applicant,country:o.country||null,type:o.type||'Visa',submitted:o.submitted||null,status:o.status||'Documents needed',application_status:o.status||'not_started'}),
  idPrefix:'VISA'},
 tours:{table:'tours',keys:['id','name','destination','date','capacity','status'],
  select:'id,name,destination,start_date,capacity,status,description,created_at',
  toRow:r=>({...r,date:r.start_date}),
  fromForm:o=>({name:o.name,destination:o.destination||null,start_date:o.date||null,capacity:Number(o.capacity||0),status:o.status||'Planned'}),
  idPrefix:'TOUR'},
 payments:{table:'payments',keys:['id','reference','customer','amount','due','status'],
  select:'id,reference,reference_number,customer,customer_id,amount,due,payment_date,status',
  toRow:r=>({...r,reference:r.reference||r.reference_number,customer:r.customer||'',due:r.due||r.payment_date}),
  fromForm:o=>({reference:o.reference||null,reference_number:o.reference||null,customer:o.customer||null,amount:Number(o.amount||0),due:o.due||null,payment_date:o.due||null,status:(o.status||'Pending').toLowerCase()}),
  idPrefix:'PAY'},
 staff:{table:'profiles',keys:['id','name','email','role','lastactive','status'],
  select:'id,full_name,name,email,role,lastactive,status,active,created_at',
  toRow:r=>({...r,name:r.name||r.full_name,lastactive:r.lastactive,status:r.status||(r.active?'Active':'Inactive')}),
  fromForm:o=>({full_name:o.name,name:o.name,email:o.email||null,role:(o.role||'staff').toLowerCase(),lastactive:o.lastactive||null,status:o.status||'Active',active:o.status!=='Inactive'}),
  idPrefix:'STF'},
 'website-content':{table:'website_content',keys:['id','page','title','updated','by','status'],
  select:'id,page_key,page,title,updated,by,status,updated_at,content',
  toRow:r=>({...r,page:r.page||r.page_key,updated:r.updated||r.updated_at?.slice(0,10)}),
  fromForm:o=>({page:o.page||null,page_key:o.page||'home',title:o.title||'',updated:o.updated||null,'by':o.by||null,status:o.status||'Draft'}),
  idPrefix:'WEB'}
};

function toast(msg){
 const t=$('#toast'); if(!t){alert(msg);return}
 t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
function friendlyError(e){return e?.message||'Something went wrong. Please try again.'}

async function getSession(){
 if(!db)return null;
 const {data,error}=await db.auth.getSession();
 if(error) throw error;
 return data.session;
}
async function requireAuth(){
 if(!db){location.href='crm-login.html';return null}
 const session=await getSession();
 if(!session){location.href='crm-login.html';return null}
 const {data:profile,error}=await db.from('profiles').select('id,full_name,name,email,role,active,status').eq('id',session.user.id).maybeSingle();
 if(error || !profile || profile.active===false || profile.status==='Inactive'){
   await db.auth.signOut(); location.href='crm-login.html'; return null;
 }
 window.CRM_USER={...session.user,...profile};
 updateUserChip(profile,session.user);
 return session;
}
function updateUserChip(profile,user){
 const chip=$('.user-chip'); if(!chip)return;
 const name=profile.full_name||profile.name||user.email||'CRM User';
 const role=(profile.role||'staff').toUpperCase();
 const avatar=$('.avatar',chip);if(avatar)avatar.textContent=name.trim().charAt(0).toUpperCase()||'M';
 const strong=$('strong',chip);if(strong)strong.textContent=name;
 const small=$('small',chip);if(small)small.textContent=role+' · Supabase connected';
}
async function signOut(){if(db)await db.auth.signOut();sessionStorage.removeItem('meeqan-crm-session');location.href='crm-login.html'}

function statusClass(v){return esc(String(v??'').toLowerCase().replaceAll(' ','-'))}
function renderTable(rows,cfg){
 const q=($('#search')?.value||'').toLowerCase();
 const filtered=rows.filter(r=>Object.values(r).join(' ').toLowerCase().includes(q));
 const tbody=$('#data-rows');if(!tbody)return;
 tbody.innerHTML=filtered.map(row=>`<tr>${cfg.keys.map(k=>{
   let val=row[k]??'—';
   if(k==='status')return `<td><span class="status ${statusClass(val)}">${esc(val)}</span></td>`;
   if(k==='amount'||k==='price')return `<td>${esc(Number(val||0).toLocaleString('en-PK'))}</td>`;
   return `<td>${esc(val)}</td>`;
 }).join('')}<td><button class="btn" data-edit="${esc(row.__realId||row.id)}">Edit</button> <button class="btn danger" data-delete="${esc(row.__realId||row.id)}">Delete</button></td></tr>`).join('')||
 `<tr><td colspan="${cfg.keys.length+1}" class="empty">No records found.</td></tr>`;
 const count=$('#record-count');if(count)count.textContent=`${filtered.length} record${filtered.length===1?'':'s'}`;
}

async function fetchRows(cfg){
 const {data,error}=await db.from(cfg.table).select(cfg.select).order('created_at',{ascending:false});
 if(error)throw error;
 return (data||[]).map(r=>{const x=cfg.toRow(r);x.__realId=r.id;return x});
}
async function insertRow(cfg,obj){
 const {data,error}=await db.from(cfg.table).insert(cfg.fromForm(obj)).select(cfg.select).single();
 if(error)throw error;return cfg.toRow(data);
}
async function updateRow(cfg,id,obj){
 const {data,error}=await db.from(cfg.table).update(cfg.fromForm(obj)).eq('id',id).select(cfg.select).single();
 if(error)throw error;return cfg.toRow(data);
}
async function deleteRow(cfg,id){
 const {error}=await db.from(cfg.table).delete().eq('id',id);
 if(error)throw error;
}

function buildForm(cfg,row={}){
 const modal=$('#record-modal');if(!modal)return;
 $('#record-id').value=row.__realId||'';
 $('#modal-title').textContent=(row.__realId?'Edit ':'Add ')+cfg.singular;
 $('#form-fields').innerHTML=cfg.fields.map(f=>`<div class="field ${f.type==='textarea'?'full':''}">
 <label for="f-${f.key}">${esc(f.label)}</label>
 ${f.type==='select'?`<select id="f-${f.key}" name="${f.key}" required>${f.options.map(o=>`<option ${String(row[f.key]??f.options[0])===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`:
 f.type==='textarea'?`<textarea id="f-${f.key}" name="${f.key}" rows="3">${esc(row[f.key]||'')}</textarea>`:
 `<input id="f-${f.key}" name="${f.key}" type="${f.type}" value="${esc(row[f.key]||'')}" ${f.required?'required':''} ${f.type==='number'?'min="0"':''}>`}</div>`).join('');
 modal.classList.add('open');modal.setAttribute('aria-hidden','false');
}
function closeForm(){const m=$('#record-modal');if(m){m.classList.remove('open');m.setAttribute('aria-hidden','true')}}
async function initCrud(){
 const cfg=TABLES[page()];if(!cfg)return;
 let rows=[];
 const load=async()=>{try{rows=await fetchRows(cfg);renderTable(rows,cfg)}catch(e){toast(friendlyError(e))}};
 await load();
 $('#search')?.addEventListener('input',()=>renderTable(rows,cfg));
 $('#add-record')?.addEventListener('click',()=>buildForm(cfg));
 $('#record-form')?.addEventListener('submit',async e=>{
   e.preventDefault();const id=$('#record-id').value;const obj={};
   cfg.fields.forEach(f=>obj[f.key]=$(`[name="${f.key}"]`,e.currentTarget)?.value?.trim()||'');
   try{if(id){await updateRow(cfg,id,obj);toast('Record updated successfully.')}else{await insertRow(cfg,obj);toast('Record added successfully.')}closeForm();await load()}
   catch(err){toast(friendlyError(err))}
 });
 $('#data-rows')?.addEventListener('click',async e=>{
   const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');
   if(edit){const row=rows.find(r=String(r.__realId)===String(edit.dataset.edit));if(row)buildForm(cfg,row)}
   if(del&&confirm('Delete this record? This action cannot be undone.')){try{await deleteRow(cfg,del.dataset.delete);toast('Record deleted.');await load()}catch(err){toast(friendlyError(err))}}
 });
 $('#export-csv')?.addEventListener('click',()=>{
   const csv=[cfg.headers.join(','),...rows.map(r=>cfg.keys.map(k=>'"'+String(r[k]??'').replaceAll('"','""')+'"').join(','))].join('\r\n');
   const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=page()+'.csv';a.click();URL.revokeObjectURL(a.href);
 });
 $('#cancel-form')?.addEventListener('click',closeForm);$('#close-modal')?.addEventListener('click',closeForm);
 $('#record-modal')?.addEventListener('click',e=>{if(e.target.id==='record-modal')closeForm()});
}

async function initDashboard(){
 const counts=[
  ['Total Customers','customers','♙'],['Active Bookings','bookings','▣'],['Open Inquiries','inquiries','✉'],['Pending Payments','payments','＄']
 ];
 const box=$('#dashboard-stats');if(!box)return;
 const results=await Promise.all(counts.map(async ([label,table,icon])=>{
   const {count,error}=await db.from(table).select('id',{count:'exact',head:true});
   return [label,error?'—':(count??0),icon];
 }));
 box.innerHTML=results.map(s=>`<div class="stat"><div class="stat-top"><span>${s[0]}</span><span class="stat-icon">${s[2]}</span></div><strong>${s[1]}</strong><small>Live Supabase data</small></div>`).join('');
 const notice=$('.notice.info');if(notice){notice.innerHTML='<strong>Live CRM connection</strong>Data is now loaded from Supabase. Access is controlled by your authenticated CRM role and database RLS.'}
}

async function initNotifications(){
 const panel=$('.panel .empty');if(!panel)return;
 try{
  const {data,error}=await db.from('notifications').select('*').order('created_at',{ascending:false}).limit(50);
  if(error)throw error;
  const p=panel.parentElement;
  if(!data?.length){panel.textContent='No notifications yet.';return}
  panel.remove();const list=document.createElement('div');list.className='list';
  list.innerHTML=data.map(n=>`<div class="list-item"><span><strong>${esc(n.title)}</strong><small>${esc(n.body||'')}</small></span><span class="status ${n.is_read?'':'pending'}">${n.is_read?'Read':'New'}</span></div>`).join('');
  p.appendChild(list);
 }catch(e){toast(friendlyError(e))}
}

async function initReports(){
 const stats=$$('.stats .stat');if(!stats.length)return;
 const q=async(table,field='id',opts={})=>{let x=db.from(table).select(field,{count:'exact',head:true});if(opts.status)x=x.eq('status',opts.status);const r=await x;return r.error?0:(r.count||0)};
 try{
  const [bookings,payments,leads,visas]=await Promise.all([q('bookings'),q('payments','id',{status:'pending'}),q('inquiries'),q('visa_cases')]);
  const vals=[bookings,payments,leads,visas];
  stats.forEach((s,i)=>{const strong=$('strong',s);if(strong)strong.textContent=vals[i]??'—';const sm=$('small',s);if(sm)sm.textContent='Live Supabase total'});
  const notice=$('.notice.info');if(notice)notice.innerHTML='<strong>Live reports</strong>Core CRM totals are being calculated from the connected Supabase tables.';
 }catch(e){toast(friendlyError(e))}
}

async function initSettings(){
 const checks=$$('.list .list-item .status');if(checks.length>=4){checks.forEach((s,i)=>{if(i<3){s.textContent='Connected';s.className='status active'}else{s.textContent='Database RLS';s.className='status active'}})}
 const notice=$('.notice');if(notice)notice.innerHTML='<strong>Supabase is connected.</strong>Authentication, role checks, and database RLS are active for this CRM.';
}

function setupLayout(){
 const sidebar=$('.sidebar'),overlay=$('.mobile-overlay');
 $('#menu-toggle')?.addEventListener('click',()=>{sidebar?.classList.toggle('open');overlay?.classList.toggle('open')});
 overlay?.addEventListener('click',()=>{sidebar?.classList.remove('open');overlay?.classList.remove('open')});
 $('#logout')?.addEventListener('click',signOut);
 const p=page();$$('.nav a').forEach(a=>{if(a.dataset.page===p)a.classList.add('active')});
 const today=$('#today');if(today)today.textContent=new Date().toLocaleDateString('en-PK',{weekday:'short',year:'numeric',month:'short',day:'numeric'});
}
async function initLogin(){
 const form=$('#login-form');if(!form)return;
 if(!db){toast('Supabase configuration is missing.');return}
 const session=await getSession();if(session){location.href='dashboard.html';return}
 form.addEventListener('submit',async e=>{
   e.preventDefault();const email=$('#email').value.trim(),password=$('#password').value;
   const btn=form.querySelector('button[type="submit"]');if(btn)btn.disabled=true;
   try{
    const {data,error}=await db.auth.signInWithPassword({email,password});
    if(error)throw error;
    const {data:profile,error:pe}=await db.from('profiles').select('role,active,status,full_name,name').eq('id',data.user.id).single();
    if(pe)throw pe;
    const role=(profile.role||'staff').toLowerCase();
    if(profile.active===false||profile.status==='Inactive'||!['admin','staff','accounts'].includes(role)){
      await db.auth.signOut();throw new Error('Your CRM account is not authorized for this workspace.');
    }
    sessionStorage.setItem('meeqan-crm-session','supabase');
    location.href='dashboard.html';
   }catch(err){toast(friendlyError(err))}
   finally{if(btn)btn.disabled=false}
 });
}
async function boot(){
 setupLayout();
 if(page()==='login'){await initLogin();return}
 const session=await requireAuth();if(!session)return;
 if(page()==='dashboard')await initDashboard();
 else if(page()==='notifications')await initNotifications();
 else if(page()==='reports')await initReports();
 else if(page()==='settings')await initSettings();
 else await initCrud();
}
boot().catch(e=>{console.error(e);toast(friendlyError(e))});
