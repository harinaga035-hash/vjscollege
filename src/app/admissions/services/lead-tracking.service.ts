import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LeadTrackingService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  getSource(): string {
    if (!this.isBrowser()) {
      return 'Direct';
    }

    const params = new URLSearchParams(window.location.search);
    const explicitSource = params.get('utm_source') || params.get('source');
    const campaign = params.get('utm_campaign');

    if (campaign || params.get('utm_medium') || params.get('gclid') || params.get('fbclid')) {
      return 'Ad Campaign';
    }

    if (explicitSource && campaign) {
      return `${explicitSource} - ${campaign}`;
    }

    if (explicitSource) {
      return explicitSource;
    }

    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('google.')) {
      return 'Google Search';
    }
    if (referrer.includes('whatsapp')) {
      return 'WhatsApp';
    }
    if (referrer.includes('facebook.')) {
      return 'Facebook';
    }
    if (referrer.includes('instagram.')) {
      return 'Instagram';
    }

    return referrer ? 'Other' : 'Direct';
  }

  getCampaign(): string {
    if (!this.isBrowser()) {
      return '';
    }

    const params = new URLSearchParams(window.location.search);
    return params.get('utm_campaign') || params.get('campaign') || '';
  }

  getPageUrl(): string {
    return this.isBrowser() ? window.location.href : '';
  }

  getReferrer(): string {
    return this.isBrowser() ? document.referrer : '';
  }

  getDeviceType(): string {
    if (!this.isBrowser()) {
      return 'Server';
    }

    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
      return 'Mobile';
    }
    if (/iPad|Tablet/i.test(ua)) {
      return 'Tablet';
    }
    return 'Desktop';
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
