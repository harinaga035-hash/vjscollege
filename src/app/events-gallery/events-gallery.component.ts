import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-events-gallery',
  standalone: true, // Assuming this is a standalone component
  imports: [RouterModule],
  templateUrl: './events-gallery.component.html',
  styleUrl: './events-gallery.component.scss'
})
export class EventsGalleryComponent implements AfterViewInit {

  // Inject ElementRef to access the component's host DOM element
  constructor(private elementRef: ElementRef, @Inject(PLATFORM_ID) private platformId: object) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // This code runs after the component's view has been initialized and rendered.

    // Function to handle what happens when an element intersects the viewport
    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If the element is in view, add the 'animate' class
          entry.target.classList.add('animate');
          // Stop observing this element once it has been animated
          observer.unobserve(entry.target);
        }
      });
    };

    // Options for the Intersection Observer
    // Threshold is set to 0.5 (50%) to ensure animation triggers when a good portion of the element is visible
    const observerOptions: IntersectionObserverInit = {
      root: null, // 'null' means the viewport is the root
      rootMargin: '0px', // No extra margin around the root
      threshold: 0.5 // Animation triggers when 50% of the element is visible
    };

    // Select all sections that should animate on scroll within THIS component's template.
    // This will target both '.achievement-gallery' (if used in this component's HTML)
    // and '.gallery-section' elements.
    const sectionsToAnimate = this.elementRef.nativeElement.querySelectorAll('.achievement-gallery, .gallery-section');

    const sectionObserver = new IntersectionObserver(handleIntersection, observerOptions);

    sectionsToAnimate.forEach((section: HTMLElement) => {
      // Observe the section itself for its animation
      sectionObserver.observe(section);

      // Also observe each image within this section's 'gallery-grid'
      // Use explicit type argument for querySelectorAll to resolve TypeScript errors
      const imagesInGrid = section.querySelectorAll<HTMLImageElement>('.gallery-grid img');
      imagesInGrid.forEach((image: HTMLImageElement) => {
        const imageObserver = new IntersectionObserver(handleIntersection, observerOptions);
        imageObserver.observe(image);
      });
    });
  }
}
