import { Directive, HostListener, Input } from '@angular/core';
import { AdmissionsModalService } from '../services/admissions-modal.service';

@Directive({
  selector: '[appBrochureTrigger]',
  standalone: true
})
export class BrochureTriggerDirective {
  @Input('appBrochureTrigger') course = '';

  constructor(private modal: AdmissionsModalService) {}

  @HostListener('click', ['$event'])
  openBrochureFlow(event: Event): void {
    event.preventDefault();
    this.modal.open('Brochure', this.course);
  }
}
