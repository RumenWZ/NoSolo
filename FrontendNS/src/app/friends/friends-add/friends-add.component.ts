import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO, UserSearchResults } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends-add',
  templateUrl: './friends-add.component.html',
  styleUrls: ['./friends-add.component.css']
})
export class FriendsAddComponent {
  searchParameters: string;
  searchResults: UserSearchResults[];
  userToken: string;

  constructor(
    private user: UserService,
    private router: Router
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

  onUserClick(user: UserDTO){
    this.router.navigate([`view-profile/${user.username}`]);
  }

  searchUsers() {
    this.user.findUsers(this.userToken, this.searchParameters).subscribe((response: any) => {
      this.searchResults = response;
      console.log(this.searchResults);
      this.assignDefaultValues();
    })
  }

  onAddFriend(user: UserDTO) {

  }

  ngOnInit() {
    this.userToken = localStorage.getItem('token');
  }
}
