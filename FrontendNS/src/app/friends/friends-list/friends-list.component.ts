import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FriendService } from 'src/app/services/friend.service';
import { User, UserDTO } from 'src/app/model/user';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  friendsList: UserDTO[];
  @Output() friendsChatEnabled = new EventEmitter<boolean>();
  @Output() currentChatUser = new EventEmitter<any>();
  selectedFriend: UserDTO;
  isSmallScreen: boolean;
  friendFilter: string;
  private updateFriendsListSubscription: Subscription;
  skeletonLoadingCount = 10;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private friend: FriendService,
    private sidenav: SidenavService
  ) {
    this.friend.chattingWithUser.subscribe((value: UserDTO) => {
      this.selectedFriend = value;
    });
    this.isSmallScreen = window.innerWidth < 768;
  }

  getLoopRange(){
    return new Array(this.skeletonLoadingCount);
  }

  onFriendClick(user: any) {
    this.selectedFriend = user;
    this.friend.raiseCurrentChatUser(user);
    if (this.isSmallScreen) {
      this.sidenav.toggleFriendsSidenav();
    }
  }

  assignDefaultValues() {
    for (let user of this.friendsList){
      if (user.profileImageUrl === '') {
        user.profileImageUrl = '/assets/images/default-user.png';
      }
    }
  }

  getFriendsList() {
    this.friend.getAllFriendsOfUser().subscribe((response: any) => {
      this.friendsList = response;
      this.assignDefaultValues();
    });
  }

  ngOnInit() {
    this.updateFriendsListSubscription = this.friend.updateFriendsList.subscribe(() => {
      this.getFriendsList();
    });
    this.getFriendsList();
    this.friendFilter = '';
  }

  ngOnDestroy(): void {
    this.updateFriendsListSubscription.unsubscribe();
  }

  clearSearch() {
    this.friendFilter = '';
    this.searchInput.nativeElement.focus();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
