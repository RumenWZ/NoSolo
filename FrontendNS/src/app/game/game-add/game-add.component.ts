import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Ng2ImgMaxService } from 'ng2-img-max';
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
    private alertify: AlertifyService,
    private ng2ImgMax: Ng2ImgMaxService
  ) {}

  getImage(event: any) {
    this.image = event.target.files[0];
    this.ng2ImgMax.resizeImage(this.image, 150, 150).subscribe(
      result => {
        this.image = new File([result], result.name);
        const reader = new FileReader();
        reader.readAsDataURL(this.image);
        reader.onload = () => {
          this.previewImage = reader.result;
        };
      },
      error => {
        console.log('An error occured: ', error);
      }
    );
  }

  onSubmit(gameForm: NgForm) {
    const formData = new FormData();
    formData.append('name', gameForm.form.value.name);
    formData.append('image', this.image, this.image.name);
    if (gameForm.valid) {
      this.gameService.addGame(formData).subscribe(() => {
        gameForm.reset();
        this.alertify.success('Successfully added game to database');
        this.previewImage = null;
      }, (error) => {
        this.alertify.error(error.message);
      })
    }
  }

}
