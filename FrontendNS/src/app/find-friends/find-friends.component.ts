import { Component, EventEmitter, Output } from '@angular/core';
import { UserGameService } from '../services/user-game.service';
import { MatchedUserDTO, UserGameDTO } from '../model/user-game';
import { UserDTO } from '../model/user';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css']
})
export class FindFriendsComponent {
  token: string;
  matches: MatchedUserDTO[];
  currentDisplayedUser: UserDTO;
  currentDisplayedUserGames: UserGameDTO[];
  currentUserIndex: number = 0;
  @Output() userSelected = new EventEmitter<UserDTO>();
  @Output() userSelectedGames = new EventEmitter<UserGameDTO[]>();
  dataReady: boolean = false;

  nextDisplayedUser: UserDTO;
  nextDisplayedUserGames: UserGameDTO[];
  isAnimating: boolean = false;
  canSelectNextUser: boolean;

  constructor(
    private userGame: UserGameService,
  ) {}

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
    this.selectNextUser();
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.userGame.getMatchesForUser(this.token).subscribe((response: MatchedUserDTO[]) => {
      this.matches = response;
      this.currentDisplayedUser = this.matches[0].user;
      this.currentDisplayedUserGames = this.matches[0].userGames;
      this.userSelected.emit(this.currentDisplayedUser);
      this.userSelectedGames.emit(this.currentDisplayedUserGames);
      this.dataReady = true;
      if(this.matches.length > 0) {
        this.canSelectNextUser = true;
      }
    });
  }
}
