/* Meeqan CRM — Supabase-connected frontend.
   All CRM records are stored in Supabase. No localStorage/demo records are used. */
const supabaseClient = window.meeqanSupabase;
const CRM = {
  modules: [
    ["dashboard","Dashboard"],["notifications","Notifications"],["customers","Customers"],
    ["inquiries","Inquiries & Leads"],["bookings","Bookings"],["packages","Packages"],
    ["hotels","Hotels"],["flights","Flights & Ticketing"],["transport","Transport"],
    ["visas","Visa Management"],["tours","Tours & Ziyarat"],["payments","Payments & Invoices"],
    ["staff","Staff Management"],["reports","Reports & Analytics"],["website-content","Website Content"],
    ["settings","Settings"]
  ]
};
const PAGE_MAP = {
  customers: {table:"customers", singular:"Customer", order:"created_at", select:"id,customer_code,full_name,email,phone,country,status,notes,created_at,updated_at",
    toUi:r=>({id:r.id,code:r.customer_code||shortId(r.id,"CUS"),name:r.full_name,email:r.email||"",phone:r.phone||"",country:r.country||"",created:dateOnly(r.created_at),status:r.status||"Active",notes:r.notes||""}),
    fromUi:(o)=>({full_name:o.name,email:o.email||null,phone:o.phone||null,country:o.country||null,status:o.status||"Active",notes:o.notes||null})},
  inquiries: {table:"inquiries", singular:"Inquiry", order:"created_at", select:"id,lead_code,full_name,contact,interest,follow_up_date,status,notes,assigned_to,created_at,updated_at",
    toUi:r=>({id:r.id,code:r.lead_code||shortId(r.id,"LD"),name:r.full_name,contact:r.contact||"",interest:r.interest||"",followup:r.follow_up_date||"",status:r.status||"New",notes:r.notes||""}),
    fromUi:(o)=>({full_name:o.name,contact:o.contact||null,interest:o.interest||null,follow_up_date:o.followup||null,status:o.status||"New",notes:o.notes||null})},
  bookings: {table:"bookings", singular:"Booking", order:"created_at", select:"id,booking_code,customer_id,customer_name,service_type,travel_date,amount,currency,status,notes,created_by,created_at,updated_at",
    toUi:r=>({id:r.id,code:r.booking_code||shortId(r.id,"BK"),customer:r.customer_name,service:r.service_type,date:r.travel_date||"",amount:r.amount||0,status:r.status||"Pending",notes:r.notes||""}),
    fromUi:(o)=>({customer_name:o.customer,service_type:o.service,travel_date:o.date||null,amount:Number(o.amount||0),status:o.status||"Pending",notes:o.notes||null})},
  packages: {table:"packages", singular:"Package", order:"created_at", select:"id,name,destination,duration,price,status,description,created_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"PKG"),name:r.name,destination:r.destination||"",duration:r.duration||"",price:r.price||0,status:r.status||"Active",description:r.description||""}),
    fromUi:(o)=>({name:o.name,destination:o.destination||null,duration:o.duration||null,price:Number(o.price||0),status:o.status||"Active",description:o.description||null})},
  hotels: {table:"hotels", singular:"Hotel", order:"created_at", select:"id,name,city,country,contact,status,notes,created_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"HTL"),name:r.name,city:r.city||"",country:r.country||"",contact:r.contact||"",status:r.status||"Active",notes:r.notes||""}),
    fromUi:(o)=>({name:o.name,city:o.city||null,country:o.country||null,contact:o.contact||null,status:o.status||"Active",notes:o.notes||null})},
  flights: {table:"flight_records", singular:"Flight Request", order:"created_at", select:"id,customer_name,route,travel_date,pnr,status,notes,created_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"FLT"),customer:r.customer_name,route:r.route||"",date:r.travel_date||"",pnr:r.pnr||"",status:r.status||"Requested",notes:r.notes||""}),
    fromUi:(o)=>({customer_name:o.customer,route:o.route||null,travel_date:o.date||null,pnr:o.pnr||null,status:o.status||"Requested",notes:o.notes||null})},
  transport: {table:"transport_jobs", singular:"Transport Job", order:"created_at", select:"id,customer_name,vehicle_service,pickup_date,driver,status,notes,created_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"TR"),customer:r.customer_name,vehicle:r.vehicle_service||"",date:r.pickup_date||"",driver:r.driver||"",status:r.status||"Scheduled",notes:r.notes||""}),
    fromUi:(o)=>({customer_name:o.customer,vehicle_service:o.vehicle||null,pickup_date:o.date||null,driver:o.driver||null,status:o.status||"Scheduled",notes:o.notes||null})},
  visas: {table:"visa_applications", singular:"Visa Application", order:"created_at", select:"id,applicant_name,country,visa_type,submitted_date,status,document_notes,created_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"VISA"),applicant:r.applicant_name,country:r.country||"",type:r.visa_type||"",submitted:r.submitted_date||"",status:r.status||"Documents needed",notes:r.document_notes||""}),
    fromUi:(o)=>({applicant_name:o.applicant,country:o.country||null,visa_type:o.type||null,submitted_date:o.submitted||null,status:o.status||"Documents needed",document_notes:o.notes||null})},
  tours: {table:"tours", singular:"Tour", order:"created_at", select:"id,name,destination,start_date,capacity,status,description,created_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"TOUR"),name:r.name,destination:r.destination||"",date:r.start_date||"",capacity:r.capacity||0,status:r.status||"Planned",description:r.description||""}),
    fromUi:(o)=>({name:o.name,destination:o.destination||null,start_date:o.date||null,capacity:Number(o.capacity||0),status:o.status||"Planned",description:o.description||null})},
  payments: {table:"payments", singular:"Payment", order:"created_at", select:"id,reference,customer_name,amount,due_date,status,notes,created_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"PAY"),reference:r.reference,customer:r.customer_name,amount:r.amount||0,due:r.due_date||"",status:r.status||"Pending",notes:r.notes||""}),
    fromUi:(o)=>({reference:o.reference,customer_name:o.customer||"",amount:Number(o.amount||0),due_date:o.due||null,status:o.status||"Pending",notes:o.notes||null})},
  staff: {table:"profiles", singular:"Staff Member", order:"created_at", select:"id,full_name,role,is_active,created_at,updated_at",
    toUi:r=>({id:r.id,name:r.full_name||"",email:"",role:String(r.role||"agent").replace("_"," ").replace(/\\b\\w/g,m=>m.toUpperCase()),lastactive:dateOnly(r.updated_at),status:r.is_active===false?"Inactive":"Active"}),
    fromUi:(o)=>({full_name:o.name,role:String(o.role||"Agent").toLowerCase().replace(" ","_"),is_active:o.status==="Active"})},
  "website-content": {table:"website_content", singular:"Content Item", order:"updated_at", select:"id,page_key,title,content,status,updated_by,updated_at",
    toUi:r=>({id:r.id,code:shortId(r.id,"WEB"),page:r.page_key,title:r.title,content:r.content||"",updated:dateOnly(r.updated_at),by:r.updated_by||"",status:r.status||"Draft"}),
    fromUi:(o)=>({page_key:o.page,title:o.title,content:o.content||null,status:o.status||"Draft"})}
};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateOnly=v=>v?String(v).slice(0,10):"";
const shortId=(id,prefix)=>id?prefix+"-"+String(id).replaceAll("-","").slice(0,8).toUpperCase():"";
let currentSession=null,currentProfile=null,currentData=[],pageConfig=null;

