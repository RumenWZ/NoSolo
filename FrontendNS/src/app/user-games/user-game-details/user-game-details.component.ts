import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserGameDTO } from 'src/app/model/user-game';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserGameService } from 'src/app/services/user-game.service';


@Component({
  selector: 'app-user-game-details',
  templateUrl: './user-game-details.component.html',
  styleUrls: ['./user-game-details.component.css']
})
export class UserGameDetailsComponent {
  @Input() game: UserGameDTO;
  @Output() gameDeleted: EventEmitter<void> = new EventEmitter<void>();

  username = localStorage.getItem('userName');
  userDescription: string;
  newDescription: string;

  constructor(
    private usrGame: UserGameService,
    private alertify: AlertifyService
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

  ngOnInit() {
    console.log(this.game);
    this.userDescription = this.game.userDescription;
    // this.user.getUserGame(this.username, this.gameSelected.id).subscribe((response: any)=> {
    //   this.game = response;
    //   console.log(response);
    // });
  }
}
