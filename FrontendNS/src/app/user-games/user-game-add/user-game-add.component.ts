  import { Component } from '@angular/core';
  import { Game } from 'src/app/model/game';
  import { GameService } from 'src/app/services/game.service';

  @Component({
    selector: 'app-user-game-add',
    templateUrl: './user-game-add.component.html',
    styleUrls: ['./user-game-add.component.css']
  })
  export class UserGameAddComponent {
    gameList: Game[];
    filterString: '';
    isDropdownVisible: boolean;
    gameDescription: string;
    selectedGame: Game;
    userGameDescription = '';
    gameDescriptionPlaceholder =
    `Describe your playstyle (casual/ranked) and what you are looking for in other players. Share your relevant experience in the game.\n\nThis information will be displayed to other players.`;

    constructor(
      private gameService: GameService
      ) {}

    showDropdownList() {
      this.isDropdownVisible = true;
    }

    hideDropdownList() {
      setTimeout(() => {
        this.isDropdownVisible = false;
      }, 150);
    }

    clearInput() {
      this.filterString = '';
    }

    onSelectGame(game: Game) {
      this.selectedGame = game;
      this.clearInput();
    }

    clearSelectedGame() {
      this.selectedGame = null;
    }

    ngOnInit() {
      this.clearInput();
      this.isDropdownVisible = false;
      this.gameService.getGamesList().subscribe((response: any) => {
        this.gameList = response;
      })
    }
  }
