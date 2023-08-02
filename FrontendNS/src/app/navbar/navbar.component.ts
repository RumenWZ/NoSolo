import { Component, HostListener } from '@angular/core';
import { UserService } from '../services/user.service';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  username: string;
  isSmallScreen: boolean;
  constructor(
    private user: UserService,
    private sidenavService: SidenavService,
  ) {
    this.isSmallScreen = window.innerWidth < 768;
  }

  toggleSidenav() {
    this.sidenavService.toggleMainSidenav();
  }

  loggedIn() {
    this.username = this.user.getUsername();
    return this.user.getUsername();
  }

  onLogout() {
    this.user.logoutUser();
  }

  ngOnInit() {

  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
