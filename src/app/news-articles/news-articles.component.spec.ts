import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsArticlesComponent } from './news-articles.component';

describe('NewsArticlesComponent', () => {
  let component: NewsArticlesComponent;
  let fixture: ComponentFixture<NewsArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
