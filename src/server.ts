import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const crmWebhookUrl =
  'https://script.google.com/macros/s/AKfycbyc3BYDciEBJdIcsFydmNxL2rDAJzU7YFFLLc7XGU0hHAjCABlPMBuHZOTxwSo2ddp0/exec';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json({ limit: '32kb' }));

interface StoredAdmissionLead {
  leadId: string;
  date: string;
  time: string;
  studentName: string;
  mobile: string;
  course: string;
  source: string;
  pageUrl: string;
  deviceType: string;
  status: string;
}

function normalizeMobile(value: unknown): string {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

function normalizeText(value: unknown): string {
  return String(value || '').trim();
}



function validateLeadPayload(body: Record<string, unknown>): StoredAdmissionLead | null {
  const leadType = normalizeText(body['leadType']) || 'Enquiry';
  const studentName = normalizeText(body['studentName']);
  const mobile = normalizeMobile(body['mobile']);
  const course = normalizeText(body['course']);
  const date = normalizeText(body['date']) || new Date().toISOString().slice(0, 10);
  const time =
    normalizeText(body['timestamp']) ||
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  const source = normalizeLeadSource(normalizeText(body['source']), leadType);
  const leadId = normalizeText(body['leadId']) || `VJS-${Date.now()}${mobile ? `-${mobile}` : ''}`;
  const pageUrl = normalizeText(body['pageUrl']);
  const deviceType = normalizeText(body['deviceType']) || 'Unknown';
  const status = normalizeText(body['status']) || 'New';
  const isEventOnlyLead = source === 'Call' || source === 'WhatsApp';

  if (!isEventOnlyLead && (!studentName || !/^[6-9]\d{9}$/.test(mobile) || !course)) {
    return null;
  }

  if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
    return null;
  }

  return { leadId, date, time, studentName, mobile, course, source, pageUrl, deviceType, status };
}

function normalizeLeadSource(source: string, leadType: string): string {
  if (source === 'Call Button' || leadType === 'Call') {
    return 'Call';
  }
  if (leadType === 'Brochure') {
    return 'Brochure';
  }
  if (leadType === 'WhatsApp') {
    return 'WhatsApp';
  }
  if (source === 'Apply' || leadType === 'Enquiry') {
    return 'Call Back';
  }
  return ['Call Back', 'Call', 'WhatsApp', 'Brochure'].includes(source) ? source : 'Apply';
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.post('/api/admissions-leads', async (req, res) => {
  console.log('[Admissions CRM] API Request', req.body);

  const lead = validateLeadPayload(req.body || {});

  if (!lead) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid lead payload.'
    });
  }

  try {
    const response = await fetch(crmWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    console.log('[Admissions CRM] Apps Script Response', text);

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error('[Admissions CRM] Apps Script Failure', error);

    return res.status(500).json({
      ok: false,
      message: 'Unable to save lead.'
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
