
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/model/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  constructor(
    private alertify: AlertifyService,
    private userService: UserService,
    private router: Router,
    private sidenav: SidenavService
  ) {}

  onLogin(form: NgForm) {
    this.userService.authUser(form.value).subscribe(
      (response: any) => {
        const user = response;
        localStorage.setItem('userName', user.username);

        this.router.navigate(['/']);
        this.alertify.success("Login Successful");

        this.userService.getLoggedInUser().subscribe(
          (userDTO: UserDTO) => {
            localStorage.setItem('user', JSON.stringify(userDTO));
            this.sidenav.updateUserDetails();
          }
        );
      }
    );
  }

  ngOnInit() {

  }
}
