import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ADMISSIONS_CONFIG_TOKEN, AdmissionsConfig } from '../config/admissions.config';
import { BrochureConfig } from '../models/lead.model';

@Injectable({ providedIn: 'root' })
export class AdmissionsActionsService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(ADMISSIONS_CONFIG_TOKEN) private config: AdmissionsConfig
  ) {}

  callAdmissions(): void {
    this.openUrl(`tel:${this.config.callPhone}`);
  }

  openWhatsApp(studentName: string, course = this.config.defaultCourse): void {
    const message =
      `Hello,\n\n` +
      `I am interested in admission at VJ's College of Pharmacy.\n\n` +
      `Name: ${studentName}\n` +
      `Course: ${course}\n\n` +
      `Please contact me.`;
    this.openUrl(`https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(message)}`);
  }

  findBrochure(course: string): BrochureConfig {
    return this.config.brochures.find((brochure) => brochure.course === course) || this.config.brochures[0];
  }

  downloadBrochure(course: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const brochure = this.findBrochure(course);
    const link = document.createElement('a');
    link.href = brochure.url;
    link.download = brochure.url.split('/').pop() || 'brochure.pdf';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  private openUrl(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = url;
    }
  }
}
