import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent {
  isSmallScreen: boolean;
  isSidenavOpen: boolean = false;
  currentChatUser: UserDTO;
  friendsChatOpen = false;
  friendsIncomingRequestsOpen: boolean = false;
  friendsAllOpen: boolean;


  friendInvitesCount: number;


  constructor(
    private sidenavService: SidenavService,
    private friend: FriendService
  ) {
    this.isSmallScreen = window.innerWidth < 768;
    this.friend.chattingWithUser.subscribe((value: UserDTO) => {
      this.currentChatUser = value;
      this.openChatComponent();
    });
  }

  openChatComponent() {
    this.closeAllOtherComponents('friends-chat');
    this.friendsChatOpen = true;
  }

  toggleSidenav() {
    this.sidenavService.toggleFriendsSidenav();
  }

  onPendingRequests() {
    this.friendsIncomingRequestsOpen = true;
    this.closeAllOtherComponents('friends-incoming-requests');

  }

  OnAllFriends() {
    this.friendsAllOpen = true;
    this.closeAllOtherComponents('friends-all');
  }

  closeAllOtherComponents(componentName: string) {
    switch (componentName) {
      case 'friends-chat':
        this.friendsIncomingRequestsOpen = false;
        this.friendsAllOpen = false;
        break;
      case 'friends-incoming-requests':
        this.friendsChatOpen = false;
        this.friendsAllOpen = false;
        break;
      case 'friends-all':
        this.friendsChatOpen = false;
        this.friendsIncomingRequestsOpen = false;
        break;
    }
  }

  ngOnInit() {
    this.sidenavService.isFriendsSidenavOpen.subscribe((isOpen: boolean) => {
      this.isSidenavOpen = isOpen;
    });

    this.friend.getIncomingFriendRequests(localStorage.getItem('token')).subscribe((response: any) => {
      this.friendInvitesCount = response.length;
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
