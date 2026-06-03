import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router'; // Assuming RouterModule is needed for other parts of your app

@Component({
  selector: 'app-bus-routes',
  standalone: true, // Assuming this is a standalone component
  imports: [RouterModule], // Include any necessary modules
  templateUrl: './bus-routes.component.html',
  styleUrl: './bus-routes.component.scss'
})
export class BusRoutesComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const busCards: NodeListOf<Element> = document.querySelectorAll('.bus-card');

    const observerOptions: IntersectionObserverInit = {
      root: null, // Use the viewport as the root
      rootMargin: '0px', // No margin around the root
      threshold: 0.2 // Trigger when 20% of the item is visible. Adjusted to 0.2 for consistency with initial request.
    };

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          // Add the 'is-visible' class which triggers the animation
          entry.target.classList.add('is-visible');

          // Optional: Stop observing once it's visible to run animation only once
          observer.unobserve(entry.target);
        } else {
          // Optional: Remove 'is-visible' if you want the animation to replay
          // when scrolling back up and then down again.
          // entry.target.classList.remove('is-visible');
        }
      });
    }, observerOptions);

    // Assign 'from-right' or 'from-left' based on index and then observe
    busCards.forEach((card: Element, index: number) => {
      // Apply the initial position class (from-left or from-right)
      // This prepares the card for the animation when 'is-visible' is added
      card.classList.add(index % 2 === 0 ? 'from-left' : 'from-right'); // Assuming 'from-left' for even index as initial state

      // Now observe the card for intersection
      observer.observe(card);
    });
  }
}
