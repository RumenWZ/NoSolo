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
  @Output() userSelected = new EventEmitter<UserDTO>();
  dataReady: boolean = false;


  constructor(
    private userGame: UserGameService,
  ) {}

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
