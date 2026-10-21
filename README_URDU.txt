MEEQAN CRM — corrected frontend mapping pack

Is ZIP ke folders ko GitHub repository ke root ke mutabiq upload karein. Is mein sirf CRM JavaScript aur CRM script cache-version wale HTML pages aur inquiries.config.js shamil hain.

Known fixes based on the schema output you supplied:
- inquiries status values now use new/contacted/follow_up/confirmed/cancelled. Legacy UI choices are mapped to confirmed/cancelled.
- flight status uses lowercase requested/quoted/booked/ticketed/cancelled.
- booking status uses lowercase pending/confirmed/in_progress/completed/cancelled.
- transport status uses lowercase requested/confirmed/completed/cancelled.
- visa pages and dashboard/report queries use visa_cases; application_status and documents_status use the database's allowed values.

Important: This does not fix unknown tables/columns, RLS permissions, or other modules whose full schema has not been supplied. Test one record at a time after deployment. Keep a backup/commit before replacing files.
