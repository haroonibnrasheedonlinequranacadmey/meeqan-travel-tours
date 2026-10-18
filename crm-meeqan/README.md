# Meeqan Travel & Tours — CRM frontend starter

This package contains CRM-only pages. It does not replace or include your public marketing website.

## Included pages
- `crm-login.html`
- `dashboard.html`, `notifications.html`, `customers.html`, `bookings.html`, `inquiries.html`
- `packages.html`, `hotels.html`, `flights.html`, `transport.html`, `visas.html`, `tours.html`
- `payments.html`, `staff.html`, `reports.html`, `website-content.html`, `settings.html`
- Shared CSS and JS under `assets/`
- Supabase SQL scripts under `sql/`, split by implementation phase

## Important current status
- Frontend is prepared first as requested; Supabase is not connected yet.
- CRUD pages run in browser-only demo mode using localStorage. Do not enter real customer, passport, visa, or payment information.
- Login is intentionally disabled until Supabase Auth is configured; there are no hard-coded credentials.
- SQL scripts are provided for staged review, not executed automatically. Run them only in a Supabase project after reviewing. Start with `00_core.sql`, then modules in numerical order.
- Before production use, test RLS with separate admin/manager/agent/finance/read-only accounts, configure password reset, email verification, audit logging, backups, and storage policies.

## Deploying to GitHub
Upload the files/folders into your repository root (or into a dedicated CRM folder). If hosted inside a subfolder, update relative links if needed. GitHub Pages serves static frontend files only; Supabase supplies authentication/database later.

## Planned integration sequence
1. Supabase project URL + publishable/anon key in a separate config file (never service_role key in browser code).
2. Auth, protected routes, profile/role loading and logout.
3. Customers, then inquiries, then bookings.
4. Travel service modules.
5. Payments, notifications, staff, reports, website content, settings.
6. RLS verification and production security review.
