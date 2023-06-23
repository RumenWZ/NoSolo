import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent {
  username: string;
  token: string;
  user: UserDTO;
  isMyOwnProfile: boolean;
  myUsername: string;
  isValidUsername: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
    ) {
    this.token = localStorage.getItem('token');
    this.myUsername = localStorage.getItem('userName');
  }

  onSendFriendRequest() {

  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    
    this.userService.getUserByUsername(this.username).subscribe((response: any) => {
      if (response.error) {
        this.isValidUsername = false;
      } else {
        this.isValidUsername = true;
        this.user = response;
      if (response.profileImageUrl == '') {
        this.user.profileImageUrl = '/assets/images/default-user.png';
        this.isMyOwnProfile = this.username == this.myUsername ? true : false;
      }
      }


    })
  }
}
