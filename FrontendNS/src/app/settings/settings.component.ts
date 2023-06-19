import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { AlertifyService } from '../services/alertify.service';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  username = localStorage.getItem('userName');
  user: User;
  image: File;
  // profileImageUrl : string;
  profileImageUrl : string = '/assets/images/default-user.png';
  changes = {};
  photoChanged: boolean = false;

  initialDisplayName: string;
  initialDiscordUsername: string;
  initialSummary: string;

  formModified: boolean = false;
  discordUsernameModified: boolean = false;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private matDialog: MatDialog

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
  //   console.log(this.discordUsernameModified);
  // }

  onSaveChanges(userSettingsForm: NgForm) {
    if (!userSettingsForm.valid) {
      return this.alertify.warning('Invalid input. Please review your entries');
    }
    var displayName = userSettingsForm.form.value.displayName;
    var discordUsername = userSettingsForm.form.value.discordUsername;
    var summary = userSettingsForm.form.value.summary;

    console.log(displayName === this.initialDisplayName);
    console.log(discordUsername === this.initialDiscordUsername);
    console.log(summary === this.initialSummary);
    console.log(this.photoChanged);

    if ((displayName === this.initialDisplayName) && (discordUsername === this.initialDiscordUsername)
    && (summary === this.initialSummary) && !this.photoChanged) {
      return this.alertify.warning('No changes to be made');
    }

    console.log(userSettingsForm);
    if(this.photoChanged) {
      this.updateUserPhoto();
    }
    if (displayName != this.initialDisplayName && displayName != '') {
      this.updateDisplayName(displayName);
    }
    if (discordUsername != this.initialDiscordUsername && this.discordUsernameModified) {
      this.updateDiscordUsername(discordUsername);
    }
    if (summary != this.initialSummary && summary != '') {
      this.updateSummary(summary);
    }
  }

  private updateUserPhoto() {
    const formData = new FormData();
    formData.append('image', this.image);
    this.userService.updateUserPhoto(this.username, formData).subscribe((response: any) => {
      if (response === 201) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImageUrl = e.target.result;
        };
        reader.readAsDataURL(this.image);
        this.alertify.success('Changes saved successfully');
        this.photoChanged = false;
      }
    });
  }

  private updateDisplayName(displayName: string) {
    this.userService.updateDisplayName(this.username, displayName).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated display name');
        this.initialDisplayName = displayName;
        this.formModified = false;
      }
    });
  }

  private updateDiscordUsername(discordUsername: string) {
    this.userService.updateDiscordUsername(this.username, discordUsername).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated discord username');
        this.initialDiscordUsername = discordUsername;
        this.discordUsernameModified = false;
      }
    });
  }

  private updateSummary(summary: string) {
    this.userService.updateSummary(this.username, summary).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated summary');
        this.initialSummary = summary;
        this.formModified = false;
      }
    });
  }

  onFormChange() {
    this.formModified = true;
  }

  updateUserDetails() {
    this.userService.getUserByUsername(this.username).subscribe((response: any) => {
      console.log(response);
      this.user = response;
      this.initialDisplayName = response.displayName;
      this.initialDiscordUsername = response.discordUsername;
      this.initialSummary = response.summary;

      if (response.profileImageUrl !== '') {
        this.profileImageUrl = response.profileImageUrl;
      }
    });
  }

  ngOnInit() {
    this.updateUserDetails();
  }
}
