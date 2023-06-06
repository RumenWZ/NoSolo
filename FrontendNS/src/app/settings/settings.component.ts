import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { HttpHeaders } from '@angular/common/http';
import { AlertifyService } from '../services/alertify.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  username = localStorage.getItem('userName');
  user: User;
  image: File;
  profileImageUrl : string = '/assets/images/default-user.png';
  changes = {};
  photoChanged: boolean = false;
  displayName: string;
  initialDisplayName: string;
  discordUsername: string;
  initialDiscordUsername: string;
  summary: string;
  initialSummary: string;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private location: Location
  ) {}

  getImage(event: any) {
    const file = event.target.files[0];
    const allowedFormats = ['image/jpeg', 'image/png'];

    if (allowedFormats.includes(file.type)) {
      this.image = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {this.profileImageUrl = e.target.result;};
      reader.readAsDataURL(this.image);
      this.photoChanged = true;
    } else {
      this.alertify.error('Invalid file format. Only JPEG and PNG files are allowed.');
    }
  }

  // Test() {
  //   console.log(this.displayName);
  // }

  onSaveChanges() {
    if(this.photoChanged) {
      this.updateUserPhoto();
    }
    if (this.initialDisplayName != this.displayName) {
      this.updateDisplayName();
    }
    if (this.initialDiscordUsername != this.discordUsername) {
      this.updateDiscordUsername();
    }
    if (this.initialSummary != this.summary) {
      this.updateSummary();
    }
    this.location.go(this.location.path());
    location.reload();

  }

  private updateUserPhoto() {
    const formData = new FormData();
    formData.append('image', this.image);
    this.userService.updateUserPhoto(this.username, formData).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Changes saved successfully');
      }
    });
  }

  private updateDisplayName() {
    this.userService.updateDisplayName(this.username, this.displayName).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated display name');
      }
    });
  }

  private updateDiscordUsername() {
    this.userService.updateDiscordUsername(this.username, this.discordUsername).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated discord username');
      }
    });
  }

  private updateSummary() {
    this.userService.updateSummary(this.username, this.summary).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated summary');
      }
    });
  }

  ngOnInit() {
    this.userService.getUserByUsername(this.username).subscribe((response: any) => {
      console.log(response);
      this.user = response;
      this.displayName = response.displayName;
      this.initialDisplayName = this.displayName;
      this.discordUsername = response.discordUsername;
      this.initialDiscordUsername = this.discordUsername;
      this.summary = response.summary;
      this.initialSummary = this.summary;
      if (response.profileImageUrl !== '') {
        this.profileImageUrl = response.profileImageUrl;
      }
    });

  }
}
