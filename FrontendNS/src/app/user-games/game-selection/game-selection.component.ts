import { Component, EventEmitter, Output } from '@angular/core';
import { UserGameDTO } from 'src/app/model/user-game';
import { GameService } from 'src/app/services/game.service';
import { UserGameService } from 'src/app/services/user-game.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.css']
})
export class GameSelectionComponent {
  selectedGame: UserGameDTO = undefined;

  userGameList: any[];
  addGameCardEnabled: boolean = true;
  userGameDetailsEnabled: boolean = false;
  username = localStorage.getItem('userName');


  constructor(
    private gameService: GameService,
    private user: UserService,
    private usrGame: UserGameService
  ) {}

  onAddGame() {
    this.addGameCardEnabled = true;
    this.userGameDetailsEnabled = false;
  }

  onMyGame(game: UserGameDTO) {
    this.userGameDetailsEnabled = true;
    this.addGameCardEnabled = false;
    this.selectedGame = game;
  }

  updateGameList() {
    this.usrGame.getUserGames(this.username).subscribe((response: any) => {
      this.userGameList = response;
    });
    this.userGameDetailsEnabled = true ? false : true;
  }

  ngOnInit() {
    this.updateGameList();
  }
}
