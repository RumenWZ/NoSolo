import { Component } from '@angular/core';
import { FriendService } from 'src/app/services/friend.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-friends-page-sidenav',
  templateUrl: './friends-page-sidenav.component.html',
  styleUrls: ['./friends-page-sidenav.component.css']
})
export class FriendsPageSidenavComponent {
  constructor(
    private friend: FriendService,
    private sidenav: SidenavService
    ) {}


  closeSidenav() {
    this.sidenav.toggleFriendsSidenav();
  }

  onCloseButton() {
    this.closeSidenav();
  }

  onFriendsAll() {
    this.friend.openFriendsAll.emit();
    this.closeSidenav();
  }

  onFriendsPending() {
    this.friend.openFriendsPending.emit();
    this.closeSidenav();
  }

  onFriendsAdd() {
    this.friend.openFriendsAdd.emit();
    this.closeSidenav();
  }

  onFriendsRequested() {
    this.friend.openFriendsRequested.emit();
    this.closeSidenav();
  }

  ngOnInit() {

  }
}
