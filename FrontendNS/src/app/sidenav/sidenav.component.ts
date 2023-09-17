import { Component, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { sidebarMenuEntries, sidebarMenuEntriesAdmin } from './sidebarMenuEntries';
import { UserDTO } from '../model/user';
import { AlertifyService } from '../services/alertify.service';
import { FriendService } from '../services/friend.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileCardComponent } from '../user/profile-card/profile-card.component';
import { Subscription } from 'rxjs';

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
  friendRequests: number;
  updatePendingSubscription: Subscription;
  isAccountMenuOpen = false;
  showAdminOptions: boolean = false;

  constructor (
    private sidenavService: SidenavService,
    private router: Router,
    private userService: UserService,
    private friend: FriendService,
    private matDialog: MatDialog,
    private el: ElementRef
  ) {

    this.sidenavService.userDetailsUpdated$.subscribe(() => {
      this.getUserDetails();
    });
  }

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  closeAccountMenu() {
    this.isAccountMenuOpen = false;
  }

  toggleSidenav() {
    this.sidenavService.toggleMainSidenav();
  }

  onHome() {
    this.router.navigate(['/']);
    this.toggleSidenav();
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

  onFindFriends() {
    this.router.navigate(['/find-friends']);
    this.toggleSidenav();
  }

  onMyGames() {
    this.router.navigate(['/game-selection']);
    this.toggleSidenav();
  }

  onLogout() {
    this.userService.logoutUser();
    this.toggleSidenav();
  }

  onProfileImage() {
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: '470px'
    })
    this.userService.raiseCurrentUserProfileCard(this.user);
  }

  getFriendRequestsCount() {
    this.friend.getIncomingFriendRequests().subscribe((response: any) => {
      this.friendRequests = response.length;
    });
  }

  getUserDetails() {
    this.userService.getLoggedInUser().subscribe((response: UserDTO) => {
      this.user = response;
      this.showAdminOptions = response.isAdmin === true ? true : false;
      if (response.profileImageUrl == '') {
        this.user.profileImageUrl = '/assets/images/default-user.png';
      }
    });

    this.updatePendingSubscription = this.friend.updateFriendsList.subscribe(() => {
      this.getFriendRequestsCount();
    });

    this.getFriendRequestsCount();

  }

  ngOnInit() {
    this.getUserDetails();
  }

  ngOnDestroy(){
    this.updatePendingSubscription.unsubscribe();
  }

  executeFunction(functionName: string) {
    switch (functionName) {
      case 'onLogout': this.onLogout();
        break;
      case 'onHome': this.onHome();
        break;
      case 'onGameAdd': this.onGameAdd();
        break;
      case 'onGameList': this.onGamesList();
        break;
      case 'onSettings': this.onSettings();
        break;
      case 'onFriends': this.onFriends();
        break;
      case 'onMyGames': this.onMyGames();
        break;
      case 'onFindFriends': this.onFindFriends();
        break;
      default:
        console.log('Unknown function');
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeAccountMenu();
    }
  }
}
