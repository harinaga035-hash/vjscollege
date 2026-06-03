import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, firstValueFrom, of, retry, timer } from 'rxjs';
import { ADMISSIONS_CONFIG_TOKEN, AdmissionsConfig } from '../config/admissions.config';
import { LeadPayload } from '../models/lead.model';

interface LeadSubmissionResult {
  ok: boolean;
  queued: boolean;
  message: string;
}

interface LeadSubmitOptions {
  skipDedupe?: boolean;
  useBeacon?: boolean;
}

interface LatestLeadDetails {
  studentName: string;
  mobile: string;
  course: string;
}

@Injectable({ providedIn: 'root' })
export class LeadCrmService {
  private readonly dedupeWindowMs = 24 * 60 * 60 * 1000;
  private readonly storageKey = 'vjs_lead_dedupe';
  private readonly pendingStorageKey = 'vjs_pending_leads';
  private readonly latestLeadStorageKey = 'vjs_latest_lead_details';

  constructor(
    private http: HttpClient,
    @Inject(ADMISSIONS_CONFIG_TOKEN) private config: AdmissionsConfig,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async submitLead(lead: LeadPayload, options: LeadSubmitOptions = {}): Promise<LeadSubmissionResult> {
    console.log('[VJS Lead CRM] API Request', lead);

    if (!options.skipDedupe && this.isDuplicate(lead)) {
      console.log('[VJS Lead CRM] Duplicate skipped', lead);
      return { ok: true, queued: false, message: 'Lead already captured recently.' };
    }

    if (!options.skipDedupe) {
      this.rememberLead(lead);
    }

    this.rememberLatestLeadDetails(lead);

    if (options.useBeacon && this.tryBeaconSubmit(lead)) {
      console.log('[VJS Lead CRM] API Request sent with beacon', lead);
      return { ok: true, queued: false, message: 'Lead save started.' };
    }

    const result = await firstValueFrom(
      this.http.post(this.config.crmEndpoint, lead).pipe(
        retry({
          count: this.config.retryAttempts,
          delay: (_error, retryCount) => timer(this.config.retryDelayMs * retryCount)
        }),
        catchError((error) => {
          this.queuePendingLead(lead);
          this.logLead(lead, 'Google Sheet CRM push failed after retries. Lead queued in browser storage.', error);
          return of(null);
        })
      )
    );

    if (!result) {
      console.log('[VJS Lead CRM] API Response failed/queued', lead);
      return { ok: false, queued: true, message: 'Lead saved temporarily. We will retry CRM storage.' };
    }

    console.log('[VJS Lead CRM] API Response', result);
    this.flushPendingLeads();
    return { ok: true, queued: false, message: 'Lead saved to admissions CRM.' };
  }

  buildLeadId(mobile = '', prefix = 'VJS'): string {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    return cleanMobile ? `${prefix}-${Date.now()}-${cleanMobile}` : `${prefix}-${Date.now()}`;
  }

  getLatestLeadDetails(): LatestLeadDetails | null {
    if (!this.isBrowser()) {
      return null;
    }

    try {
      return JSON.parse(localStorage.getItem(this.latestLeadStorageKey) || 'null') as LatestLeadDetails | null;
    } catch {
      return null;
    }
  }

  private isDuplicate(lead: LeadPayload): boolean {
    const key = this.dedupeKey(lead);
    const stored = this.readDedupeStore();
    const lastSeen = stored[key];
    return !!lastSeen && Date.now() - lastSeen < this.dedupeWindowMs;
  }

  private rememberLead(lead: LeadPayload): void {
    const stored = this.readDedupeStore();
    stored[this.dedupeKey(lead)] = Date.now();
    try {
      if (this.isBrowser()) {
        localStorage.setItem(this.storageKey, JSON.stringify(stored));
      }
    } catch {
      this.logLead(lead, 'Unable to persist lead dedupe key.');
    }
  }

  private readDedupeStore(): Record<string, number> {
    if (!this.isBrowser()) {
      return {};
    }

    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    } catch {
      return {};
    }
  }

  private dedupeKey(lead: LeadPayload): string {
    const mobile = (lead.mobile || '').replace(/\D/g, '').slice(-10);
    return `${mobile || lead.leadId}:${lead.leadType}:${lead.course || ''}`;
  }

  private logLead(lead: LeadPayload, message: string, error?: unknown): void {
    console.warn('[VJS Lead CRM]', message, { lead, error });
  }

  private queuePendingLead(lead: LeadPayload): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      const pending = JSON.parse(localStorage.getItem(this.pendingStorageKey) || '[]') as LeadPayload[];
      pending.push(lead);
      localStorage.setItem(this.pendingStorageKey, JSON.stringify(pending.slice(-20)));
    } catch {
      this.logLead(lead, 'Unable to queue pending lead.');
    }
  }

  private async flushPendingLeads(): Promise<void> {
    if (!this.isBrowser()) {
      return;
    }

    let pending: LeadPayload[] = [];
    try {
      pending = JSON.parse(localStorage.getItem(this.pendingStorageKey) || '[]') as LeadPayload[];
    } catch {
      return;
    }

    if (!pending.length) {
      return;
    }

    const remaining: LeadPayload[] = [];
    for (const lead of pending) {
      const result = await firstValueFrom(
        this.http.post(this.config.crmEndpoint, lead).pipe(catchError(() => of(null)))
      );
      if (!result) {
        remaining.push(lead);
      }
    }

    localStorage.setItem(this.pendingStorageKey, JSON.stringify(remaining));
  }

  private rememberLatestLeadDetails(lead: LeadPayload): void {
    if (!this.isBrowser() || !lead.studentName || !lead.mobile || !lead.course) {
      return;
    }

    try {
      localStorage.setItem(this.latestLeadStorageKey, JSON.stringify({
        studentName: lead.studentName,
        mobile: lead.mobile,
        course: lead.course
      }));
    } catch {
      this.logLead(lead, 'Unable to store latest lead details.');
    }
  }

  private tryBeaconSubmit(lead: LeadPayload): boolean {
    if (!this.isBrowser() || !navigator.sendBeacon) {
      return false;
    }

    try {
      const payload = new Blob([JSON.stringify(lead)], { type: 'application/json' });
      return navigator.sendBeacon(this.config.crmEndpoint, payload);
    } catch (error) {
      this.logLead(lead, 'Beacon submit failed.', error);
      return false;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
