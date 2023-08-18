import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { User, UserDTO } from 'src/app/model/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  user: User;
  userSubmitted :boolean;
  userForLogin = {username: '', password: ''};

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router,
    private sidenav: SidenavService
    ) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      userName: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(40)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      confirmPassword: new FormControl(null, [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(fc: AbstractControl): ValidationErrors | null {
    const passwordControl = fc.get('password');
    const confirmPasswordControl = fc.get('confirmPassword');

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ notmatched: true });
      return { notmatched: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    this.userSubmitted = true;

    const loginDetails = {username: this.userData().username, password: this.userData().password}

    if (this.registerForm.valid) {
      this.userService
        .addUser(this.userData())
        .pipe(
          switchMap(() => {
            this.registerForm.reset();
            this.userSubmitted = false;
            return this.userService.authUser(loginDetails);
          }),
          switchMap((response: any) => {
            const user = response;
            localStorage.setItem('token', user.token);
            localStorage.setItem('userName', user.username);
            this.router.navigate(['/']);
            this.alertify.success('Welcome to NoSolo');
            return this.userService.getUserByToken(user.token);
          })
        )
        .subscribe((userDTO: UserDTO) => {
          localStorage.setItem('user', JSON.stringify(userDTO));
          this.sidenav.updateUserDetails();
        });
    }
  }

  userData(): User {
    return this.user = {
      username: this.userName.value,
      email: this.email.value,
      password: this.password.value,
    };
  }

  get userName() {
    return this.registerForm.get('userName') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

}
