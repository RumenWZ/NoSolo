import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';
import { ProfileCardComponent } from 'src/app/user/profile-card/profile-card.component';

@Component({
  selector: 'app-friends-requested',
  templateUrl: './friends-requested.component.html',
  styleUrls: ['./friends-requested.component.css']
})
export class FriendsRequestedComponent {
  friendRequests: UserDTO[];
  token: string;
  searchParameters: string;

  constructor(
    private friend: FriendService,
    private matDialog: MatDialog,
    private user: UserService
    ) {}

  onUserClick(user: UserDTO){
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: '470px'
    })
    this.user.raiseCurrentUserProfileCard(user);
  }

  clearSearch() {
    this.searchParameters = '';
  }

  onRemove(event: Event, user: UserDTO) {
    event.stopPropagation();

    this.friend.removeFriend(this.token, user.username).subscribe((response: any) => {
      if (response == 201) {
        this.friendRequests = this.friendRequests.filter(friend => friend.username !== user.username);
      }
    });

  }

  assignDefaultValues() {
    for (let user of this.friendRequests){
      if (user.profileImageUrl === '') {
        user.profileImageUrl = '/assets/images/default-user.png';
      }
      if (user.displayName === '') {
        user.displayName = user.username;
      }
    }
  }

  ngOnInit() {
    this.searchParameters = '';
    this.token = localStorage.getItem('token');
    this.friend.getAllFriendRequestsByUser(this.token).subscribe((response: UserDTO[]) => {
      this.friendRequests = response;
      this.assignDefaultValues();
    })
  }
}
