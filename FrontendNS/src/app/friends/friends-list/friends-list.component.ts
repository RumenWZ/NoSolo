import { Component, EventEmitter, Input, Output } from '@angular/core';
import { friendsList } from '../friendsListObjectsForTesting';
import { FriendService } from 'src/app/services/friend.service';
import { User, UserDTO } from 'src/app/model/user';
import { SidenavService } from 'src/app/services/sidenav.service';

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

  constructor(
    private friend: FriendService,
    private sidenav: SidenavService
  ) {
    this.friend.chattingWithUser.subscribe((value: UserDTO) => {
      this.selectedFriend = value;
    });
  }

  onFriendClick(user: any) {
    this.selectedFriend = user;
    this.friend.raiseCurrentChatUser(user);
    if (window.innerWidth < 768) {
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

  ngOnInit() {
    this.friend.getAllFriendsOfUser(localStorage.getItem('token')).subscribe((response: any) => {
      this.friendsList = response;
      this.assignDefaultValues();
    })
  }
}
