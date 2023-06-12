import { Component } from '@angular/core';
import { friendsList } from '../friends-page/friendsListObjectsForTesting';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  friendsList = friendsList;
}
