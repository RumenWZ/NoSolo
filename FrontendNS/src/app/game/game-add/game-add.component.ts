import { Component } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
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
  validImageSelected: boolean = false;

  constructor(
    private gameService: GameService,
    private alertify: AlertifyService,
  ) {}

  getImage(event: any) {
    const file = event.target.files[0];
    const allowedFormats = ['image/jpeg', 'image/png'];
    const maxSize = 1 * 1024 * 1024;

    if (!file) {
      this.resetImageInput(event);
      return;
    }

    if (!allowedFormats.includes(file.type)) {
      this.alertify.error('Invalid file format. Only JPEG and PNG files are allowed.');
      this.resetImageInput(event);
      return;
    }

    if (file.size > maxSize) {
      this.alertify.error('File size exceeds the limit of 1 MB.');
      this.resetImageInput(event);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width !== img.height) {
        const allowedAspectRatioRange = { min: 0.95, max: 1.05 };
        const aspectRatio = img.height / img.width;

        if (aspectRatio < allowedAspectRatioRange.min) {
          this.alertify.error('Game image is too wide.');
          this.resetImageInput(event);
          return;
        }

        if (aspectRatio > allowedAspectRatioRange.max) {
          this.alertify.error('Game image is too tall.');
          this.resetImageInput(event);
          return;
        }
      }

    this.image = file;
    const reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    this.validImageSelected = true;
    };
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

  }

  private resetImageInput(event: any) {
    const fileInput = event.target;
    fileInput.value = null;
    this.previewImage = undefined;
    this.validImageSelected = false;
  }

}
