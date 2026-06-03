import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { ADMISSIONS_CONFIG_TOKEN, AdmissionsConfig } from '../config/admissions.config';
import { AdmissionsActionsService } from './admissions-actions.service';
import { LeadCrmService } from './lead-crm.service';
import { LeadTrackingService } from './lead-tracking.service';

@Injectable({ providedIn: 'root' })
export class ExistingWhatsappService {
  private cleanup?: () => void;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private actions: AdmissionsActionsService,
    private crm: LeadCrmService,
    private tracking: LeadTrackingService,
    private zone: NgZone,
    @Inject(ADMISSIONS_CONFIG_TOKEN) private config: AdmissionsConfig
  ) {}

  enhanceExistingButton(): void {
    if (!isPlatformBrowser(this.platformId) || this.cleanup) {
      return;
    }

    this.tryEnhanceWithRetry(0);
  }

  private tryEnhanceWithRetry(attempt: number): void {
    const button = this.document.querySelector<HTMLAnchorElement>('a.float[href*="whatsapp"], a.float[href*="api.whatsapp.com"]');
    if (!button) {
      if (attempt < 8) {
        window.setTimeout(() => this.tryEnhanceWithRetry(attempt + 1), 250);
        return;
      }

      console.warn('[VJS WhatsApp] Existing floating WhatsApp button was not found after retry.');
      return;
    }

    button.setAttribute('aria-label', 'WhatsApp admission enquiry');

    const clickHandler = async (event: Event) => {
      event.preventDefault();
      await this.zone.run(() => this.trackAndOpenWhatsApp());
    };

    button.addEventListener('click', clickHandler);
    this.cleanup = () => button.removeEventListener('click', clickHandler);
  }

  private async trackAndOpenWhatsApp(): Promise<void> {
    const now = new Date();
    const latestLead = this.crm.getLatestLeadDetails();
    const lead = {
      leadId: this.crm.buildLeadId(latestLead?.mobile || '', 'WA'),
      date: now.toISOString().slice(0, 10),
      timestamp: now.toLocaleTimeString('en-IN', { hour12: false }),
      source: 'WhatsApp',
      studentName: latestLead?.studentName || '',
      mobile: latestLead?.mobile || '',
      course: latestLead?.course || this.config.defaultCourse,
      counsellor: this.config.counsellor,
      status: 'New' as const,
      notes: 'Existing WhatsApp floating button clicked',
      followUpDate: '',
      lastUpdated: now.toISOString(),
      leadType: 'WhatsApp' as const,
      pageUrl: this.tracking.getPageUrl(),
      referrer: this.tracking.getReferrer(),
      deviceType: this.tracking.getDeviceType(),
      campaign: this.tracking.getCampaign()
    };

    console.log('[VJS CTA] WhatsApp clicked. Lead Payload', lead);

    try {
      await this.crm.submitLead(lead, { skipDedupe: true, useBeacon: true });
    } catch (error) {
      console.error('[VJS CTA] WhatsApp lead save failed', error);
    } finally {
      this.actions.openWhatsApp(latestLead?.studentName || '', latestLead?.course || this.config.defaultCourse);
    }
  }
}
