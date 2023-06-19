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

  constructor(
    private route: ActivatedRoute,
    private userService: UserService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');

    const cachedUser = this.userService.getCachedUser();

    if (cachedUser) {
      this.user = cachedUser;
    } else {
      this.userService.getUserByToken(this.token).subscribe(
        (response: UserDTO) => {
          this.user = response;
        }
      );
    }
  }
}
