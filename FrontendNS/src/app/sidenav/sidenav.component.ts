import { Component } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { sidebarMenuEntries, sidebarMenuEntriesAdmin } from './sidebarMenuEntries';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  sidebarData = sidebarMenuEntries;
  sidebarDataAdmin = sidebarMenuEntriesAdmin;

  constructor (
    private sidenavService: SidenavService,
    private router: Router,
    private user: UserService
  ) {}

  toggleSidenav() {
    this.sidenavService.toggleMainSidenav();
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

  onFriends() {
    this.router.navigate(['/friends']);
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
      case 'onFriends': this.onFriends();
        break;
      default:
        console.log('Unknown function');
        break;
    }
  }
}
