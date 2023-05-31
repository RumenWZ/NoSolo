import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  username = localStorage.getItem('userName');
  user: User;
  profileImageUrl = '/assets/images/default-user.png';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserByUsername(this.username).subscribe((response: any) => {
      console.log(response);
      this.user = response;
      if (response.profileImageUrl !== '') {
        this.profileImageUrl == response.profileImageUrl;
      }
    });
  }
}
