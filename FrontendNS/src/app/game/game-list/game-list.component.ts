import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ConfirmDeleteComponent } from 'src/app/confirm-delete/confirm-delete.component';
import { Game } from 'src/app/model/game';
import { AlertifyService } from 'src/app/services/alertify.service';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

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

  currentPage = 1;
  itemsPerPage = 7;

  constructor(
    private gameService: GameService,
    private alertify: AlertifyService,
    private matDialog: MatDialog,
    private user: UserService
  ) {}

  confirmDeleteGame(game: Game) {
    this.gamePendingDeletion = game;
    const dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
      width: '500px',
      data: {
        displayMessage: `Are you sure you want to delete ${this.gamePendingDeletion.name}?`,
        confirmButtonName: 'Delete'
      }
    });

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteGame();
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCancelled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteGame(){
    this.gameService.deleteGame(this.gamePendingDeletion.id).subscribe((response: any) => {
      if (response == 201) {
        this.alertify.success(this.gamePendingDeletion.name + " successfully deleted from database");
        this.getGamesList();
      }
    })
  }

  getGamesList() {
    this.gameService.getGamesList().subscribe((games: any) => {
      if (games) {
        this.gamesList = games;
      }
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
