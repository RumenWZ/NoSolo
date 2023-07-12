import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO, UserSearchResult } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends-add',
  templateUrl: './friends-add.component.html',
  styleUrls: ['./friends-add.component.css']
})
export class FriendsAddComponent {
  searchParameters: string;
  searchResults: UserSearchResult[];
  userToken: string;

  constructor(
    private user: UserService,
    private router: Router,
    private friend: FriendService
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
    this.router.navigate([`view-profile/${user.username}`]);
  }

  searchUsers() {
    this.user.findUsers(this.userToken, this.searchParameters).subscribe((response: any) => {
      this.searchResults = response;
      console.log(this.searchResults);
      this.assignDefaultValues();
    })
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
