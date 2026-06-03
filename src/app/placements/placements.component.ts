import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-placements',
  imports: [RouterModule],
  templateUrl: './placements.component.html',
  styleUrl: './placements.component.scss'
})
export class PlacementsComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Define the Intersection Observer callback
    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add is-visible class to the target element
          entry.target.classList.add('is-visible');

          // If the target is a section, animate its child cards
          if (entry.target.classList.contains('placement-section')) {
            const cards = entry.target.querySelectorAll('.placement-card');
            cards.forEach((card) => {
              card.classList.add('is-visible');
            });
          } else if (entry.target.classList.contains('gallery-section')) {
            const galleryCards = entry.target.querySelectorAll('.gallery-card');
            galleryCards.forEach((card) => {
              card.classList.add('is-visible');
            });
          }

          // Stop observing the target after animation (for performance)
          observer.unobserve(entry.target);
        }
      });
    };

    // Create an Intersection Observer
    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // Use the viewport as the root
      rootMargin: '0px', // Margin around the root
      threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe the placement section
    const placementSection = document.querySelector('.placement-section');
    if (placementSection) {
      observer.observe(placementSection);
    }

    // Observe the gallery section
    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
      observer.observe(gallerySection);
    }
  }
}
