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
    }, error => {
      this.alertify.error(error.message);
    });
  }

  confirmDelete() {
    const dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
      width: '500px',
      data: {itemName: this.game.gameName}
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
    this.usrGame.updateUserGame(this.game.userGameId, this.userDescription).subscribe((response: any) => {
      if (this.userDescription == response.userDescription) {
        this.alertify.success(`Successfully updated your description for ${this.game.gameName}`);
        this.gameUpdated.emit();
      }
    }, error => {
      this.alertify.error(error.error);
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
