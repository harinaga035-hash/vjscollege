import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedData = localStorage.getItem('someKey');
      console.log(storedData);

      if (storedData == null || storedData == 'null' || storedData == '' || storedData == undefined) {
        setTimeout(() => {
          location.reload();
        }, 2000);
        localStorage.setItem('someKey', '1');
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && typeof IntersectionObserver !== 'undefined') {
      const elements = document.querySelectorAll(
        '.about-section, .intro-title, .intro-subtitle, .vj-course-wrapper, .cta, .awards-showcase'
      );
      const awardItems = document.querySelectorAll('.award-item');

      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target.classList.contains('cta')) {
                entry.target.classList.add('is-in-view');
              } else if (entry.target.classList.contains('awards-showcase')) {
                entry.target.classList.add('visible');
                awardItems.forEach((item) => {
                  item.classList.add('visible');
                });
              } else {
                entry.target.classList.add('is-visible');
              }
              sectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px',
        }
      );

      elements.forEach((element) => {
        sectionObserver.observe(element);
      });
    }
  }
}
