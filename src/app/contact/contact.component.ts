import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {

  private scrollListener?: () => void;
  private loadingTimeout?: any;
  private isBrowser: boolean;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Only initialize animations in browser environment
    if (this.isBrowser) {
      this.initializeLoadingAnimation();
    }
  }

  ngAfterViewInit(): void {
    // Only initialize animations in browser environment
    if (this.isBrowser) {
      setTimeout(() => {
        this.initializeScrollReveal();
        this.initializeFormAnimations();
        this.initializeButtonAnimations();
        this.addRippleAnimationStyles();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    // Only clean up in browser environment
    if (this.isBrowser) {
      if (this.scrollListener && typeof window !== 'undefined') {
        window.removeEventListener('scroll', this.scrollListener);
      }
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
    }
  }

  private initializeLoadingAnimation(): void {
    // Hide loading animation after 2 seconds
    this.loadingTimeout = setTimeout(() => {
      const loadingElement = this.elementRef.nativeElement.querySelector('.loading-animation');
      if (loadingElement) {
        this.renderer.setStyle(loadingElement, 'display', 'none');
      }
    }, 2000);
  }

  private initializeScrollReveal(): void {
    // Only run in browser environment
    if (!this.isBrowser || typeof window === 'undefined') {
      return;
    }

    // Create scroll reveal function
    this.scrollListener = () => {
      this.revealOnScroll();
    };

    // Add scroll event listener
    window.addEventListener('scroll', this.scrollListener);

    // Initial check
    this.revealOnScroll();
  }

  private revealOnScroll(): void {
    // Only run in browser environment
    if (!this.isBrowser || typeof window === 'undefined') {
      return;
    }

    const reveals = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');

    reveals.forEach((reveal: HTMLElement) => {
      const windowHeight = window.innerHeight;
      const elementTop = reveal.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        this.renderer.addClass(reveal, 'revealed');
      }
    });
  }

  private initializeFormAnimations(): void {
    const formControls = this.elementRef.nativeElement.querySelectorAll('.form-control');

    formControls.forEach((control: HTMLElement) => {
      // Focus animation
      this.renderer.listen(control, 'focus', () => {
        const parentElement = control.parentElement;
        if (parentElement) {
          this.renderer.setStyle(parentElement, 'transform', 'scale(1.02)');
        }
      });

      // Blur animation
      this.renderer.listen(control, 'blur', () => {
        const parentElement = control.parentElement;
        if (parentElement) {
          this.renderer.setStyle(parentElement, 'transform', 'scale(1)');
        }
      });
    });
  }

  private initializeButtonAnimations(): void {
    const submitBtn = this.elementRef.nativeElement.querySelector('.thm-btn');

    if (submitBtn) {
      this.renderer.listen(submitBtn, 'click', (e: MouseEvent) => {
        e.preventDefault();
        this.createRippleEffect(e, submitBtn);
      });
    }
  }

  private createRippleEffect(event: MouseEvent, button: HTMLElement): void {
    // Create ripple element
    const ripple = this.renderer.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Set ripple styles
    this.renderer.setStyle(ripple, 'position', 'absolute');
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.setStyle(ripple, 'background', 'rgba(255,255,255,0.3)');
    this.renderer.setStyle(ripple, 'border-radius', '50%');
    this.renderer.setStyle(ripple, 'transform', 'scale(0)');
    this.renderer.setStyle(ripple, 'animation', 'ripple 0.6s ease-out');
    this.renderer.setStyle(ripple, 'pointer-events', 'none');

    // Add ripple to button
    this.renderer.appendChild(button, ripple);

    // Remove ripple after animation
    setTimeout(() => {
      this.renderer.removeChild(button, ripple);
    }, 600);
  }

  private addRippleAnimationStyles(): void {
    // Only run in browser environment
    if (!this.isBrowser || typeof document === 'undefined') {
      return;
    }

    // Check if styles already exist
    const existingStyle = document.querySelector('#ripple-animation-styles');
    if (existingStyle) {
      return;
    }

    // Create style element
    const style = this.renderer.createElement('style');
    this.renderer.setAttribute(style, 'id', 'ripple-animation-styles');

    const css = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;

    this.renderer.appendChild(style, this.renderer.createText(css));
    this.renderer.appendChild(document.head, style);
  }

  // Optional: Method to handle form submission
  onSubmit(event: Event): void {
    event.preventDefault();

    // Add your form submission logic here
    console.log('Form submitted!');

    // You can add additional animations or feedback here
    const submitBtn = this.elementRef.nativeElement.querySelector('.thm-btn');
    if (submitBtn) {
      // Temporarily change button text or add loading state
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 2000);
    }
  }

  // Optional: Method to reset form animations
  resetFormAnimations(): void {
    const formGroups = this.elementRef.nativeElement.querySelectorAll('.form-group');
    formGroups.forEach((group: HTMLElement) => {
      this.renderer.setStyle(group, 'transform', 'scale(1)');
    });
  }
}