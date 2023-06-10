import { Component } from '@angular/core';
import { SidenavService } from './services/sidenav.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSidenavOpen: boolean;
  title = 'NoSolo';

  constructor(
    private sidenavService: SidenavService
  ) {}

  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  ngOnInit() {
    this.sidenavService.isSidenavOpen.subscribe((isOpen: boolean) => {
      this.isSidenavOpen = isOpen;
    });
  }
}
