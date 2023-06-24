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
export class ViewProfileComponent implements OnChanges {
  username: string;
  token: string;
  user: UserDTO;
  isMyOwnProfile: boolean;
  myUsername: string;
  isValidUsername: boolean;
  showDiscordUsername: boolean;
  @Input() needToUpdateDetails: boolean;
  areFriends: boolean;
  sentFriendRequest: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private friend: FriendService
    ) {
    this.token = localStorage.getItem('token');
    this.myUsername = localStorage.getItem('userName');
  }

  onSendFriendRequest() {

  }


  getUserDetails() {
    this.userService.getUserByUsername(this.username).subscribe((response: any) => {
      if (response.error) {
        this.isValidUsername = false;
      } else {
        this.isValidUsername = true;
        this.user = response;
        if (response.profileImageUrl === '') {
          this.user.profileImageUrl = '/assets/images/default-user.png';
        }
        this.isMyOwnProfile = this.username === this.myUsername;
      }

      if (!this.isMyOwnProfile) {
        this.friend.getFriendship(this.token, this.username).subscribe((response: Friend) => {
          console.log(response);
          console.log(response.user2Id, this.user.id);
          if (response.status === 'pending' && response.user2Id !== this.user.id) {
            this.sentFriendRequest = true;
          }
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['username'] && !changes['username'].firstChange) {
      this.getUserDetails();
    }
  }

  toggleDiscordUsername() {
    this.showDiscordUsername = !this.showDiscordUsername;
  }

  test() {
    console.log(this.isMyOwnProfile);
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');

    this.getUserDetails();

  }
}
