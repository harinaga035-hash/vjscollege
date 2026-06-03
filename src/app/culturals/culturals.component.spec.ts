import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CulturalsComponent } from './culturals.component';

describe('CulturalsComponent', () => {
  let component: CulturalsComponent;
  let fixture: ComponentFixture<CulturalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CulturalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CulturalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
