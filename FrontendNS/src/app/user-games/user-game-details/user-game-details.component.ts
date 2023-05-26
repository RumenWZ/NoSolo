import { Component, Input } from '@angular/core';
import { UserGame, UserGameDTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-game-details',
  templateUrl: './user-game-details.component.html',
  styleUrls: ['./user-game-details.component.css']
})
export class UserGameDetailsComponent {
  @Input() game: UserGameDTO;
  username = localStorage.getItem('userName');
  userDescription: string;
  newDescription: string;

  constructor(
    private user: UserService
  ) {}



  ngOnInit() {
    console.log(this.game);
    this.userDescription = this.game.userDescription;
    // this.user.getUserGame(this.username, this.gameSelected.id).subscribe((response: any)=> {
    //   this.game = response;
    //   console.log(response);
    // });
  }
}
