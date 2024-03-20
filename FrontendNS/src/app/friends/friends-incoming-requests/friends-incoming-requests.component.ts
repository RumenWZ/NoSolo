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
  searchParameters: string;

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

  clearSearch() {
    this.searchParameters = '';
  }

  getIncomingFriendRequests() {
    this.friend.getIncomingFriendRequests().subscribe((response: any) => {
      this.incomingFriendRequests = response;
      this.assignDefaultValues();
    });
  }

  onUserClick(user: UserDTO) {
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: 'auto',
      maxWidth: '100vw'
    })
    dialogRef.componentInstance.cardClosed.subscribe(() => {
      dialogRef.close();
    });
    this.user.raiseCurrentUserProfileCard(user);
  }


  onAcceptFriendRequest(event: Event, user: UserDTO) {
    event.stopPropagation();
    this.friend.acceptFriendRequest(user.username).subscribe((response: any) => {
      if (response == 201) {
        this.incomingFriendRequests = this.incomingFriendRequests.filter((incomingUser: UserDTO) => {
          return incomingUser.username !== user.username;
        });
      }
    })
  }

  onDenyFriendRequest(event: Event, user: UserDTO) {
    event.stopPropagation();
    this.friend.removeFriend(user.username).subscribe((response: any) => {
      if (response == 201) {
        this.incomingFriendRequests = this.incomingFriendRequests.filter((incomingUser: UserDTO) => {
          return incomingUser.username !== user.username;
        });
      }
    })
  }

  ngOnInit() {
    this.searchParameters = '';

    this.getIncomingFriendRequests();
  }
}