function toast(msg,error=false){
  const t=$("#toast"); if(!t)return;
  t.textContent=msg; t.classList.add("show");
  if(error)t.style.background="#b42318";
  setTimeout(()=>{t.classList.remove("show");t.style.background=""},3200);
}
function role(){return String(currentProfile?.role||"").toLowerCase()}
function canWrite(page){
  if(page==="staff") return role()==="admin";
  if(["customers","inquiries","bookings"].includes(page)) return ["admin","manager","agent"].includes(role());
  if(["packages","hotels","flights","transport","visas","tours"].includes(page)) return ["admin","manager"].includes(role());
  if(page==="payments") return ["admin","manager","finance"].includes(role());
  if(page==="website-content") return ["admin","manager"].includes(role());
  return false;
}
function canDelete(page){return role()==="admin" || (page==="payments" && ["admin","manager","finance"].includes(role()))}
function setConnectionUI(){
  const name=currentProfile?.full_name||currentSession?.user?.email||"CRM User";
  const roleText=(currentProfile?.role||"staff").replace("_"," ");
  $$(".user-chip").forEach(chip=>{
    const strong=chip.querySelector("strong"); const small=chip.querySelector("small"); const avatar=chip.querySelector(".avatar");
    if(strong)strong.textContent=name; if(small)small.textContent=`Supabase connected · ${roleText}`; if(avatar)avatar.textContent=name.trim().charAt(0).toUpperCase()||"M";
  });
  $$(".sidebar-bottom").forEach(el=>el.innerHTML=`CRM Workspace<br><span>Supabase connected · ${esc(roleText)}</span>`);
}
async function enforceLogin(){
  if(!supabaseClient){location.replace("crm-login.html");return false}
  if(document.body.dataset.page==="login")return true;
  const {data:{session},error}=await supabaseClient.auth.getSession();
  if(error||!session){location.replace("crm-login.html");return false}
  const {data:profile,error:profileError}=await supabaseClient.from("profiles").select("id,full_name,role,is_active").eq("id",session.user.id).maybeSingle();
  if(profileError||!profile||profile.is_active===false){await supabaseClient.auth.signOut();location.replace("crm-login.html");return false}
  currentSession=session; currentProfile=profile; setConnectionUI(); return true;
}
async function initLogin(){
  const form=$("#login-form"), resetForm=$("#reset-form"), newPasswordForm=$("#new-password-form");
  if(!form)return;
  const show=which=>{form.hidden=which!=="login";if(resetForm)resetForm.hidden=which!=="reset";if(newPasswordForm)newPasswordForm.hidden=which!=="password"};
  $("#forgot-password")?.addEventListener("click",e=>{e.preventDefault();$("#reset-email").value=$("#email").value.trim();$("#reset-message").textContent="";show("reset")});
  $("#back-login")?.addEventListener("click",e=>{e.preventDefault();show("login")});
  form.addEventListener("submit",async e=>{
    e.preventDefault();const email=$("#email").value.trim(),password=$("#password").value;
    if(!email||!password){toast("Enter your email and password.",true);return}
    const b=form.querySelector('button[type="submit"]');if(b)b.disabled=true;
    const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
    if(b)b.disabled=false;if(error){toast(error.message||"Login failed.",true);return}
    if(!data.user){toast("Login failed. Please try again.",true);return}
    const {data:profile,error:pe}=await supabaseClient.from("profiles").select("id,full_name,role,is_active").eq("id",data.user.id).maybeSingle();
    if(pe||!profile){await supabaseClient.auth.signOut();toast("Your CRM profile is not configured. Run the Supabase setup SQL.",true);return}
    if(profile.is_active===false){await supabaseClient.auth.signOut();toast("Your CRM account is inactive.",true);return}
    location.replace("dashboard.html");
  });
  resetForm?.addEventListener("submit",async e=>{
    e.preventDefault();const email=$("#reset-email").value.trim(),msg=$("#reset-message");msg.textContent="";
    if(!email){msg.textContent="Enter your email address.";return}
    const b=resetForm.querySelector('button[type="submit"]');if(b){b.disabled=true;b.textContent="Sending..."}
    const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
    if(b){b.disabled=false;b.textContent="Send Password Reset Email"}
    msg.textContent=error?(error.message||"Unable to send reset email."):"Password reset email sent. Check your inbox and open the reset link.";
  });
  newPasswordForm?.addEventListener("submit",async e=>{
    e.preventDefault();const password=$("#new-password").value,confirm=$("#confirm-password").value,msg=$("#new-password-message");msg.textContent="";
    if(password.length<6){msg.textContent="Password must be at least 6 characters.";return}
    if(password!==confirm){msg.textContent="Passwords do not match.";return}
    const b=newPasswordForm.querySelector('button[type="submit"]');if(b){b.disabled=true;b.textContent="Updating..."}
    const {error}=await supabaseClient.auth.updateUser({password});
    if(b){b.disabled=false;b.textContent="Update Password"}
    msg.textContent=error?(error.message||"Unable to update password."):"Password updated successfully.";
    if(!error){await supabaseClient.auth.signOut();setTimeout(()=>show("login"),1200)}
  });
  supabaseClient.auth.onAuthStateChange(event=>{if(event==="PASSWORD_RECOVERY")show("password")});
  if(new URLSearchParams(location.hash.replace(/^#/,"")).get("type")==="recovery")show("password");
}
function setupLayout(){
  const sidebar=$(".sidebar"),overlay=$(".mobile-overlay");
  $("#menu-toggle")?.addEventListener("click",()=>{sidebar?.classList.toggle("open");overlay?.classList.toggle("open")});
  overlay?.addEventListener("click",()=>{sidebar?.classList.remove("open");overlay?.classList.remove("open")});
  $("#logout")?.addEventListener("click",async()=>{await supabaseClient.auth.signOut();location.href="crm-login.html"});
  const page=document.body.dataset.page;
  $$(".nav a").forEach(a=>{if(a.dataset.page===page)a.classList.add("active")});
  if($("#today"))$("#today").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",year:"numeric",month:"short",day:"numeric"});
}
async function loadRows(page){
  const cfg=PAGE_MAP[page]; if(!cfg)return [];
  const {data,error}=await supabaseClient.from(cfg.table).select(cfg.select).order(cfg.order,{ascending:false});
  if(error)throw error; return (data||[]).map(cfg.toUi);
}
function renderTable(data){
  const cfg=PAGE_CONFIG;if(!cfg)return;
  const q=($("#search")?.value||"").toLowerCase();
  const rows=data.filter(r=>Object.values(r).join(" ").toLowerCase().includes(q));
  const tbody=$("#data-rows");if(!tbody)return;
  tbody.innerHTML=rows.map(row=>`<tr>${cfg.keys.map(k=>{
    let val=row[k]??"—";
    if(k==="status")return `<td><span class="status ${esc(String(val).toLowerCase().replaceAll(" ","-"))}">${esc(val)}</span></td>`;
    if(k==="amount"||k==="price")return `<td>${esc(Number(val||0).toLocaleString("en-PK"))}</td>`;
    return `<td>${esc(val)}</td>`;
  }).join("")}<td>${canWrite(document.body.dataset.page)?`<button class="btn" data-edit="${esc(row.id)}">Edit</button>`:""} ${canDelete(document.body.dataset.page)?`<button class="btn danger" data-delete="${esc(row.id)}">Delete</button>`:""}</td></tr>`).join("")||`<tr><td colspan="${cfg.keys.length+1}" class="empty">No records found.</td></tr>`;
  if($("#record-count"))$("#record-count").textContent=`${rows.length} record${rows.length===1?"":"s"}`;
}
function openForm(row={}){
  const cfg=PAGE_CONFIG;if(!cfg)return;
  const modal=$("#record-modal"); if(!modal)return;
  $("#record-id").value=row.id||"";$("#modal-title").textContent=row.id?"Edit "+cfg.singular:"Add "+cfg.singular;
  const fields=$("#form-fields");
  fields.innerHTML=cfg.fields.map(f=>{
    const val=row[f.key]??"";
    if(f.type==="select")return `<div class="field"><label for="f-${f.key}">${esc(f.label)}</label><select id="f-${f.key}" name="${f.key}" ${f.required?"required":""}>${f.options.map(o=>`<option value="${esc(o)}" ${String(val||f.options[0])===o?"selected":""}>${esc(o)}</option>`).join("")}</select></div>`;
    if(f.type==="textarea")return `<div class="field full"><label for="f-${f.key}">${esc(f.label)}</label><textarea id="f-${f.key}" name="${f.key}" rows="3">${esc(val)}</textarea></div>`;
    return `<div class="field"><label for="f-${f.key}">${esc(f.label)}</label><input id="f-${f.key}" name="${f.key}" type="${f.type}" value="${esc(val)}" ${f.required?"required":""} ${f.type==="number"?'min="0" step="0.01"':""}></div>`;
  }).join("");
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}
function closeForm(){$("#record-modal")?.classList.remove("open");$("#record-modal")?.setAttribute("aria-hidden","true")}
async function initCrud(){
  const page=document.body.dataset.page; const cfg=PAGE_MAP[page]; if(!cfg)return;
  pageConfig=cfg;
  try{currentData=await loadRows(page);renderTable(currentData)}catch(e){toast(e.message||"Unable to load records from Supabase.",true);renderTable([])}
  $("#search")?.addEventListener("input",()=>renderTable(currentData));
  $("#add-record")?.addEventListener("click",()=>{if(canWrite(page))openForm()});
  $("#record-form")?.addEventListener("submit",async e=>{
    e.preventDefault(); if(!canWrite(page)){toast("Your role does not have permission for this action.",true);return}
    const id=$("#record-id").value; const ui={};
    PAGE_CONFIG.fields.forEach(f=>ui[f.key]=$(`[name="${f.key}"]`,e.currentTarget).value.trim());
    let payload=cfg.fromUi(ui);
    if(!id && page==="customers")payload.created_by=currentSession.user.id;
    if(!id && page==="bookings")payload.created_by=currentSession.user.id;
    if(!id && page==="inquiries" && role()!=="read_only")payload.assigned_to=currentSession.user.id;
    if(!id && page==="website-content")payload.updated_by=currentSession.user.id;
    if(id && page==="website-content")payload.updated_by=currentSession.user.id;
    const q=id?supabaseClient.from(cfg.table).update(payload).eq("id",id):supabaseClient.from(cfg.table).insert(payload);
    const {error}=await q;
    if(error){toast(error.message||"Save failed.",true);return}
    toast(id?"Record updated successfully.":"Record added successfully.");
    closeForm();currentData=await loadRows(page);renderTable(currentData);
  });
  $("#data-rows")?.addEventListener("click",async e=>{
    const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
    if(edit){const row=currentData.find(r=>r.id===edit.dataset.edit);if(row)openForm(row)}
    if(del && canDelete(page) && confirm("Delete this record?")){
      const {error}=await supabaseClient.from(cfg.table).delete().eq("id",del.dataset.delete);
      if(error){toast(error.message||"Delete failed.",true);return}
      toast("Record deleted.");currentData=await loadRows(page);renderTable(currentData);
    }
  });
  $("#export-csv")?.addEventListener("click",()=>{
    const csv=[PAGE_CONFIG.headers.join(","),...currentData.map(r=>PAGE_CONFIG.keys.map(k=>`"${String(r[k]??"").replaceAll('"','""')}"`).join(","))].join("\r\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`${page}.csv`;a.click();URL.revokeObjectURL(a.href);
  });
  $("#cancel-form")?.addEventListener("click",closeForm);$("#close-modal")?.addEventListener("click",closeForm);
  $("#record-modal")?.addEventListener("click",e=>{if(e.target.id==="record-modal")closeForm()});
  if(!canWrite(page))$("#add-record")?.setAttribute("disabled","true");
}
async function initDashboard(){
  const resources=[
    ["customers","Total Customers","♙"],
    ["bookings","Total Bookings","▣"],
    ["inquiries","Total Inquiries","✉"],
    ["payments","Total Payments","＄"],
    ["packages","Total Packages","◇"],
    ["hotels","Total Hotels","⌂"],
    ["flight_records","Total Flights","✈"],
    ["transport_jobs","Total Transport","⇄"],
    ["visa_applications","Total Visas","▤"],
    ["tours","Total Tours","◎"]
  ];
  const results=await Promise.all(resources.map(([table])=>supabaseClient.from(table).select("id",{count:"exact",head:true})));
  const failed=results.find(r=>r.error);
  const box=$("#dashboard-stats");if(!box)return;
  if(failed?.error)toast(failed.error.message||"Unable to load one or more dashboard counts.",true);
  box.innerHTML=resources.map(([table,label,icon],i)=>{
    const result=results[i];
    const value=result.error?0:(result.count??0);
    return `<div class="stat"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong>${value}</strong><small>Live Supabase data</small></div>`;
  }).join("");
}

function startDashboardAutoRefresh(){
  if(document.body.dataset.page!=="dashboard")return;
  const refresh=()=>{if(document.visibilityState==="visible")initDashboard().catch(e=>toast(e.message||"Dashboard refresh failed.",true));};
  window.addEventListener("focus",refresh);
  document.addEventListener("visibilitychange",refresh);
  setInterval(refresh,10000);
}
async function initNotifications(){
  const {data,error}=await supabaseClient.from("notifications").select("id,title,body,category,is_read,created_at").order("created_at",{ascending:false}).limit(50);
  const panel=$(".panel");if(!panel)return;
  if(error){toast(error.message||"Unable to load notifications.",true);return}
  panel.innerHTML=`<div class="panel-head"><h3>Notification center</h3><span class="muted">${data?.length||0} notification${(data?.length||0)===1?"":"s"}</span></div>`;
  if(!data?.length){panel.insertAdjacentHTML("beforeend",`<div class="empty">No notifications right now. New bookings, payments, visa updates, and follow-up reminders will appear here.</div>`);return}
  const list=document.createElement("div");list.className="list";
  list.innerHTML=data.map(n=>`<div class="list-item"><span><strong>${esc(n.title)}</strong><small>${esc(n.body||"")} · ${esc(new Date(n.created_at).toLocaleString())}</small></span><span class="status ${n.is_read?"completed":"new"}">${n.is_read?"Read":"New"}</span></div>`).join("");
  panel.appendChild(list);
  await supabaseClient.from("notifications").update({is_read:true}).eq("is_read",false);
}
async function initReports(){
  const [payments,bookings,inquiries,visas]=await Promise.all([
    supabaseClient.from("payments").select("amount,status"),
    supabaseClient.from("bookings").select("id,status,service_type,travel_date,amount"),
    supabaseClient.from("inquiries").select("id,status,follow_up_date"),
    supabaseClient.from("visa_applications").select("id,status")
  ]);
  const revenue=(payments.data||[]).filter(p=>p.status==="Paid").reduce((s,p)=>s+Number(p.amount||0),0);
  const outstanding=(payments.data||[]).filter(p=>p.status==="Pending"||p.status==="Overdue").reduce((s,p)=>s+Number(p.amount||0),0);
  const conversion=(inquiries.data||[]).length?Math.round((inquiries.data||[]).filter(x=>x.status==="Converted").length/(inquiries.data||[]).length*100):0;
  const visaPipeline=(visas.data||[]).filter(x=>!["Approved","Rejected"].includes(x.status)).length;
  const stats=[["Revenue",`PKR ${revenue.toLocaleString("en-PK")}`,"Live paid payments"],["Bookings",bookings.data?.length||0,"Live booking records"],["Lead conversion",`${conversion}%`,"Converted inquiries"],["Visa pipeline",visaPipeline,"Open visa applications"]];
  const grid=$(".stats");if(grid)grid.innerHTML=stats.map(s=>`<div class="stat"><div class="stat-top">${s[0]}</div><strong>${s[1]}</strong><small>${s[2]}</small></div>`).join("");
  const panel=$(".panel");if(panel)panel.innerHTML=`<div class="panel-head"><h3>Live business reports</h3><span class="muted">Updated from Supabase</span></div>
  <div class="list">
    <div class="list-item"><span><strong>Bookings by date / service</strong><small>${bookings.data?.length||0} total bookings across ${new Set((bookings.data||[]).map(x=>x.service_type)).size} services</small></span><span class="status completed">Live</span></div>
    <div class="list-item"><span><strong>Revenue and outstanding balances</strong><small>Paid PKR ${revenue.toLocaleString("en-PK")} · Outstanding PKR ${outstanding.toLocaleString("en-PK")}</small></span><span class="status completed">Live</span></div>
    <div class="list-item"><span><strong>Inquiry conversion and follow-ups</strong><small>${(inquiries.data||[]).filter(x=>x.status==="Converted").length} converted · ${(inquiries.data||[]).filter(x=>x.follow_up_date).length} with follow-up dates</small></span><span class="status completed">Live</span></div>
    <div class="list-item"><span><strong>Visa application status</strong><small>${visaPipeline} applications currently open</small></span><span class="status completed">Live</span></div>
    <div class="list-item"><span><strong>Staff activity and workload</strong><small>${(await supabaseClient.from("profiles").select("id",{count:"exact",head:true})).count||0} staff profiles configured</small></span><span class="status completed">Live</span></div>
  </div>`;
}
async function initSettings(){
  const {data}=await supabaseClient.from("crm_settings").select("key,value");
  const settings=Object.fromEntries((data||[]).map(x=>[x.key,x.value]));
  const name=$("#business-name"),email=$("#business-email"),currency=$("#default-currency"),tz=$("#timezone");
  if(name)name.value=settings.business_name?.value??settings.business_name??"Meeqan Travel & Tours";
  if(email)email.value=settings.business_email?.value??settings.business_email??"";
  if(currency)currency.value=settings.default_currency?.value??settings.default_currency??"PKR";
  if(tz)tz.value=settings.timezone?.value??settings.timezone??"Asia/Karachi";
  $("#save-settings")?.addEventListener("click",async()=>{
    if(!["admin","manager"].includes(role())){toast("Only Admin or Manager can save settings.",true);return}
    const rows=[
      {key:"business_name",value:{value:name.value.trim()}},
      {key:"business_email",value:{value:email.value.trim()}},
      {key:"default_currency",value:{value:currency.value}},
      {key:"timezone",value:{value:tz.value}}
    ];
    const {error}=await supabaseClient.from("crm_settings").upsert(rows.map(r=>({...r,updated_by:currentSession.user.id})));
    if(error){toast(error.message||"Unable to save settings.",true);return}
    toast("Settings saved to Supabase.");
  });
  if(!["admin","manager"].includes(role()))$("#save-settings")?.setAttribute("disabled","true");
}
async function initPage(){
  const page=document.body.dataset.page;
  setupLayout();
  if(page==="dashboard"){const result=await initDashboard();startDashboardAutoRefresh();return result;}
  if(page==="notifications")return initNotifications();
  if(page==="reports")return initReports();
  if(page==="settings")return initSettings();
  return initCrud();
}
(async()=>{if(await enforceLogin()){if(document.body.dataset.page==="login")await initLogin();else{try{await initPage()}catch(e){toast(e.message||"Unable to load CRM.",true)}}}})();
