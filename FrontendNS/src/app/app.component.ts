import { Component } from '@angular/core';
import { SidenavService } from './services/sidenav.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { sidebarMenuEntries, sidebarMenuEntriesAdmin } from './sidebarMenuEntries';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSidenavOpen: boolean;
  title = 'NoSolo';
  sidebarData = sidebarMenuEntries;
  sidebarDataAdmin = sidebarMenuEntriesAdmin;

  constructor(
    private sidenavService: SidenavService,
    private router: Router,
    private user: UserService
  ) {}

  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  onDashboard() {
    console.log('Dashboard button clicked');
  }

  onGameAdd() {
    this.router.navigate(['/add-game']);
    this.toggleSidenav();
  }

  onGamesList() {
    this.router.navigate(['/game-list']);
    this.toggleSidenav();
  }

  onSettings() {
    this.router.navigate(['/settings']);
    this.toggleSidenav();
  }

  onLogout() {
    this.user.logoutUser();
    this.toggleSidenav();
  }

  executeFunction(functionName: string) {
    switch (functionName) {
      case 'onLogout': this.onLogout();
        break;
      case 'onDashboard': this.onDashboard();
        break;
      case 'onGameAdd': this.onGameAdd();
        break;
      case 'onGameList': this.onGamesList();
        break;
      case 'onSettings': this.onSettings();
        break;
      default:
        console.log('Unknown function');
        break;
    }
  }

  ngOnInit() {
    this.sidenavService.isSidenavOpen.subscribe((isOpen: boolean) => {
      this.isSidenavOpen = isOpen;
    });
  }
}
