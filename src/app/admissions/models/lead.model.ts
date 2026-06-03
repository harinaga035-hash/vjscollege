export type LeadType = 'Enquiry' | 'Brochure' | 'WhatsApp' | 'Call' | 'Chat';

export type LeadStatus = 'New' | 'Called' | 'Interested' | 'Applied' | 'Enrolled' | 'Lost';

export interface LeadPayload {
  leadId: string;
  date: string;
  timestamp: string;
  source: string;
  studentName?: string;
  mobile?: string;
  course?: string;
  counsellor: string;
  status: LeadStatus;
  notes: string;
  followUpDate: string;
  lastUpdated: string;
  leadType: LeadType;
  pageUrl: string;
  referrer: string;
  deviceType: string;
  campaign: string;
}

export interface BrochureConfig {
  course: string;
  label: string;
  url: string;
}
