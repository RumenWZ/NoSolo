import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { sidebarMenuEntries, sidebarMenuEntriesAdmin } from './sidebarMenuEntries';
import { UserDTO } from '../model/user';
import { AlertifyService } from '../services/alertify.service';
import { FriendService } from '../services/friend.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent{
  sidebarData = sidebarMenuEntries;
  sidebarDataAdmin = sidebarMenuEntriesAdmin;
  user: UserDTO;
  cachedUserDetails: any;
  token: string;
  friendRequests: number;

  constructor (
    private sidenavService: SidenavService,
    private router: Router,
    private userService: UserService,
    private alertify: AlertifyService,
    private friend: FriendService
  ) {

    this.sidenavService.userDetailsUpdated$.subscribe(() => {
      this.getUserDetails();
    });
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
    this.token = localStorage.getItem('token');
    this.cachedUserDetails = localStorage.getItem('user');

    if (this.cachedUserDetails) {
      this.user = JSON.parse(this.cachedUserDetails);
      if (this.user.profileImageUrl == '') {
        this.user.profileImageUrl = '/assets/images/default-user.png';
      }
    }

    this.friend.getIncomingFriendRequests(this.token).subscribe((response: any) => {
      this.friendRequests = response.length;
      console.log(this.friendRequests);
    })
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
