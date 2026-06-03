import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NssActivitiesComponent } from './nss-activities.component';

describe('NssActivitiesComponent', () => {
  let component: NssActivitiesComponent;
  let fixture: ComponentFixture<NssActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NssActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NssActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
