import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.css']
})
export class GameSelectionComponent {
  userGameList: any[];
  addGameCardEnabled: boolean = true;
  username = localStorage.getItem('userName');

  constructor(
    private gameService: GameService,
    private user: UserService
  ) {}

  onAddGame() {
    console.log("test");
  }

  onMyGame(gameId: number) {
    console.log(`Game ${gameId} clicked`)
    this.addGameCardEnabled = false;
  }

  ngOnInit() {
    this.user.getUserGames(this.username).subscribe((response: any) => {
      this.userGameList = response;
    })
  }
}
