import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ADMISSIONS_CONFIG_TOKEN, AdmissionsConfig } from '../../config/admissions.config';
import { LeadPayload, LeadType } from '../../models/lead.model';
import { AdmissionsActionsService } from '../../services/admissions-actions.service';
import { LeadCrmService } from '../../services/lead-crm.service';
import { LeadTrackingService } from '../../services/lead-tracking.service';

@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enquiry-form.component.html',
  styleUrl: './enquiry-form.component.scss'
})
export class EnquiryFormComponent implements OnChanges {
  @Input() leadType: LeadType = 'Enquiry';
  @Input() course = '';
  @Output() completed = new EventEmitter<LeadPayload>();

  submitting = false;
  submitted = false;
  submitMessage = '';

  readonly mobilePattern = /^[6-9]\d{9}$/;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private crm: LeadCrmService,
    private tracking: LeadTrackingService,
    private actions: AdmissionsActionsService,
    @Inject(ADMISSIONS_CONFIG_TOKEN) readonly config: AdmissionsConfig
  ) {
    this.form = this.fb.nonNullable.group({
      studentName: ['', [Validators.required, Validators.minLength(2)]],
      mobile: ['', [Validators.required, Validators.pattern(this.mobilePattern)]],
      course: [this.config.defaultCourse, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && this.course) {
      this.form.patchValue({ course: this.course });
    }
  }

  get title(): string {
    if (this.leadType === 'Brochure') {
      return 'Download Brochure';
    }

    if (this.leadType === 'Call') {
      return 'Call Admission Enquiry';
    }

    if (this.leadType === 'WhatsApp') {
      return 'WhatsApp Admission Enquiry';
    }

    return 'Admission Enquiry';
  }

  fieldInvalid(fieldName: string): boolean {
    const control = this.form.controls[fieldName];
    return !!control && control.invalid && (control.dirty || control.touched || this.submitted);
  }

  async submit(): Promise<void> {
    console.log('[VJS Lead Form] Form Submitted');
    this.submitted = true;
    this.submitMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const lead = this.createLeadPayload();
    console.log('LEAD TYPE:', this.leadType);
    console.log('[VJS Lead Form] Lead Payload', lead);
    const result = await this.crm.submitLead(lead);
    console.log('[VJS Lead Form] API Response', result);
    this.submitting = false;
    this.submitMessage = result.message;

    if (result.ok) {
      this.completed.emit(lead);

      if (this.leadType === 'Brochure') {

        this.actions.downloadBrochure(
          lead.course || this.config.defaultCourse
        );

      } else if (this.leadType === 'Call') {

        window.location.href = `tel:${this.config.primaryPhone}`;

      } else if (this.leadType === 'WhatsApp') {

        this.actions.openWhatsApp(
          lead.studentName || '',
          lead.course || this.config.defaultCourse
        );

      }

      this.form.reset({
        studentName: '',
        mobile: '',
        course: this.course || this.config.defaultCourse
      });
      this.submitted = false;
    }
  }

  private createLeadPayload(): LeadPayload {
    const value = this.form.getRawValue();
    const now = new Date();

    return {
      leadId: this.crm.buildLeadId(value.mobile),
      date: now.toISOString().slice(0, 10),
      timestamp: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      source: this.resolveLeadSource(),
      studentName: value.studentName.trim(),
      mobile: value.mobile.trim(),
      course: value.course,
      counsellor: this.config.counsellor,
      status: 'New',
      notes: this.leadType === 'Brochure' ? 'Brochure requested' : `${this.leadType} lead submitted`,
      followUpDate: '',
      lastUpdated: now.toISOString(),
      leadType: this.leadType,
      pageUrl: this.tracking.getPageUrl(),
      referrer: this.tracking.getReferrer(),
      deviceType: this.tracking.getDeviceType(),
      campaign: this.tracking.getCampaign()
    };
  }

  private resolveLeadSource(): string {
    if (this.leadType === 'Brochure') {
      return 'Brochure';
    }

    if (this.leadType === 'Call') {
      return 'Call';
    }

    if (this.leadType === 'WhatsApp') {
      return 'WhatsApp';
    }

    return 'Apply';
  }
}
