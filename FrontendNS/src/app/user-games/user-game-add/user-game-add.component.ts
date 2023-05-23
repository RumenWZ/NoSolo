  import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs';
  import { Game } from 'src/app/model/game';
import { UserGame } from 'src/app/model/user';
import { AlertifyService } from 'src/app/services/alertify.service';
  import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

  @Component({
    selector: 'app-user-game-add',
    templateUrl: './user-game-add.component.html',
    styleUrls: ['./user-game-add.component.css']
  })
  export class UserGameAddComponent {
    userGame: UserGame = {description: null, userId: null, gameId: null};
    userGameList: any[];
    gameList: Game[];
    username = localStorage.getItem('userName');
    filterString: '';
    isDropdownVisible: boolean;
    gameDescription: string;
    selectedGame: Game = null;
    userGameDescription = '';
    gameDescriptionPlaceholder =
    `Describe your playstyle (casual/ranked) and what you are looking for in other players. Share your relevant experience in the game.\n\nThis information will be displayed to other players.`;

    constructor(
      private gameService: GameService,
      private user: UserService,
      private alertify: AlertifyService,
      private location: Location
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
      const isGameAlreadyAdded = this.userGameList.some(
        (userGame: UserGame) => userGame.gameId === game.id
      );

      if (isGameAlreadyAdded) {
        this.alertify.warning(`${game.name} is already added to your games list.`);
      } else {
        this.selectedGame = game;
        this.clearInput();
      }
    }

    clearSelectedGame() {
      this.selectedGame = null;
    }

    onSubmit(gameForm: NgForm) {
      this.user.getUserByUsername(this.username).pipe(
        switchMap((response: any) => {
          const userId = response.id;
          this.userGame.description = gameForm.form.value.description;
          this.userGame.gameId = this.selectedGame.id;
          this.userGame.userId = userId;
          return this.user.addUserGame(this.userGame)
        })
      ).subscribe(() => {
        this.alertify.success(`${this.selectedGame.name} succesfully added to your games list`);
      });
    }

    ngOnInit() {
      this.clearInput();
      this.isDropdownVisible = false;
      this.gameService.getGamesList().subscribe((response: any) => {
        this.gameList = response;
      })
      this.user.getUserGames(this.username).subscribe((response: any) => {
        this.userGameList = response;
      })
    }
  }
