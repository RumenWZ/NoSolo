import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { AlertifyService } from 'src/app/services/alertify.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css']
})
export class GameAddComponent {
  gameAddForm!: FormGroup
  userSubmitted: boolean;
  image: File;
  previewImage: string | ArrayBuffer

  constructor(
    private gameService: GameService,
    private alertify: AlertifyService
  ) {}

  getImage(event: any) {
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = () => {
    this.previewImage = reader.result;
  };
  }

  onSubmit(gameForm: NgForm) {
    const formData = new FormData();
    formData.append('name', gameForm.form.value.name);
    formData.append('image', this.image, this.image.name);
    if (gameForm.valid) {
      this.gameService.addGame(formData).subscribe(() => {
        gameForm.reset();
        this.alertify.success('Successfully added game to database');
      }, (error) => {
        this.alertify.error(error.error);
      })
    }
  }


}
