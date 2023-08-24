import { Component } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { AlertifyService } from 'src/app/services/alertify.service';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

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
  validImageSelected: boolean = false;

  constructor(
    private gameService: GameService,
    private alertify: AlertifyService,
    private ng2ImgMax: Ng2ImgMaxService,
    private user: UserService,
    private router: Router
  ) {}

  getImage(event: any) {
    const file = event.target.files[0];
    const allowedFormats = ['image/jpeg', 'image/png'];

    if (allowedFormats.includes(file.type)) {
      this.image = file;

      this.ng2ImgMax.resizeImage(this.image, 400, 400).subscribe(
        result => {
          const reader = new FileReader();
          reader.readAsDataURL(this.image);
          reader.onload = () => {
            this.previewImage = reader.result;
          };
          this.validImageSelected = true;
        },
        error => {
          console.log('An error occured: ', error);
        }
      );
    } else {
      this.alertify.error('Invalid file format. Only JPEG and PNG files are allowed.');
      const fileInput = event.target;
      fileInput.value = null;
      this.previewImage = undefined;
      this.validImageSelected = false;
    }

  }

  onSubmit(gameForm: NgForm) {
    const formData = new FormData();
    formData.append('name', gameForm.form.value.name);
    formData.append('image', this.image, this.image.name);
    if (gameForm.valid) {
      this.gameService.addGame(formData).subscribe((response: any) => {
        if (response == 201) {
          gameForm.reset();
          this.alertify.success('Successfully added game to database');
          this.previewImage = null;
        }
      })
    }
  }

  ngOnInit() {
    this.user.authenticateAdmin();
  }

}
