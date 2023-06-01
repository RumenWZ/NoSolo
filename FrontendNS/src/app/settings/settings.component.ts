import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { HttpHeaders } from '@angular/common/http';
import { AlertifyService } from '../services/alertify.service';

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

  constructor(
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  getImage(event: any) {
    this.image = event.target.files[0];
    console.log(event);
    const reader = new FileReader();
    reader.onload = (e: any) => {this.profileImageUrl = e.target.result;};
    reader.readAsDataURL(this.image);
    this.photoChanged = true;
  }

  // Test() {
  //   console.log(this.profileImageUrl);
  // }

  onSaveChanges() {
    if(this.photoChanged) {
      const formData = new FormData();
      formData.append('image', this.image);
      this.userService.updateUserPhoto(this.username, formData).subscribe((response: any) => {
        if (response == 201) {
          this.alertify.success('Changes saved successfully');
        }
      })
    }

  }

  ngOnInit() {
    this.userService.getUserByUsername(this.username).subscribe((response: any) => {
      console.log(response);
      this.user = response;
      if (response.profileImageUrl !== '') {
        this.profileImageUrl = response.profileImageUrl;
      }
    });
  }
}
