import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeadType } from '../models/lead.model';

export interface AdmissionsModalState {
  open: boolean;
  mode: LeadType;
  course?: string;
}

@Injectable({ providedIn: 'root' })
export class AdmissionsModalService {
  private readonly stateSubject = new BehaviorSubject<AdmissionsModalState>({ open: false, mode: 'Enquiry' });
  readonly state$ = this.stateSubject.asObservable();

  open(mode: LeadType = 'Enquiry', course?: string): void {
    this.stateSubject.next({ open: true, mode, course });
  }

  close(): void {
    this.stateSubject.next({ ...this.stateSubject.value, open: false });
  }
}
