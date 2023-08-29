import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { AlertifyService } from '../services/alertify.service';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SidenavService } from '../services/sidenav.service';

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
  token: string;
  isUpdating: boolean = false;
  ongoingApiCalls: number = 0;

  initialDisplayName: string;
  initialDiscordUsername: string;
  initialSummary: string;

  formModified: boolean = false;
  discordUsernameModified: boolean = false;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private sidenav: SidenavService

    ) {}

  getImage(event: any) {
    const file = event.target.files[0];
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 1.5 * 1024 * 1024;

    if (!allowedFormats.includes(file.type)) {
      this.alertify.error('Invalid file format. Only JPEG and PNG files are allowed.');
      return;
    }

    if (file.size > maxSize) {
      this.alertify.error('File size exceeds the limit of 1.5 MB.');
      return;
    }

    this.image = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {this.profileImageUrl = e.target.result;};
    reader.readAsDataURL(this.image);
    this.photoChanged = true;
  }

  onSaveChanges(userSettingsForm: NgForm) {
    if(this.photoChanged && !userSettingsForm.valid) {
      this.updateUserPhoto();
      return;
    } else if (this.photoChanged) {
      this.updateUserPhoto();
    }

    if (!userSettingsForm.valid) {
      return this.alertify.warning('Invalid input. Please review your entries');
    }
    var displayName = userSettingsForm.form.value.displayName;
    var discordUsername = userSettingsForm.form.value.discordUsername;
    var summary = userSettingsForm.form.value.summary;

    if ((displayName === this.initialDisplayName) && (discordUsername === this.initialDiscordUsername)
    && (summary === this.initialSummary) && !this.photoChanged) {
      return this.alertify.warning('No changes to be made');
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
    this.updateUserDetails();

  }

  updateLocalStorageUserImage(imageUrl: string) {
    var userString = localStorage.getItem('user');
    var user = JSON.parse(userString);
    user.profileImageUrl = imageUrl;
    var updatedUserString = JSON.stringify(user);
    localStorage.setItem('user', updatedUserString);
  }

  private updateUserPhoto() {
    this.ongoingApiCalls++;
    this.isUpdating = true;
    const formData = new FormData();
    formData.append('image', this.image);
    this.userService.updateUserPhoto(this.token, formData).subscribe((response: any) => {
      if (response) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImageUrl = e.target.result;
        };
        reader.readAsDataURL(this.image);
        this.alertify.success('Successfully updated profile image');

        this.updateLocalStorageUserImage(response.profileImageUrl);

        this.sidenav.updateUserDetails();
        this.photoChanged = false;
        this.ApiCallFinished();
      }
    }, error => {
      this.isUpdating = false;
    });
  }

  private updateDisplayName(displayName: string) {
    this.ongoingApiCalls++;
    this.isUpdating = true;
    this.userService.updateDisplayName(this.username, displayName).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated display name');
        this.initialDisplayName = displayName;
        this.formModified = false;
        this.ApiCallFinished();
      }
    }, error => {
      this.isUpdating = false;
    });
  }

  private updateDiscordUsername(discordUsername: string) {
    this.ongoingApiCalls++;
    this.isUpdating = true;
    this.userService.updateDiscordUsername(this.username, discordUsername).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated discord username');
        this.initialDiscordUsername = discordUsername;
        this.discordUsernameModified = false;
        this.ApiCallFinished();
      }
    }, error => {
      this.isUpdating = false;
    });
  }

  private updateSummary(summary: string) {
    this.ongoingApiCalls++;
    this.isUpdating = true;
    this.userService.updateSummary(this.username, summary).subscribe((response: any) => {
      if (response === 201) {
        this.alertify.success('Successfully updated summary');
        this.initialSummary = summary;
        this.formModified = false;
        this.ApiCallFinished();
      }
    }, error => {
      this.isUpdating = false;
    });
  }

  onFormChange() {
    this.formModified = true;
  }

  updateUserDetails() {
    this.userService.getUserByUsername(this.username).subscribe((response: any) => {
      this.user = response;
      this.initialDisplayName = response.displayName;
      this.initialDiscordUsername = response.discordUsername;
      this.initialSummary = response.summary;

      localStorage.setItem('user', JSON.stringify(this.user));
      if (response.profileImageUrl !== '') {
        this.profileImageUrl = response.profileImageUrl;
      }
    });
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.updateUserDetails();
  }

  private checkApiStatus() {
    if (this.ongoingApiCalls === 0) {
      this.isUpdating = false;
    }
  }

  private ApiCallFinished() {
    this.ongoingApiCalls--;
    this.checkApiStatus();
  }
}
