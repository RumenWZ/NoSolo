import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserGameDTO } from 'src/app/model/user-game';
import { UserGameService } from 'src/app/services/user-game.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.css']
})
export class GameSelectionComponent {
  selectedGame: UserGameDTO = undefined;
  cachedUserData: string;

  userGameList: any[];
  addGameCardEnabled: boolean = true;
  userGameDetailsEnabled: boolean = false;
  username = localStorage.getItem('userName');


  constructor(
    private usrGame: UserGameService,
    private router: Router,
    private user: UserService
  ) {
    this.cachedUserData = localStorage.getItem('user');
  }

  onAddGame() {
    this.addGameCardEnabled = true;
    this.userGameDetailsEnabled = false;
  }

  onMyGame(game: UserGameDTO) {
    this.userGameDetailsEnabled = true;
    this.addGameCardEnabled = false;
    this.selectedGame = game;
  }


  updateGameList(afterOperation?: string) {
    this.usrGame.getUserGames(this.username).subscribe((response: any) => {
      this.userGameList = response;
    });

    if (afterOperation === 'delete') {
      this.userGameDetailsEnabled = false;
    }
  }

  ngOnInit() {
    if (this.user.verifyLoggedIn()) {
      console.log('retrieving')
      this.updateGameList();
    }
  }
}
