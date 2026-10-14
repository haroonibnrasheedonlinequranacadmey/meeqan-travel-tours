# Meeqan Travel & Tours — Website Starter

Professional multi-page-ready travel website starter for Vercel + Supabase.

## Current included features
- Responsive homepage with rotating hero photos (automatic slideshow)
- Header navigation and mobile menu
- Hajj, Umrah, Hotels, Flights, Tours, Visa, Contact sections
- Hotel room gallery with 12 real-photo URLs from Unsplash
- Airline cards / flight-offer section (demo content, not live ticket inventory)
- Booking request form (currently frontend demo; connect to Supabase in the next step)
- Professional footer with contact details, quick links, services and social placeholders
- Editable SVG logo and circular favicon
- Organized `assets/css`, `assets/js`, and `assets/images` folders

## Important
This is the frontend foundation. The form, online payment, customer accounts, secure admin panel, and live flight ticket issuance are **not active yet**. They require Supabase configuration and, for payment/flight issuance, provider credentials. The flight section is marked as sample offers only.

## Run locally
Open `index.html` in your browser, or deploy this folder to Vercel as a static site.

## Deploy to Vercel
1. Upload the project folder to a new GitHub repository.
2. In Vercel, import that GitHub repository.
3. Framework preset: `Other`
4. Build command: leave empty.
5. Output directory: `.` (or leave default if Vercel detects static files).
6. Deploy.

## Change images
Edit `assets/js/main.js` and replace the photo URLs in `heroImages` / `roomImages`.
Photos are loaded from Unsplash URLs and need an internet connection. Replace them with licensed/owned images before commercial use if required.

## Brand details currently used
Meeqan Travel & Tours
WhatsApp: 03097570707
Email: info.meeqanofficial@gmail.com
Office: Blue Area, Islamabad, Pakistan
