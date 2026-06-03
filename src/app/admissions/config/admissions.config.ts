import { InjectionToken } from '@angular/core';
import { BrochureConfig } from '../models/lead.model';

export interface AdmissionsConfig {
  collegeName: string;
  primaryPhone: string;
  callPhone: string;
  email: string;
  defaultCourse: string;
  courses: string[];
  counsellor: string;
  crmEndpoint: string;
  whatsappNumber: string;
  brochures: BrochureConfig[];
  retryAttempts: number;
  retryDelayMs: number;
}

export const ADMISSIONS_CONFIG: AdmissionsConfig = {
  collegeName: "VJ's College Of Pharmacy",
  primaryPhone: '9951780088',
  callPhone: '9951780088',
  email: 'vjsedu@gmail.com',
  defaultCourse: 'B. Pharmacy',
  courses: ['B. Pharmacy', 'Pharm.D', 'M.Pharmacy', 'D.Pharmacy', 'Other'],
  counsellor: 'Admissions Team',
  crmEndpoint: '/api/admissions-leads',
  whatsappNumber: '919951780088',
  brochures: [
    { course: 'B. Pharmacy', label: 'B. Pharmacy Brochure', url: '/assets/brochures/brochure-placeholder.pdf' },
    { course: 'Pharm.D', label: 'Pharm.D Brochure', url: '/assets/brochures/brochure-placeholder.pdf' },
    { course: 'M.Pharmacy', label: 'M.Pharmacy Brochure', url: '/assets/brochures/brochure-placeholder.pdf' },
    { course: 'D.Pharmacy', label: 'D.Pharmacy Brochure', url: '/assets/brochures/brochure-placeholder.pdf' },
    { course: 'Other', label: 'Course Brochure', url: '/assets/brochures/brochure-placeholder.pdf' }
  ],
  retryAttempts: 2,
  retryDelayMs: 900
};

export const ADMISSIONS_CONFIG_TOKEN = new InjectionToken<AdmissionsConfig>('ADMISSIONS_CONFIG_TOKEN', {
  providedIn: 'root',
  factory: () => ADMISSIONS_CONFIG
});
