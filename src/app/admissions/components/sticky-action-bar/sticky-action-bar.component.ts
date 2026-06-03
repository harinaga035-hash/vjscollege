import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { ADMISSIONS_CONFIG_TOKEN, AdmissionsConfig } from '../../config/admissions.config';
import { LeadPayload, LeadType } from '../../models/lead.model';
import { AdmissionsActionsService } from '../../services/admissions-actions.service';
import { AdmissionsModalService, AdmissionsModalState } from '../../services/admissions-modal.service';
import { ExistingWhatsappService } from '../../services/existing-whatsapp.service';
import { LeadCrmService } from '../../services/lead-crm.service';
import { LeadTrackingService } from '../../services/lead-tracking.service';
import { EnquiryFormComponent } from '../enquiry-form/enquiry-form.component';

@Component({
  selector: 'app-sticky-action-bar',
  standalone: true,
  imports: [CommonModule, EnquiryFormComponent],
  templateUrl: './sticky-action-bar.component.html',
  styleUrl: './sticky-action-bar.component.scss'
})
export class StickyActionBarComponent implements AfterViewInit {
  state$;

  constructor(
    private modal: AdmissionsModalService,
    private actions: AdmissionsActionsService,
    private existingWhatsapp: ExistingWhatsappService,
    private crm: LeadCrmService,
    private tracking: LeadTrackingService,
    @Inject(ADMISSIONS_CONFIG_TOKEN) readonly config: AdmissionsConfig
  ) {
    this.state$ = this.modal.state$;
  }

  ngAfterViewInit(): void {
    this.existingWhatsapp.enhanceExistingButton();
  }

  openForm(mode: LeadType = 'Enquiry', course?: string): void {
    this.modal.open(mode, course || this.config.defaultCourse);
  }

  closeForm(): void {
    this.modal.close();
  }

  async call(): Promise<void> {
    const lead = this.createCallLeadPayload();
    console.log('[VJS CTA] Call Now clicked. Lead Payload', lead);

    try {
      await this.crm.submitLead(lead, { skipDedupe: true, useBeacon: true });
    } catch (error) {
      console.error('[VJS CTA] Call lead save failed', error);
    } finally {
      this.actions.callAdmissions();
    }
  }

  onCompleted(_lead: LeadPayload): void {
    setTimeout(() => this.closeForm(), 900);
  }

  backdropClick(event: MouseEvent, state: AdmissionsModalState): void {
    if (event.target === event.currentTarget && state.open) {
      this.closeForm();
    }
  }

  private createCallLeadPayload(): LeadPayload {
    const now = new Date();
    const latestLead = this.crm.getLatestLeadDetails();

    return {
      leadId: this.crm.buildLeadId(latestLead?.mobile || '', 'CALL'),
      date: now.toISOString().slice(0, 10),
      timestamp: now.toLocaleTimeString('en-IN', { hour12: false }),
      source: 'Call',
      studentName: latestLead?.studentName || '',
      mobile: latestLead?.mobile || '',
      course: latestLead?.course || '',
      counsellor: this.config.counsellor,
      status: 'New',
      notes: 'Phone call CTA clicked',
      followUpDate: '',
      lastUpdated: now.toISOString(),
      leadType: 'Call',
      pageUrl: this.tracking.getPageUrl(),
      referrer: this.tracking.getReferrer(),
      deviceType: this.tracking.getDeviceType(),
      campaign: this.tracking.getCampaign()
    };
  }
}
