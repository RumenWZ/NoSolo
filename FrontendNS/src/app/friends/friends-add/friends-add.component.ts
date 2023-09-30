import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  currentPage = 1;
  itemsPerPage = 8;
  skeletonLoadingCount = 8;
  fetchingData: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private user: UserService,
    private friend: FriendService,
    private matDialog: MatDialog
  ) {

  }

  getLoopRange(){
    return new Array(this.skeletonLoadingCount);
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
      this.fetchingData = true;
      this.user.findUsers(this.searchParameters).subscribe((response: any) => {
        this.searchResults = response;
        this.assignDefaultValues();
        this.currentPage = 1;
        this.fetchingData = false;
      });
    }
  }

  clearSearch() {
    this.searchParameters = '';
    this.searchInput.nativeElement.focus();
  }

  onAddFriend(user: UserSearchResult) {
    this.friend.sendFriendRequest(user.username).subscribe((response: any) => {
      if (response == 201) {
        const foundUser = this.searchResults.find((x) => x.username === user.username);
        foundUser.friendStatus = 'pending';
      }
    })

  }

  onCancelRequest(user: UserSearchResult) {
    this.friend.removeFriend(user.username).subscribe((response: any) => {
      if (response == 201) {
        const foundUser = this.searchResults.find((x) => x.username === user.username);
        foundUser.friendStatus = '';
      }
    })
  }

  ngOnInit() {
  }
}
