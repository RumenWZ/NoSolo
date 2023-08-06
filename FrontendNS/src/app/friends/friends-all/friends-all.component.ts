import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';
import { ProfileCardComponent } from 'src/app/user/profile-card/profile-card.component';

@Component({
  selector: 'app-friends-all',
  templateUrl: './friends-all.component.html',
  styleUrls: ['./friends-all.component.css']
})
export class FriendsAllComponent {
  friendsList: UserDTO[];

  constructor(
    private friend: FriendService,
    private user: UserService,
    private matDialog: MatDialog
  ) {}

  assignDefaultValues() {
    for (let user of this.friendsList){
      if (user.profileImageUrl === '') {
        user.profileImageUrl = '/assets/images/default-user.png';
      }
      if (user.displayName === '') {
        user.displayName = user.username;
      }
    }
  }

  onFriendClick(user: UserDTO) {
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: '470px'
    })
    this.user.raiseCurrentUserProfileCard(user);
  }

  onChatBubble(user: UserDTO) {
    this.friend.raiseCurrentChatUser(user);
  }

  onRemoveFriend(user: UserDTO) {
    this.friend.removeFriend(localStorage.getItem('token'), user.username).subscribe();
    this.friendsList = this.friendsList.filter(friend => friend.username !== user.username);
  }

  ngOnInit() {
    this.friend.getAllFriendsOfUser(localStorage.getItem('token')).subscribe((response: any) => {
      this.friendsList = response;
      this.assignDefaultValues();
    })
  }
}
