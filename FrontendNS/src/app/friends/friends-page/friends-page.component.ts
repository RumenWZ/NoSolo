import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent {
  isSmallScreen: boolean;
  isSidenavOpen: boolean = false;
  friendsChatOpen = false;
  friendsIncomingRequestsOpen: boolean = false;
  currentChatUser: any = undefined;

  constructor(
    private sidenavService: SidenavService
  ) {
    this.isSmallScreen = window.innerWidth < 768;
  }

  toggleSidenav() {
    this.sidenavService.toggleFriendsSidenav();
  }

  onPendingRequests() {
    this.friendsIncomingRequestsOpen = true;

    this.friendsChatOpen = false;

  }

  ngOnInit() {
    this.sidenavService.isFriendsSidenavOpen.subscribe((isOpen: boolean) => {
      this.isSidenavOpen = isOpen;
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
