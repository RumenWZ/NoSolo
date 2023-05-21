import { Component } from '@angular/core';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.css']
})
export class GameSelectionComponent {
  gamesList: Game[];
  addGameCardEnabled: boolean = true;
  userGameList: Game[];

  constructor(
    private gameService: GameService
  ) {}

  onAddGame() {
    console.log("test");
  }

  onMyGame(gameId: number) {
    console.log(`Game ${gameId} clicked`)
    this.addGameCardEnabled = false;
  }

  ngOnInit() {
    this.gameService.getGamesList().subscribe((response: any) => {
      this.gamesList = response;
    })
  }
}
