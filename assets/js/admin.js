(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const key = 'meeqanAdminPreviewV1';
  const seed = {
    bookings: [
      {id:101,name:'Example Customer',phone:'03000000000',service:'Umrah Package',travelDate:'2026-11-20',people:2,status:'New',notes:'Example preview record'},
      {id:102,name:'Sample Family',phone:'03111111111',service:'Hotel Booking',travelDate:'2026-12-05',people:4,status:'Contacted',notes:'Example preview record'}
    ],
    inquiries: [{id:201,name:'Website Visitor',phone:'03222222222',email:'visitor@example.com',topic:'Hajj package details',status:'New',notes:'Example preview record'}],
    packages: [
      {id:301,name:'Economy Umrah Package',type:'Umrah',tier:'Economy',duration:'14 days',price:'Ask for quote',currency:'PKR',includes:'Visa assistance, hotel options, transport on request',status:'Active'},
      {id:302,name:'Family Hajj Package',type:'Hajj',tier:'Family',duration:'Custom',price:'Ask for quote',currency:'PKR',includes:'Family support and itinerary planning',status:'Active'}
    ],
    hotels: [
      {id:401,name:'Example Makkah Hotel',city:'Makkah',distance:'Ask hotel',roomType:'Standard / Family',price:'Ask for quote',currency:'SAR',facilities:'Wi-Fi, reception',availability:'On request',image:'',status:'Draft'}
    ],
    flights: [{id:501,title:'Islamabad to Jeddah',route:'ISB → JED',airline:'Enquire for airline',date:'Flexible dates',price:'Ask for quote',currency:'PKR',status:'Active'}],
    tours: [{id:601,name:'Makkah & Madinah Ziyarat',location:'Saudi Arabia',duration:'On request',price:'Ask for quote',currency:'SAR',includes:'Transport and itinerary on request',status:'Active'}],
    services: [
      {id:701,name:'Hajj Packages',description:'Hajj travel planning and package enquiries',status:'Active'},
      {id:702,name:'Umrah Packages',description:'Economy, standard, luxury, family and group options',status:'Active'},
      {id:703,name:'Hotel Reservations',description:'Hotel and room enquiry assistance',status:'Active'},
      {id:704,name:'Flight Tickets',description:'Flight fare and ticketing enquiries',status:'Active'},
      {id:705,name:'Visa Services',description:'Visa process guidance and assistance',status:'Active'},
      {id:706,name:'Airport Transfers',description:'Airport pickup and transfer requests',status:'Active'}
    ],
    customers: [],
    staff: [{id:801,name:'Main Admin (placeholder)',email:'admin@example.com',role:'Owner',status:'Planned'}],
    settings:{business:'Meeqan Travel & Tours',phone:'03097570707',email:'info.meeqanofficial@gmail.com',address:'Blue Area, Islamabad, Pakistan',currency:'PKR',timezone:'Asia/Karachi'}
  };
  let data;
  try { data = JSON.parse(localStorage.getItem(key)) || structuredClone(seed); } catch { data = JSON.parse(JSON.stringify(seed)); }
  const clone = obj => JSON.parse(JSON.stringify(obj));
  function persist(){localStorage.setItem(key,JSON.stringify(data));renderAll();}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}
  function statusClass(s){const x=String(s||'').toLowerCase();if(['new'].includes(x))return 'new';if(['contacted','in progress'].includes(x))return 'contacted';if(['cancelled'].includes(x))return 'cancelled';if(['completed','resolved','active','confirmed'].includes(x))return 'completed';return '';}
  function pill(s){return `<span class="pill ${statusClass(s)}">${esc(s||'—')}</span>`;}
  function empty(msg='No records yet. Add a record to get started.'){return `<div class="empty">${msg}</div>`;}
  function table(headers,rows){if(!rows.length)return empty();return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;}
  function actions(type,id){return `<div class="row-actions"><button class="tiny-btn" data-edit="${type}" data-id="${id}">Edit</button><button class="tiny-btn delete" data-delete="${type}" data-id="${id}">Delete</button></div>`;}
  function textCell(a,b=''){return `<div class="cell-title">${esc(a||'—')}</div>${b?`<div class="cell-sub">${esc(b)}</div>`:''}`;}
  function renderBookings(){
    const q=($('#bookingSearch')?.value||'').toLowerCase(), f=$('#bookingFilter')?.value||'all';
    const rows=data.bookings.filter(b=>(f==='all'||b.status===f)&&[b.name,b.phone,b.service].join(' ').toLowerCase().includes(q)).map(b=>`<tr><td>${textCell(b.name,b.phone)}</td><td>${esc(b.service)}</td><td>${esc(b.travelDate||'Flexible')}</td><td>${esc(b.people||'—')}</td><td>${pill(b.status)}</td><td><select aria-label="Update booking status" data-status="bookings" data-id="${b.id}">${['New','Contacted','Confirmed','Completed','Cancelled'].map(s=>`<option ${s===b.status?'selected':''}>${s}</option>`).join('')}</select></td><td>${actions('bookings',b.id)}</td></tr>`);
    $('#bookingsTable').innerHTML=table(['Customer','Service','Travel date','People','Status','Update status','Actions'],rows);
    $('#recentBookings').innerHTML= data.bookings.length ? table(['Customer','Service','Status'],data.bookings.slice(-4).reverse().map(b=>`<tr><td>${textCell(b.name,b.phone)}</td><td>${esc(b.service)}</td><td>${pill(b.status)}</td></tr>`)) : empty('New booking requests will appear here.');
    $('#bookingBadge').textContent=data.bookings.filter(b=>b.status==='New').length;
  }
  const schemas={
    packages:{title:'package',fields:[['name','Package name','text',true],['type','Package type','select',true,['Hajj','Umrah']],['tier','Package tier','select',true,['Economy','Standard','Luxury / VIP','Custom','Group','Family']],['duration','Duration','text'],['price','Price / starting price','text'],['currency','Currency','select',false,['PKR','USD','SAR','GBP','CAD']],['includes','What's included','textarea'],['status','Visibility','select',true,['Active','Draft','Archived']]]},
    hotels:{title:'hotel / room',fields:[['name','Hotel name','text',true],['city','City','select',true,['Makkah','Madinah','Jeddah','Other']],['distance','Distance from Haram','text'],['roomType','Room types','text'],['price','Room price','text'],['currency','Currency','select',false,['SAR','PKR','USD','GBP','CAD']],['facilities','Facilities (comma-separated)','textarea'],['availability','Availability','select',true,['On request','Available','Limited','Unavailable']],['image','Photo URL (optional)','url'],['status','Listing status','select',true,['Active','Draft','Archived']]]},
    flights:{title:'flight offer',fields:[['title','Offer title','text',true],['route','Route (e.g. ISB → JED)','text',true],['airline','Airline','text'],['date','Travel dates','text'],['price','Fare / quote','text'],['currency','Currency','select',false,['PKR','USD','SAR','GBP','CAD']],['status','Visibility','select',true,['Active','Draft','Expired']]]},
    tours:{title:'tour',fields:[['name','Tour name','text',true],['location','Location','text',true],['duration','Duration','text'],['price','Price / quote','text'],['currency','Currency','select',false,['SAR','PKR','USD','GBP','CAD']],['includes','Details / inclusions','textarea'],['status','Visibility','select',true,['Active','Draft','Archived']]]},
    services:{title:'service',fields:[['name','Service name','text',true],['description','Description','textarea',true],['status','Visibility','select',true,['Active','Hidden']]]},
    inquiries:{title:'inquiry',fields:[['name','Customer name','text',true],['phone','Phone / WhatsApp','tel',true],['email','Email','email'],['topic','Inquiry topic','text',true],['status','Follow-up status','select',true,['New','In progress','Resolved']],['notes','Notes','textarea']]},
    staff:{title:'staff record',fields:[['name','Staff name','text',true],['email','Work email','email',true],['role','Proposed role','select',true,['Owner','Admin','Booking Manager','Content Manager','Support']],['status','Record status','select',true,['Planned','Active','Disabled']]]},
    bookings:{title:'booking',fields:[['name','Customer name','text',true],['phone','Phone / WhatsApp','tel',true],['service','Service requested','select',true,['Hajj Package','Umrah Package','Hotel Booking','Flight Ticket','Visa Service','Tour / Ziyarat','Airport Transfer','Other']],['travelDate','Travel date','date'],['people','Number of travellers','number'],['status','Status','select',true,['New','Contacted','Confirmed','Completed','Cancelled']],['notes','Notes','textarea']]}
  };
  const labels={customers:'Customers'};
  function renderCollection(type,selector,fields,emptyMsg){
    const rows=(data[type]||[]).map(r=>`<tr>${fields.map(f=>`<td>${f.render?f.render(r):esc(r[f.key]||'—')}</td>`).join('')}<td>${actions(type,r.id)}</td></tr>`);
    $(selector).innerHTML=table([...fields.map(f=>f.label),'Actions'],rows);
  }
  function renderPackages(){renderCollection('packages','#packagesTable',[{key:'name',label:'Package',render:r=>textCell(r.name,r.type+' · '+r.tier)},{key:'duration',label:'Duration'},{key:'price',label:'Price',render:r=>esc((r.currency||'')+' '+(r.price||'Ask for quote'))},{key:'status',label:'Visibility',render:r=>pill(r.status)}]);}
  function renderHotels(){renderCollection('hotels','#hotelsTable',[{key:'name',label:'Hotel / City',render:r=>textCell(r.name,r.city)},{key:'roomType',label:'Room types'},{key:'distance',label:'Haram distance'},{key:'price',label:'Price',render:r=>esc((r.currency||'')+' '+(r.price||'Ask for quote'))},{key:'availability',label:'Availability',render:r=>pill(r.availability)},{key:'status',label:'Listing',render:r=>pill(r.status)}]);}
  function renderFlights(){renderCollection('flights','#flightsTable',[{key:'title',label:'Offer',render:r=>textCell(r.title,r.route)},{key:'airline',label:'Airline'},{key:'date',label:'Travel dates'},{key:'price',label:'Fare',render:r=>esc((r.currency||'')+' '+(r.price||'Ask for quote'))},{key:'status',label:'Status',render:r=>pill(r.status)}]);}
  function renderTours(){renderCollection('tours','#toursTable',[{key:'name',label:'Tour',render:r=>textCell(r.name,r.location)},{key:'duration',label:'Duration'},{key:'price',label:'Price',render:r=>esc((r.currency||'')+' '+(r.price||'Ask for quote'))},{key:'status',label:'Status',render:r=>pill(r.status)}]);}
  function renderServices(){renderCollection('services','#servicesTable',[{key:'name',label:'Service'},{key:'description',label:'Description'},{key:'status',label:'Visibility',render:r=>pill(r.status)}]);}
  function renderInquiries(){const q=($('#inquirySearch')?.value||'').toLowerCase(),f=$('#inquiryFilter')?.value||'all';const rows=data.inquiries.filter(r=>(f==='all'||r.status===f)&&[r.name,r.phone,r.email,r.topic].join(' ').toLowerCase().includes(q)).map(r=>`<tr><td>${textCell(r.name,r.phone)}</td><td>${esc(r.email||'—')}</td><td>${esc(r.topic)}</td><td>${pill(r.status)}</td><td>${actions('inquiries',r.id)}</td></tr>`);$('#inquiriesTable').innerHTML=table(['Customer','Email','Topic','Status','Actions'],rows);}
  function renderCustomers(){const list=data.customers.length?data.customers:[];$('#customersTable').innerHTML=list.length?table(['Name','Phone','Email','Bookings'],list.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.phone||'—')}</td><td>${esc(c.email||'—')}</td><td>${esc(c.bookings||0)}</td></tr>`)):empty('Customer profiles will be populated after Supabase and customer sign-in are connected.');}
  function renderStaff(){renderCollection('staff','#staffTable',[{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'role',label:'Proposed role'},{key:'status',label:'Status',render:r=>pill(r.status)}]);}
  function renderReports(){const total=data.bookings.length,confirmed=data.bookings.filter(b=>['Confirmed','Completed'].includes(b.status)).length;$('#reportStats').innerHTML=[['Total requests',total],['Confirmed / completed',confirmed],['New requests',data.bookings.filter(b=>b.status==='New').length],['Open inquiries',data.inquiries.filter(i=>i.status!=='Resolved').length]].map(x=>`<article class="stat-card"><div><p>${x[0]}</p><strong>${x[1]}</strong></div></article>`).join('');const statuses=['New','Contacted','Confirmed','Completed','Cancelled'];$('#statusReport').innerHTML=statuses.map(s=>{const n=data.bookings.filter(b=>b.status===s).length;return `<div class="report-bar"><span>${s}</span><div class="bar-track"><div class="bar-fill" style="width:${total?n/total*100:0}%"></div></div><b>${n}</b></div>`}).join('');}
  function renderSettings(){const f=$('#settingsForm');Object.entries(data.settings||{}).forEach(([k,v])=>{if(f.elements[k])f.elements[k].value=v;});}
  function renderAll(){renderBookings();renderPackages();renderHotels();renderFlights();renderTours();renderServices();renderInquiries();renderCustomers();renderStaff();renderReports();$('#statBookings').textContent=data.bookings.length;$('#statInquiries').textContent=data.inquiries.filter(i=>i.status==='New').length;$('#statPackages').textContent=data.packages.filter(p=>p.status==='Active').length;$('#statHotels').textContent=data.hotels.length;renderSettings();}
  function go(view){$$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));$$('.nav-link').forEach(n=>n.classList.toggle('active',n.dataset.view===view));const active=$(`[data-view="${view}"]`);$('#pageTitle').textContent=active?active.textContent.trim().replace(/\s+\d+$/,''):view;$('#sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});}
  $$('#nav .nav-link').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
  document.addEventListener('click',e=>{const goBtn=e.target.closest('[data-go]');if(goBtn)go(goBtn.dataset.go);const edit=e.target.closest('[data-edit]');if(edit)openRecord(edit.dataset.edit,Number(edit.dataset.id));const del=e.target.closest('[data-delete]');if(del)deleteRecord(del.dataset.delete,Number(del.dataset.id));});
  $('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  function openRecord(type,id=null){const schema=schemas[type];if(!schema)return;const existing=(data[type]||[]).find(r=>r.id===id)||{};$('#dialogTitle').textContent=(id?'Edit ':'Add ')+schema.title;$('#dialogFields').innerHTML=schema.fields.map(([name,label,kind='text',required=false,options=[]])=>{let field='';if(kind==='select')field=`<select name="${name}" ${required?'required':''}>${options.map(o=>`<option ${String(existing[name]??'')===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`;else if(kind==='textarea')field=`<textarea name="${name}" rows="3" ${required?'required':''}>${esc(existing[name]||'')}</textarea>`;else field=`<input name="${name}" type="${kind}" value="${esc(existing[name]||'')}" ${required?'required':''} ${kind==='number'?'min="1"':''}>`;return `<label class="${kind==='textarea'?'full':''}">${label}${field}</label>`;}).join('');$('#recordForm').dataset.type=type;$('#recordForm').dataset.id=id||'';$('#recordDialog').showModal();}
  $('#recordForm').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();const type=$('#recordForm').dataset.type,id=Number($('#recordForm').dataset.id)||Date.now(),schema=schemas[type],fd=new FormData(e.currentTarget),record={id};schema.fields.forEach(([name])=>record[name]=String(fd.get(name)||'').trim());const idx=data[type].findIndex(r=>r.id===id);if(idx>=0)data[type][idx]={...data[type][idx],...record};else data[type].push(record);$('#recordDialog').close();persist();toast('Record saved in this browser preview.');});
  function deleteRecord(type,id){if(!confirm('Delete this preview record? This cannot be undone.'))return;data[type]=data[type].filter(r=>r.id!==id);persist();toast('Preview record deleted.');}
  $$('[id^="add"]').forEach(b=>b.addEventListener('click',()=>{const map={addPackage:'packages',addHotel:'hotels',addFlight:'flights',addTour:'tours',addService:'services',addStaff:'staff'};if(map[b.id])openRecord(map[b.id]);}));
  $('#bookingSearch').addEventListener('input',renderBookings);$('#bookingFilter').addEventListener('change',renderBookings);$('#inquirySearch').addEventListener('input',renderInquiries);$('#inquiryFilter').addEventListener('change',renderInquiries);
  document.addEventListener('change',e=>{const el=e.target.closest('[data-status]');if(!el)return;const item=data[el.dataset.status].find(x=>x.id===Number(el.dataset.id));if(item){item.status=el.value;persist();toast('Status updated.');}});
  function csv(rows){if(!rows.length)return '';const cols=[...new Set(rows.flatMap(Object.keys))];return [cols.join(','),...rows.map(r=>cols.map(c=>`"${String(r[c]??'').replace(/"/g,'""')}"`).join(','))].join('\r\n');}
  function download(name,rows){const blob=new Blob(['\ufeff'+csv(rows)],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);toast('CSV export prepared.');}
  $('#exportBookings').addEventListener('click',()=>download('meeqan-bookings.csv',data.bookings));
  $('#exportInquiries').addEventListener('click',()=>download('meeqan-inquiries.csv',data.inquiries));
  $('#exportCustomers').addEventListener('click',()=>download('meeqan-customers.csv',data.customers));
  $('#exportReport').addEventListener('click',()=>download('meeqan-report.csv',data.bookings.map(b=>({...b,reportType:'Booking'})).concat(data.inquiries.map(i=>({...i,reportType:'Inquiry'})))));
  $('#settingsForm').addEventListener('submit',e=>{e.preventDefault();data.settings=Object.fromEntries(new FormData(e.currentTarget).entries());persist();$('#settingsMessage').textContent='Settings saved in this browser preview.';toast('Settings saved.');});
  $('#resetDemo').addEventListener('click',()=>{if(confirm('Reset all local preview data to the example records?')){data=clone(seed);persist();toast('Preview data reset.');}});
  $('#year').textContent=new Date().getFullYear();
  renderAll();
})();