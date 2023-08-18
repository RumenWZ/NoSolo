import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from 'src/app/confirm-delete/confirm-delete.component';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';
import { ProfileCardComponent } from 'src/app/user/profile-card/profile-card.component';

@Component({
  selector: 'app-friends-all',
  templateUrl: './friends-all.component.html',
  styleUrls: ['./friends-all.component.css']
})
export class FriendsAllComponent {
  friendsList: UserDTO[];
  searchParameters: string;

  constructor(
    private friend: FriendService,
    private user: UserService,
    private matDialog: MatDialog
  ) {}

  assignDefaultValues() {
    for (let user of this.friendsList){
      if (user.profileImageUrl === '') {
        user.profileImageUrl = '/assets/images/default-user.png';
      }
      if (user.displayName === '') {
        user.displayName = user.username;
      }
    }
  }

  clearSearch() {
    this.searchParameters = '';
  }

  onFriendClick(user: UserDTO) {
    const dialogRef = this.matDialog.open(ProfileCardComponent, {
      width: '470px'
    })
    this.user.raiseCurrentUserProfileCard(user);
  }

  onChatBubble(user: UserDTO) {
    this.friend.raiseCurrentChatUser(user);
  }

  onRemoveFriend(event: Event, user: UserDTO) {
    event.stopPropagation();

    const dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
      width: '500px',
      data: {
        displayMessage: `Are you sure you want to remove ${user.displayName} from your friends list?`,
        confirmButtonName: 'Remove'
      }
    })

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.removeFriend(user);
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCancelled.subscribe(() => {
      dialogRef.close();
    })
  }

  removeFriend(user: UserDTO) {
    this.friend.removeFriend(localStorage.getItem('token'), user.username).subscribe((response: any) => {
      if (response == 201) {
        this.friendsList = this.friendsList.filter(friend => friend.username !== user.username);
      }
    });
  }

  ngOnInit() {
    this.searchParameters = '';
    this.friend.getAllFriendsOfUser(localStorage.getItem('token')).subscribe((response: any) => {
      this.friendsList = response;
      this.assignDefaultValues();
    })
  }
}
