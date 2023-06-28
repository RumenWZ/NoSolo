import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';

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
    private router: Router
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

  test() {

  }

  onUserClick (user: UserDTO) {
    this.router.navigate([`/view-profile/${user.username}`]);
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

  }

  ngOnInit() {
    this.token = localStorage.getItem('token');

    this.getIncomingFriendRequests();
  }
}
