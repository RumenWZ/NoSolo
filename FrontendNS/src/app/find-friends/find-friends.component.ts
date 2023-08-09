import { Component } from '@angular/core';
import { UserGameService } from '../services/user-game.service';
import { MatchedUserDTO } from '../model/user-game';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css']
})
export class FindFriendsComponent {
  token: string;
  matches: MatchedUserDTO[];

  constructor(
    private userGame: UserGameService
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.userGame.getMatchesForUser(this.token).subscribe((response: MatchedUserDTO[]) => {
      this.matches = response;
    });

  }
}
