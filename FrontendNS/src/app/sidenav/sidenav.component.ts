import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { sidebarMenuEntries, sidebarMenuEntriesAdmin } from './sidebarMenuEntries';
import { UserDTO } from '../model/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent{
  sidebarData = sidebarMenuEntries;
  sidebarDataAdmin = sidebarMenuEntriesAdmin;
  user: UserDTO;
  token: string;

  constructor (
    private sidenavService: SidenavService,
    private router: Router,
    private userService: UserService
  ) {
    this.token = localStorage.getItem('token');
  }

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
    this.userService.logoutUser();
    this.toggleSidenav();
  }

  onProfileImage() {
    this.router.navigate([`/view-profile/${this.user.username}`]);
    this.toggleSidenav();
  }

  getUserDetails() {
    const cachedUser = this.userService.getCachedUser();

    if (cachedUser) {
      this.user = cachedUser;
      console.log('yea')
    } else {
      this.userService.getUserByToken(this.token).subscribe(
        (response: UserDTO) => {
          this.user = response;
          if (response.profileImageUrl == '') {
            this.user.profileImageUrl = '/assets/images/default-user.png';
          }
        }
      );
    }
  }

  ngOnInit() {
    this.getUserDetails();
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
