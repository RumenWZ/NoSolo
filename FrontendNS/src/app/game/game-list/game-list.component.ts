import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { Game } from 'src/app/model/game';
import { AlertifyService } from 'src/app/services/alertify.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent {
  gamesList: Game[] = [];
  gamePendingDeletion: Game;
  getGamesErrorMessage: string = null;
  filterString: string;
  gameListSortOrder : string;
  sortButtonIcon = "<i class='bx bx-sort-up'></i>";

  constructor(
    private gameService: GameService,
    private alertify: AlertifyService
  ) {}

  confirmDeleteGame(game: Game) {
    this.gamePendingDeletion = game;
  }

  deleteGame(){
    this.gameService.deleteGame(this.gamePendingDeletion.id).subscribe(() => {
      this.alertify.success(this.gamePendingDeletion.name + " successfully deleted from database");
      this.getGamesList();
    }, error => {
      this.alertify.error(error.error);
    })
  }

  getGamesList() {
    this.gameService.getGamesList().subscribe((games: any) => {
      if (games) {
        this.gamesList = games;
      }
    }, error => {
      this.getGamesErrorMessage = error.message;
      console.log(error);
    });
  }

  onSortGamesList() {
    this.gameListSortOrder = this.gameListSortOrder === 'ascending' ? 'descending' : 'ascending';
  }

  ngOnInit() {
    this.getGamesList();
    this.filterString = '';
    this.gameListSortOrder = 'ascending';
  }

}
