import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { StickyActionBarComponent } from './admissions/components/sticky-action-bar/sticky-action-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent, StickyActionBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'        
  
})
export class AppComponent {
  title = 'vjs';
  //  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const storedData = localStorage.getItem('someKey');
  //     console.log(storedData);

  //     if (storedData == null || storedData == 'null' || storedData == '' || storedData == undefined) {
  //       setTimeout(function () {
  //         location.reload()
  //       }, 2000); // 2000 ms = 2 seconds
  //       localStorage.setItem('someKey', '1');
  //     }
  //   }
  // }
}
