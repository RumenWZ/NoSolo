import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends-add',
  templateUrl: './friends-add.component.html',
  styleUrls: ['./friends-add.component.css']
})
export class FriendsAddComponent {
  searchParameters: string;
  searchResults: UserDTO[];

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
    }
  }

  onUserClick(user: UserDTO){
    this.router.navigate([`view-profile/${user.username}`]);
  }

  searchUsers() {
    this.user.findUsers(this.searchParameters).subscribe((response: any) => {
      this.searchResults = response;
      this.assignDefaultValues();
    })
  }

  ngOnInit() {

  }
}
