# Admissions CTA Google Sheet CRM Setup

## Scope

Only CTA functionality is involved:

- Existing WhatsApp floating button tracking.
- Apply CTA.
- Call CTA.
- Download Brochure CTA.
- Lead capture modal.
- Google Sheet CRM endpoint.

No page layout, route, header, footer, hero, content, typography, or non-CTA section is modified by this setup.

## Google Sheet

Spreadsheet URL:

```text
https://docs.google.com/spreadsheets/d/1brCguX8Sn6Ws8agQ7uYzuF3qBaPirnpsPDVueO4I7fk/edit
```

Spreadsheet ID:

```text
1brCguX8Sn6Ws8agQ7uYzuF3qBaPirnpsPDVueO4I7fk
```

Default tab:

```text
Sheet1
```

Set `GOOGLE_SHEET_TAB` if the CRM tab has a different name.

## Required Columns

The server verifies and writes these headers in row 1:

```text
Lead ID
Date
Time
Student Name
Mobile Number
Course Interested
Lead Source
Page URL
Device Type
Status
```

## Lead Sources

```text
Apply
Call
WhatsApp
Brochure
```

## Flows

Apply:

```text
Apply icon -> Lead form -> Save to Google Sheet -> Open WhatsApp
```

Call:

```text
Call icon -> Save event to Google Sheet -> Open phone dialer
```

WhatsApp:

```text
Existing WhatsApp icon -> Save event to Google Sheet -> Open WhatsApp
```

Brochure:

```text
Brochure icon -> Lead form -> Save to Google Sheet -> Download vjs-brochure
```

Brochure does not open WhatsApp, Gmail, Outlook, or any mail app.

## Google Service Account Setup

1. Create a Google Cloud service account.
2. Enable the Google Sheets API for that Google Cloud project.
3. Create a JSON key for the service account.
4. Share the Google Sheet with the service account email as Editor.
5. Configure the environment variables below.

## Environment Variables

Required:

```text
GOOGLE_SHEET_ID=1brCguX8Sn6Ws8agQ7uYzuF3qBaPirnpsPDVueO4I7fk
GOOGLE_SHEET_TAB=Sheet1
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

`GOOGLE_PRIVATE_KEY` must keep newline characters escaped as `\n` in Vercel.

## Endpoint

```text
POST /api/admissions-leads
```

Handled in:

```text
src/server.ts
```

## Logging

Browser console:

- Form Submitted
- Lead Payload
- API Request
- API Response
- CTA click payloads

Server console:

- API Request
- Sheet Save Success
- Sheet Save Failure
- Header update attempts

## Vercel Notes

This project uses Angular SSR with an Express server. For Vercel, deploy with the SSR output and configure the environment variables in the Vercel project settings.

Checklist:

1. Add all Google environment variables in Vercel.
2. Share the Sheet with the service account email.
3. Build locally with `npm run build`.
4. Deploy.
5. Test Apply, Call, WhatsApp, and Brochure flows.
6. Confirm rows appear in the Google Sheet.

## Local Test

```bash
npm run build
set GOOGLE_SERVICE_ACCOUNT_EMAIL=...
set GOOGLE_PRIVATE_KEY=...
npm run serve:ssr:vjs
```

Then POST a test lead to:

```text
http://localhost:4000/api/admissions-leads
```

## Rollback

1. Remove `<app-sticky-action-bar></app-sticky-action-bar>` from `src/app/app.component.html`.
2. Remove `StickyActionBarComponent` from `src/app/app.component.ts`.
3. Remove `provideHttpClient(withFetch())` if no other API code uses it.
4. Delete `src/app/admissions`.
5. Remove `/api/admissions-leads` from `src/server.ts`.
