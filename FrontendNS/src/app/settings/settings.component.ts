import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { AlertifyService } from '../services/alertify.service';
import { NgForm } from '@angular/forms';
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
  isUpdating: boolean = false;
  ongoingApiCalls: number = 0;
  deleteUserPhoto: boolean = false;

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
    reader.onload = (e: any) => {
      this.profileImageUrl = e.target.result;
    };
    reader.readAsDataURL(this.image);
    this.photoChanged = true;
    this.deleteUserPhoto = false;
    event.target.value = null;
  }

  onRemovePhoto() {
    this.image = null;
    this.photoChanged = true;
    this.profileImageUrl = '/assets/images/default-user.png';
    this.deleteUserPhoto = true;
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
    if (this.deleteUserPhoto) {
      this.userService.deleteUserPhoto().subscribe(response => {
        if (response == 201) {
          this.alertify.success('Successfully removed profile image');
          this.updateLocalStorageUserImage('/assets/images/default-user.png');
          this.sidenav.updateUserDetails();
          this.photoChanged = false;
          this.ApiCallFinished();
        }
      })
    } else {
      const formData = new FormData();
      formData.append('image', this.image);
      this.userService.updateUserPhoto(formData).subscribe((response: any) => {
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

  }

  private updateDisplayName(displayName: string) {
    this.ongoingApiCalls++;
    this.isUpdating = true;
    this.userService.updateDisplayName(displayName).subscribe((response: any) => {
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
    this.userService.updateDiscordUsername(discordUsername).subscribe((response: any) => {
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
    this.userService.updateSummary(summary).subscribe((response: any) => {
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
    this.updateUserDetails();
  }

  private checkApiStatus() {
    if (this.ongoingApiCalls === 0) {
      this.isUpdating = false;
      this.updateUserDetails();
    }
  }

  private ApiCallFinished() {
    this.ongoingApiCalls--;
    this.checkApiStatus();
  }
}
