import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  username: string;
  constructor(
    private user: UserService,
    private sidenavService: SidenavService
  ) {}

  toggleSidenav() {
    this.sidenavService.toggleMainSidenav();
  }

  test() {
    this.sidenavService.isMainSidenavOpen.subscribe((isOpen: boolean) => {
      console.log(isOpen);
    });

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
}
