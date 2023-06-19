
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/model/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  test: any;

  constructor(
    private alertify: AlertifyService,
    private userService: UserService,
    private router: Router,
  ) {}

  onLogin(form: NgForm) {
    this.userService.authUser(form.value).subscribe(
      (response: any) => {
        console.log(response);
        const user = response;
        localStorage.setItem('token', user.token);
        localStorage.setItem('userName', user.username);
        this.router.navigate(['/']);
        this.alertify.success("Login Successful");
      }
    );
  }

  ngOnInit() {

  }
}
