# GharKhata build plan

## What to build
- Replace the blank home page with an elder-friendly household records dashboard, using the selected English/Hindi sandstone and royal-blue design.
- Add bilingual categories and filters, due/expiry summaries, household records, voice read-aloud, AI question bar, and item detail/receipt/notes actions.
- Add a scan flow that compresses receipt photos to WebP in the browser, extracts record fields with the requested Gemini model through the server-side AI Gateway, and saves the item and receipt.
- Support paid-cycle renewal choices, WhatsApp sharing, service calls, and seeded examples for the four household items in the brief.

## Data and privacy
- Enable Lovable Cloud and use its generated client. Keep the no-login screen by creating a private anonymous household session; records and notes are owner-scoped.
- Store receipts in a private bucket and use short-lived links in the app. Bills and insurance documents can contain personal details, so they should not be world-readable.
- Seed the four example records through the database setup rather than inserting them from the page. Keep family-device sync out of scope unless requested; the current default is private to this browser.

## Technical approach
- Keep the requested single-page experience at `/`, with app-specific page metadata and the project's TanStack Start patterns.
- Use React, Tailwind design tokens, existing Lucide icons, accessible controls, and bilingual copy; avoid exposing provider keys in browser code.
- Add the required Cloud schema, storage policies, starter-data logic, and owner-scoped notes; validate the main flows and existing tests.