import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Renderer2, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-campusandinfrastructure',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './campusandinfrastructure.component.html',
  styleUrls: ['./campusandinfrastructure.component.scss']
})
export class CampusandinfrastructureComponent implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    console.log('Angular: ngAfterViewInit called, setting up IntersectionObserver');
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully in view
      threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(`Angular: Element ${entry.target.className} is 20% visible, triggering animation`);
          this.renderer.addClass(entry.target, 'animate');
          observer.unobserve(entry.target);
          console.log(`Angular: Stopped observing ${entry.target.className}`);
        }
      });
    }, observerOptions);

    const elements = this.el.nativeElement.querySelectorAll('.campus-info, .tour-heading, .campus-image , .three-image-section , .image-card');
    if (elements.length > 0) {
      console.log('Angular: Found elements to observe', elements.length);
      elements.forEach((element: HTMLElement) => observer.observe(element));
    } else {
      console.error('Angular: No elements found with classes .campus-info, .tour-heading, or .campus-image.');
    }
  }
}
