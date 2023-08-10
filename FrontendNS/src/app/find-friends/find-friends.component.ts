import { Component, EventEmitter, Output } from '@angular/core';
import { UserGameService } from '../services/user-game.service';
import { MatchedUserDTO } from '../model/user-game';
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
  currentUserIndex: number = 0;
  @Output() userSelected = new EventEmitter<UserDTO>();
  dataReady: boolean = false;


  constructor(
    private userGame: UserGameService,
  ) {}

  onSelectNo() {
    this.currentUserIndex += 1;
    this.currentDisplayedUser = this.matches[this.currentUserIndex].user;
    this.userSelected.emit(this.currentDisplayedUser);
  }

  onSelectYes() {
    console.log(this.dataReady);
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.userGame.getMatchesForUser(this.token).subscribe((response: MatchedUserDTO[]) => {
      this.matches = response;
      this.currentDisplayedUser = this.matches[0].user;
      this.userSelected.emit(this.currentDisplayedUser);
      this.dataReady = true;
    });
  }
}
