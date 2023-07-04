import { Component } from '@angular/core';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';

@Component({
  selector: 'app-friends-all',
  templateUrl: './friends-all.component.html',
  styleUrls: ['./friends-all.component.css']
})
export class FriendsAllComponent {
  friendsList: any[];

  constructor(
    private friend: FriendService
  ) {}

  assignDefaultValues() {
    for (let user of this.friendsList){
      if (user.profileImageUrl === '') {
        user.profileImageUrl = '/assets/images/default-user.png';
      }
    }
  }

  onChatBubble(user: UserDTO) {
    this.friend.raiseCurrentChatUser(user);
  
  }

  ngOnInit() {
    this.friend.getAllFriendsOfUser(localStorage.getItem('token')).subscribe((response: any) => {
      this.friendsList = response;
      this.assignDefaultValues();
    })
  }
}
