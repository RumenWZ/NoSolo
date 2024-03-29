  import { Location } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs';
  import { Game } from 'src/app/model/game';
import { UserDTO } from 'src/app/model/user';
import { UserGame } from 'src/app/model/user-game';
import { AlertifyService } from 'src/app/services/alertify.service';
  import { GameService } from 'src/app/services/game.service';
import { UserGameService } from 'src/app/services/user-game.service';
import { UserService } from 'src/app/services/user.service';

  @Component({
    selector: 'app-user-game-add',
    templateUrl: './user-game-add.component.html',
    styleUrls: ['./user-game-add.component.css']
  })
  export class UserGameAddComponent {
    @Output() gameAdded: EventEmitter<void> = new EventEmitter<void>();

    userGame: UserGame = {description: null, gameId: null};
    userGameList: UserGame[];
    gameList: Game[];
    username = localStorage.getItem('userName');
    filterString: '';
    isDropdownVisible: boolean;
    gameDescription: string;
    selectedGame: Game = null;
    userGameDescription = '';
    gameDescriptionPlaceholder =
    `Describe your playstyle (casual/ranked) and what you are looking for in other players that play this game. Share your relevant experience in the game.\n\nThis information will be displayed to other players.`;
    cachedUser: string;

    constructor(
      private gameService: GameService,
      private user: UserService,
      private alertify: AlertifyService,
      private location: Location,
      private usrGame: UserGameService
      ) {
        this.cachedUser = localStorage.getItem('user');
      }

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
      if (this.userGameList.length >= 5) {
        this.alertify.warning('You can not have more than 5 games added at a time');
        return;
      }
      this.userGame.description = gameForm.form.value.description;
      this.userGame.gameId = this.selectedGame.id;
      this.usrGame.addUserGame(this.userGame).subscribe((response: any) => {
        if (response == 201) {
          this.alertify.success(`${this.selectedGame.name} has been added to your games list`);
          this.userGameList.push(this.userGame);
          this.selectedGame = undefined;
          gameForm.resetForm();
          this.gameAdded.emit();
        }
      });
    }

    ngOnInit() {
      if (this.cachedUser) {
        this.clearInput();
        this.isDropdownVisible = false;
        this.gameService.getGamesList().subscribe((response: any) => {
          this.gameList = response;
          this.gameList.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        })
        this.usrGame.getUserGames(this.username).subscribe((response: any) => {
          this.userGameList = response;
        })
      }

    }
  }
