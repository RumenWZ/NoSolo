  import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
  import { Game } from 'src/app/model/game';
import { UserGame } from 'src/app/model/user';
  import { GameService } from 'src/app/services/game.service';

  @Component({
    selector: 'app-user-game-add',
    templateUrl: './user-game-add.component.html',
    styleUrls: ['./user-game-add.component.css']
  })
  export class UserGameAddComponent {
    userGame: UserGame = {description: null, userId: null, gameId: null};
    gameList: Game[];
    filterString: '';
    isDropdownVisible: boolean;
    gameDescription: string;
    selectedGame: Game = null;
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

    onSubmit(gameForm: NgForm) {
      this.userGame.description = gameForm.form.value.description;
      this.userGame.gameId = this.selectedGame.id;
      console.log(this.userGame.description);
    }

    ngOnInit() {
      this.clearInput();
      this.isDropdownVisible = false;
      this.gameService.getGamesList().subscribe((response: any) => {
        this.gameList = response;
      })
    }
  }
