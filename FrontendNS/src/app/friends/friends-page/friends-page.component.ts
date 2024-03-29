import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
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
  friendsChatOpen: boolean = false;
  friendsIncomingRequestsOpen: boolean = false;
  friendsAllOpen: boolean = false;
  friendsAddOpen: boolean = true;
  friendsRequestedOpen: boolean;
  friendInvitesCount: number;
  updatePendingSubscription: Subscription;

  openFriendsAllSubscription: Subscription;
  openFriendsPendingSubscription: Subscription;
  openFriendsAddSubscription: Subscription;
  openFriendsRequestedSubscription: Subscription;

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

  onRequestedFriends() {
    this.friendsRequestedOpen = true;
    this.closeAllOtherComponents('friends-requested');
  }

  onAddFriends() {
    this.friendsAddOpen = true;
    this.closeAllOtherComponents('friends-add');
  }

  closeAllOtherComponents(componentName: string) {
    switch (componentName) {
      case 'friends-chat':
        this.friendsRequestedOpen = false;
        this.friendsIncomingRequestsOpen = false;
        this.friendsAllOpen = false;
        this.friendsAddOpen = false;
        break;
      case 'friends-incoming-requests':
        this.friendsRequestedOpen = false;
        this.friendsChatOpen = false;
        this.friendsAllOpen = false;
        this.friendsAddOpen = false;
        break;
      case 'friends-all':
        this.friendsRequestedOpen = false;
        this.friendsChatOpen = false;
        this.friendsIncomingRequestsOpen = false;
        this.friendsAddOpen = false;
        break;
      case 'friends-add':
        this.friendsRequestedOpen = false;
        this.friendsAllOpen = false;
        this.friendsChatOpen = false;
        this.friendsIncomingRequestsOpen = false;
        break;
      case 'friends-requested':
        this.friendsAddOpen = false
        this.friendsAllOpen = false;
        this.friendsChatOpen = false;
        this.friendsIncomingRequestsOpen = false;
        break;
    }
  }

  getFriendRequestsCount() {
    this.friend.getIncomingFriendRequests().subscribe((response: any) => {
      this.friendInvitesCount = response.length;
    });
  }

  ngOnInit() {
    this.openFriendsAllSubscription = this.friend.openFriendsAll.subscribe(() => {
      this.OnAllFriends();
    });

    this.openFriendsPendingSubscription = this.friend.openFriendsPending.subscribe(() => {
      this.onPendingRequests();
    });

    this.openFriendsAddSubscription = this.friend.openFriendsAdd.subscribe(() => {
      this.onAddFriends();
    });

    this.openFriendsRequestedSubscription = this.friend.openFriendsRequested.subscribe(() => {
      this.onRequestedFriends();
    });

    this.updatePendingSubscription = this.friend.updateFriendsList.subscribe(() => {
      this.getFriendRequestsCount();
    });

    this.sidenavService.isFriendsSidenavOpen.subscribe((isOpen: boolean) => {
      this.isSidenavOpen = isOpen;
    });

    this.getFriendRequestsCount();
  }

  ngOnDestroy() {
    this.updatePendingSubscription.unsubscribe();
    this.openFriendsAllSubscription.unsubscribe();
    this.openFriendsPendingSubscription.unsubscribe();
    this.openFriendsAddSubscription.unsubscribe();
    this.openFriendsRequestedSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
