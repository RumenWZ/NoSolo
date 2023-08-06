import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';
import { ProfileCardComponent } from 'src/app/user/profile-card/profile-card.component';

@Component({
  selector: 'app-friends-incoming-requests',
  templateUrl: './friends-incoming-requests.component.html',
  styleUrls: ['./friends-incoming-requests.component.css']
})
export class FriendsIncomingRequestsComponent {
  incomingFriendRequests: any;
  token: string;

  constructor(
    private friend: FriendService,
    private router: Router,
    private matDialog: MatDialog,
    private user: UserService
  ) {

  }

  assignDefaultValues() {
    for (let user of this.incomingFriendRequests){
      if (user.profileImageUrl === '') {
        user.profileImageUrl = '/assets/images/default-user.png';
      }
    }
  }

  getIncomingFriendRequests() {
    this.friend.getIncomingFriendRequests(this.token).subscribe((response: any) => {
      this.incomingFriendRequests = response;
      this.assignDefaultValues();
    });
  }

  onUserClick(user: UserDTO) {
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: '470px'
    })
    this.user.raiseCurrentUserProfileCard(user);
  }


  onAcceptFriendRequest(event: Event, user: UserDTO) {
    event.stopPropagation();
    this.friend.acceptFriendRequest(this.token, user.username).subscribe((response: any) => {
      if (response == 201) {
        this.incomingFriendRequests = this.incomingFriendRequests.filter((incomingUser: UserDTO) => {
          return incomingUser.username !== user.username;
        });
      }
    })
  }

  onDenyFriendRequest(event: Event, user: UserDTO) {
    event.stopPropagation();
    this.friend.removeFriend(this.token, user.username).subscribe((response: any) => {
      if (response == 201) {
        this.incomingFriendRequests = this.incomingFriendRequests.filter((incomingUser: UserDTO) => {
          return incomingUser.username !== user.username;
        });
      }
    })
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');

    this.getIncomingFriendRequests();
  }
}
