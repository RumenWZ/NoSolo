import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, map } from 'rxjs';
import { UserDTO } from '../model/user';
import { AlertifyService } from '../services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  canActivate(): Observable<boolean> {
    return this.userService.getLoggedInUser().pipe(
      map((response: any) => {
        if (response.error == 401) {
          this.alertify.error('Not logged in');
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
