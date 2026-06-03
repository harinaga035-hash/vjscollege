import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef, @Inject(PLATFORM_ID) private platformId: object) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Function to handle intersection events
    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add 'is-visible' class for .image-text-section, 'animate' for others
          if (entry.target.classList.contains('image-text-section')) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.add('animate');
          }
          observer.unobserve(entry.target); // Stop observing after animation triggers
        }
      });
    };

    // Intersection Observer options
    const observerOptions: IntersectionObserverInit = {
      root: null, // Use viewport as root
      rootMargin: '0px', // No extra margin
      threshold: 0.2 // Trigger when 20% of the target is visible (updated from 0.1 to match JS)
    };

    // Select sections to animate within this component's template
    const sectionsToAnimate = this.elementRef.nativeElement.querySelectorAll('.achievement-gallery, .image-text-section');

    // Create a single Intersection Observer for all sections and images
    const sectionObserver = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe each selected section and its images
    sectionsToAnimate.forEach((section: HTMLElement) => {
      // Observe the section itself
      sectionObserver.observe(section);

      // Observe images within .gallery-grid for .achievement-gallery sections
      if (section.classList.contains('achievement-gallery')) {
        const imagesInGrid = section.querySelectorAll<HTMLImageElement>('.gallery-grid img');
        imagesInGrid.forEach((image: HTMLImageElement) => {
          sectionObserver.observe(image);
        });
      }
    });
  }
}
