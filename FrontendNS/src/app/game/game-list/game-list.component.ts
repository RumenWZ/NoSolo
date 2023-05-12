import { Component } from '@angular/core';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent {
  gamesList: any;

  constructor(
    private gameService: GameService
  ) {}


  ngOnInit() {
    this.gameService.getGamesList().subscribe((games: any) => {
      this.gamesList = games;
    });
  }
}
