import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Select the elements to observe, including the new ones for image-text-section
    const elementsToObserve = document.querySelectorAll(
      '.management-profile, .profile-text, .profile-img, .mission-vission-item, .about-iconbox-item, .slide-in-left, .slide-in-right, .image-block, .text-content' // Added .image-block and .text-content
    );

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Apply different classes based on the element, or a common 'is-visible'
            // For the image-text-section, we used 'is-visible' in CSS
            if (entry.target.classList.contains('image-block') || entry.target.classList.contains('text-content')) {
              entry.target.classList.add('is-visible');
            } else {
              // Existing classes for other elements
              entry.target.classList.add('animate');
            }
            // Stop observing after animation to improve performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully in view
      }
    );

    // Observe each relevant element
    elementsToObserve.forEach(el => { // Changed variable name from 'profile' to 'el' for clarity
      observer.observe(el);
    });
  }
}
