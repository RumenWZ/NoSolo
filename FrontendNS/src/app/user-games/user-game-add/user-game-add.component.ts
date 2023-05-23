  import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs';
  import { Game } from 'src/app/model/game';
import { UserGame } from 'src/app/model/user';
  import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

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
      private gameService: GameService,
      private user: UserService
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

    // onSubmit(gameForm: NgForm) {
    //   var userId : number;
    //   var username = localStorage.getItem('userName');
    //   this.user.getUserByUsername(username).subscribe((response: any) => {
    //     userId = response;
    //     console.log(response);
    //   });
    //   this.userGame.description = gameForm.form.value.description;
    //   this.userGame.gameId = this.selectedGame.id;
    //   this.userGame.userId = userId;
    //   console.log(userId);

    //   this.user.addUserGame(this.userGame).subscribe((response: any) => {
    //     console.log(response);
    //   })
    //   console.log(this.userGame.description);
    // }

    onSubmit(gameForm: NgForm) {
      const username = localStorage.getItem('userName');

      this.user.getUserByUsername(username).pipe(
        switchMap((response: any) => {
          const userId = response.id;
          this.userGame.description = gameForm.form.value.description;
          this.userGame.gameId = this.selectedGame.id;
          this.userGame.userId = userId;
          return this.user.addUserGame(this.userGame)
        })
      ).subscribe((response: any) => {
        console.log(response);
      });
    }

    ngOnInit() {

      this.clearInput();
      this.isDropdownVisible = false;
      this.gameService.getGamesList().subscribe((response: any) => {
        this.gameList = response;
      })
    }
  }
