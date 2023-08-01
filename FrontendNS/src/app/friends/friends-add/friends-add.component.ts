import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserSearchResult } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';
import { ProfileCardComponent } from 'src/app/user/profile-card/profile-card.component';

@Component({
  selector: 'app-friends-add',
  templateUrl: './friends-add.component.html',
  styleUrls: ['./friends-add.component.css']
})
export class FriendsAddComponent {
  searchParameters: string;
  searchResults: UserSearchResult[];
  userToken: string;

  currentPage = 1;
  itemsPerPage = 8;

  constructor(
    private user: UserService,
    private router: Router,
    private friend: FriendService,
    private matDialog: MatDialog
  ) {

  }

  assignDefaultValues() {
    for (let user of this.searchResults){
      if (user.profileImageUrl === '') {
        user.profileImageUrl = '/assets/images/default-user.png';
      }
      if (user.displayName === '') {
        user.displayName = user.username;
      }
    }
  }

  onUserClick(user: UserSearchResult){
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: '470px'
    })
    this.user.raiseCurrentUserProfileCard(user);
  }

  searchUsers() {
    if (this.searchParameters != '') {
      this.user.findUsers(this.userToken, this.searchParameters).subscribe((response: any) => {
        this.searchResults = response;
        this.assignDefaultValues();
        this.currentPage = 1;
      });
    }
  }

  onAddFriend(user: UserSearchResult) {
    this.friend.sendFriendRequest(this.userToken, user.username).subscribe((response: any) => {
      if (response == 201) {
        const foundUser = this.searchResults.find((x) => x.username === user.username);
        foundUser.friendStatus = 'pending';
      }
    })

  }

  onCancelRequest(user: UserSearchResult) {
    this.friend.removeFriend(this.userToken, user.username).subscribe((response: any) => {
      if (response == 201) {
        const foundUser = this.searchResults.find((x) => x.username === user.username);
        foundUser.friendStatus = '';
      }
    })
  }

  ngOnInit() {
    this.userToken = localStorage.getItem('token');
  }
}
