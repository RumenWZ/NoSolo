import { Component } from '@angular/core';
import { FriendService } from 'src/app/services/friend.service';

@Component({
  selector: 'app-friends-incoming-requests',
  templateUrl: './friends-incoming-requests.component.html',
  styleUrls: ['./friends-incoming-requests.component.css']
})
export class FriendsIncomingRequestsComponent {
  incomingFriendRequests: any;

  constructor(
    private friend: FriendService
  ) {}

  ngOnInit() {
    
  }
}
