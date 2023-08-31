import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from 'src/app/confirm-delete/confirm-delete.component';
import { UserGameDTO } from 'src/app/model/user-game';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserGameService } from 'src/app/services/user-game.service';


@Component({
  selector: 'app-user-game-details',
  templateUrl: './user-game-details.component.html',
  styleUrls: ['./user-game-details.component.css']
})
export class UserGameDetailsComponent implements OnChanges {
  @Input() game: UserGameDTO;
  @Output() gameDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() gameUpdated: EventEmitter<void> = new EventEmitter<void>();

  username = localStorage.getItem('userName');
  userDescription: string;
  gameDescriptionPlaceholder =
    `Describe your playstyle (casual/ranked) and what you are looking for in other players that play this game. Share your relevant experience in the game.\n\nThis information will be displayed to other players.`;


  constructor(
    private usrGame: UserGameService,
    private alertify: AlertifyService,
    private matDialog: MatDialog
  ) {}



  onDelete() {
    this.usrGame.deleteUserGame(this.game.userGameId).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success(`${this.game.gameName} deleted from your games list`);
        this.gameDeleted.emit();
      }
    });
  }

  confirmDelete() {
    const dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
      width: '500px',
      data: {
        itemName: this.game.gameName,
        displayMessage: `Are you sure you want to remove ${this.game.gameName} from your games list?`,
        confirmButtonName: 'Delete'
      }
    })

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.onDelete();
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCancelled.subscribe(() => {
      dialogRef.close();
    })
  }

  onUpdate() {
    if (this.userDescription == '') {
      this.alertify.warning('Your game description can not be empty');
      return;
    }

    this.usrGame.updateUserGame(this.game.userGameId, this.userDescription).subscribe((response: any) => {
      if (this.userDescription == response.userDescription) {
        this.alertify.success(`Successfully updated your description for ${this.game.gameName}`);
        this.gameUpdated.emit();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['game'] && changes['game'].currentValue) {
      this.userDescription = this.game.userDescription;
    }
  }

  ngOnInit() {
    this.userDescription = this.game.userDescription;
  }
}
