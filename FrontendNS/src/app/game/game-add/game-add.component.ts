import { Component } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css']
})
export class GameAddComponent {
  gameAddForm!: FormGroup
  game: Game = { name: '', image: null };
  userSubmitted: boolean;
  image: File;


  constructor(
    private gameService: GameService
  ) {}

  getImage(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit(gameForm: NgForm) {
    this.game.image = this.image;
    this.game.name = gameForm.form.value.name;
    if (gameForm.valid) {
      this.gameService.addGame(this.game).subscribe(() => {
        gameForm.reset();
      })
    }
  }
}
