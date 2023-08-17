import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { UserGameService } from '../services/user-game.service';
import { MatchedUserDTO, UserGameDTO } from '../model/user-game';
import { UserDTO } from '../model/user';
import { FriendService } from '../services/friend.service';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css']
})
export class FindFriendsComponent {
  isSmallScreen: boolean;
  token: string;
  matches: MatchedUserDTO[];
  currentDisplayedUser: UserDTO;
  currentDisplayedUserGames: UserGameDTO[];
  currentUserIndex: number = 0;
  @Output() userSelected = new EventEmitter<UserDTO>();
  @Output() userSelectedGames = new EventEmitter<UserGameDTO[]>();
  dataReady: boolean = false;

  canSelectNextUser: boolean;

  friendRequestSent: boolean = false;

  constructor(
    private userGame: UserGameService,
    private friend: FriendService,
    private alertify: AlertifyService,
    private user: UserService
  ) {
    this.isSmallScreen = window.innerWidth < 768;
  }

  selectNextUser() {
    this.currentUserIndex += 1;
    if (this.currentUserIndex < this.matches.length) {
      this.currentDisplayedUser = this.matches[this.currentUserIndex].user;
      this.currentDisplayedUserGames = this.matches[this.currentUserIndex].userGames;
      this.userSelected.emit(this.currentDisplayedUser);
      this.userSelectedGames.emit(this.currentDisplayedUserGames);
    } else {
      this.canSelectNextUser = false;
    }
  }

  onSelectNo() {
    this.selectNextUser();
  }

  onSelectYes() {
    this.canSelectNextUser = false;
    this.friend.sendFriendRequest(this.token, this.currentDisplayedUser.username).subscribe((response: any) => {
      if (response == 201) {
        this.alertify.success('Friend request sent.');
      }
      this.canSelectNextUser = true;
      this.selectNextUser();
    })
  }

  ngOnInit() {
    this.user.verifyLoggedIn();
    this.token = localStorage.getItem('token');
    this.userGame.getMatchesForUser(this.token).subscribe((response: MatchedUserDTO[]) => {
      this.matches = response;
      if (this.matches.length > 0) {
        this.currentDisplayedUser = this.matches[0].user;
        this.currentDisplayedUserGames = this.matches[0].userGames;
        this.canSelectNextUser = true;
      }
      this.dataReady = true;
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
