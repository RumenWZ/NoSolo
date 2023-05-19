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

  constructor(
    private gameService: GameService
  ) {}



  ngOnInit() {
    this.gameService.getGamesList().subscribe((response: any) => {
      this.gamesList = response;
    })
  }
}
