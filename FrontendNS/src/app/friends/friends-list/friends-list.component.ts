import { Component, EventEmitter, Output } from '@angular/core';
import { friendsList } from '../friendsListObjectsForTesting';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  friendsList = friendsList;
  @Output() friendsChatEnabled = new EventEmitter<boolean>();
  @Output() currentChatUser = new EventEmitter<any>();

  constructor(

  ) {}

  onFriendClick(user: any) {
    this.friendsChatEnabled.emit(true);
    this.currentChatUser.emit(user);
    console.log('test');
  }

  ngOnInit() {

  }
}
