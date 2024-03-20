import { Component } from '@angular/core';
import { SidenavService } from './services/sidenav.service';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('* => *', [
        style({opacity: 0}),
        animate('900ms', style({opacity: 1}))
      ])
    ])
  ]
})
export class AppComponent {
  isSidenavOpen: boolean;
  backgroundImageLoaded: boolean = false;
  title = 'NoSolo';
  backgroundImageUrl: string;

  constructor(
    private sidenavService: SidenavService
  ) {}

  toggleSidenav() {
    this.sidenavService.toggleMainSidenav();
  }

  imageLoaded() {
    setTimeout(() => {
      this.backgroundImageUrl = ""
    }, 2000);
    this.backgroundImageLoaded = true;
  }

  ngOnInit() {
    this.backgroundImageUrl = "../assets/images/background-image-mini.png";

    this.sidenavService.isMainSidenavOpen.subscribe((isOpen: boolean) => {
      this.isSidenavOpen = isOpen;
    });
  }
}
