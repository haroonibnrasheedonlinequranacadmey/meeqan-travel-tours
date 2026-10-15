// Meeqan Travel & Tours — frontend interactions
const heroImages = [
  // 1 — Makkah: Kaaba and Masjid al-Haram
  "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=2000&q=88",
  // 2 — Madinah: Al-Masjid an-Nabawi
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Madeena_masjid_nabavi_12122008230.jpg/1920px-Madeena_masjid_nabavi_12122008230.jpg",
  // 3 — Madinah: Prophet's Mosque courtyard and umbrellas
  "https://content.mabruk.co.id/Upload/2023/11/14/zcvERBwM/20231114102933523.jpg",
  // 4 — Madinah: Quba Mosque
  "https://c.regencyholidays.com/blog/2025/3/51256_the%20story.webp",
  // 5 — Madinah: Mount Uhud
  "https://saudipedia.com/var/site/storage/images/9/7/1/2/6662179-1-eng-GB/b365901a0056-106527.jpg",
  // 6 — Makkah: another Kaaba / Grand Mosque view (not the removed old third slide)
  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Mecca.JPG"
];
const roomImages = [
  {name:"Elegant King Room",place:"Saudi Arabia · Example room",tag:"KING ROOM",url:"https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=85"},
  {name:"Premium Hotel Suite",place:"Modern suite inspiration",tag:"SUITE",url:"https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=85"},
  {name:"Twin Bed Room",place:"Comfortable twin layout",tag:"TWIN ROOM",url:"https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=85"},
  {name:"Luxury Interior",place:"Premium stay inspiration",tag:"LUXURY",url:"https://images.unsplash.com/photo-1611892440504-47a3e7b6c4e5?auto=format&fit=crop&w=800&q=85"},
  {name:"Warm Modern Room",place:"Contemporary hotel style",tag:"DELUXE",url:"https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=85"},
  {name:"Relaxing Suite",place:"Suite design inspiration",tag:"SUITE",url:"https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=85"},
  {name:"Comfortable Stay",place:"Hotel room inspiration",tag:"STANDARD",url:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=85"},
  {name:"Executive Room",place:"Business travel style",tag:"EXECUTIVE",url:"https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=85"},
  {name:"Bright Guest Room",place:"Bright and airy interior",tag:"GUEST ROOM",url:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=85"},
  {name:"Premium Twin Room",place:"Twin room inspiration",tag:"TWIN ROOM",url:"https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=85"},
  {name:"Calm Neutral Suite",place:"Neutral palette interior",tag:"SUITE",url:"https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=800&q=85"},
  {name:"Modern Hotel Room",place:"Contemporary hotel style",tag:"DELUXE",url:"https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=800&q=85"}
];

const slides = document.getElementById("heroSlides");
let currentSlide = 0;
if (slides) {
  // Clear any stale/old slides before adding the current six-slide set.
  slides.replaceChildren();
  heroImages.forEach((url, i) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide" + (i === 0 ? " active" : "");
    slide.dataset.slideNumber = String(i + 1);
    slide.style.backgroundImage = `url("${url}")`;
    slides.appendChild(slide);
  });
  const counter = document.getElementById("slideCurrent");
  if (counter) counter.textContent = "01";
  const total = slides.parentElement?.querySelector(".hero-counter span:last-child");
  if (total) total.textContent = String(heroImages.length).padStart(2, "0");

  // Rotate only the six current slides; this prevents old three-slide loops.
  window.setInterval(() => {
    const all = [...slides.querySelectorAll(".hero-slide")];
    if (!all.length) return;
    all[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % all.length;
    all[currentSlide].classList.add("active");
    const slideCurrent = document.getElementById("slideCurrent");
    if (slideCurrent) slideCurrent.textContent = String(currentSlide + 1).padStart(2, "0");
  }, 5000);
}

const roomGrid=document.getElementById("roomGrid");
if(roomGrid){
  roomImages.forEach(room=>{
    const card=document.createElement("article");
    card.className="room-card";
    card.innerHTML=`<img src="${room.url}" alt="${room.name}" loading="lazy"><div class="room-info"><span class="room-tag">${room.tag}</span><h3>${room.name}</h3><p>${room.place}</p></div>`;
    roomGrid.appendChild(card);
  });
}

const menuToggle=document.getElementById("menuToggle");
const mainNav=document.getElementById("mainNav");
if(menuToggle && mainNav) menuToggle.addEventListener("click",()=>{
  const open=mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(open));
  menuToggle.textContent=open?"×":"☰";
});
if(mainNav && menuToggle) mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
  menuToggle.textContent="☰";
}));
const yearElement=document.getElementById("year");
if(yearElement) yearElement.textContent=new Date().getFullYear();

function openWhatsApp(message){
  const url="https://wa.me/923097570707?text="+encodeURIComponent(message);
  window.open(url,"_blank","noopener,noreferrer");
}
const bookingForm=document.getElementById("bookingForm");
if(bookingForm) bookingForm.addEventListener("submit",e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.currentTarget).entries());
  const message=`Meeqan Travel & Tours — Travel Enquiry\nName: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email||"Not provided"}\nService: ${d.service}\nTravel details: ${d.details||"Not provided"}`;
  openWhatsApp(message);
});
const flightForm=document.getElementById("flightForm");
if(flightForm) flightForm.addEventListener("submit",e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.currentTarget).entries());
  openWhatsApp(`Meeqan Travel & Tours — Flight Enquiry\nFrom: ${d.from}\nTo: ${d.to}\nDeparture: ${d.date}\nPassengers: ${d.passengers}`);
});
