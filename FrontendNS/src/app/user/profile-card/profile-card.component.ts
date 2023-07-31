import { Component } from '@angular/core';
import { UserDTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  forUser: UserDTO;

  selectedTab: string = 'description';


  constructor(
    private user: UserService
  ) {}

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  assignDefaultValues() {
    if (this.forUser.profileImageUrl === '') {
      this.forUser.profileImageUrl = '/assets/images/default-user.png';
    }
    if (this.forUser.displayName === '') {
      this.forUser.displayName = this.forUser.username;
    }
  }

  ngOnInit() {
    this.user.getUserByToken(localStorage.getItem('token')).subscribe((response: any) => {
      this.forUser = response;
      this.assignDefaultValues();
    })
  }
}
