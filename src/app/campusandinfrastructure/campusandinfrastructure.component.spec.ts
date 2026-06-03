import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusandinfrastructureComponent } from './campusandinfrastructure.component';

describe('CampusandinfrastructureComponent', () => {
  let component: CampusandinfrastructureComponent;
  let fixture: ComponentFixture<CampusandinfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampusandinfrastructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusandinfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
