import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { Friend } from 'src/app/model/friend';
import { UserDTO } from 'src/app/model/user';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent {
  parameterUsername: string;
  token: string;
  user: UserDTO;
  isMyOwnProfile: boolean;
  myUsername: string;
  isValidUsername: boolean;
  showDiscordUsername: boolean;
  areFriends: boolean;
  sentFriendRequest: boolean;
  loggedInUser: UserDTO;
  cachedUserDetails: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private friend: FriendService
    ) {
    this.token = localStorage.getItem('token');
    this.cachedUserDetails = localStorage.getItem('user');
  }

  onSendFriendRequest() {

  }

  assignDefaultValues(value: any) {
    if (value.profileImageUrl === '') {
      this.user.profileImageUrl = '/assets/images/default-user.png';
    }
    if (value.summary == '') {
      this.user.summary = 'No information given.'
    }
  }


  getUserDetails() {
    if (this.cachedUserDetails) {
      this.loggedInUser = JSON.parse(this.cachedUserDetails);

      if (this.loggedInUser.username != this.parameterUsername) {
        this.isMyOwnProfile = false;

        this.userService.getUserByUsername(this.parameterUsername).subscribe((response: any) => {
          if (response.error) {
            this.isValidUsername = false;
          } else {
            this.isValidUsername = true;
            this.user = response;
            this.assignDefaultValues(response);

          }

          this.friend.getFriendship(this.token, this.parameterUsername).subscribe((response: Friend) => {
            console.log(response);
            console.log(response.user2Id, this.user.id);
            if (response.status === 'pending' && response.user2Id !== this.user.id) {
              this.sentFriendRequest = true;
            }
          });

        });
      } else {
        this.isValidUsername = true;
        this.user = this.loggedInUser;
        this.assignDefaultValues(this.user);
        this.isMyOwnProfile = true;
      }
    } else {
      this.userService.getUserByUsername(this.parameterUsername).subscribe((response: any) => {
        if (response.error) {
          this.isValidUsername = false;
        } else {
          this.isValidUsername = true;
          this.user = response;
          if (response.profileImageUrl === '') {
            this.user.profileImageUrl = '/assets/images/default-user.png';
          }
        }
      });
    }
  }


  toggleDiscordUsername() {
    this.showDiscordUsername = !this.showDiscordUsername;
  }

  test() {
    console.log(this.isMyOwnProfile);
  }

  ngOnInit() {
    this.parameterUsername = this.route.snapshot.paramMap.get('username');

    this.getUserDetails();

  }
}
