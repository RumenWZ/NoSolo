import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, catchError, map, of } from 'rxjs';
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
    return this.userService.checkIfLoggedIn().pipe(
      map((response: any) => {
        if (response == 200) {
          return true;
        } else {
          this.router.navigate(['/login']);
          this.alertify.warning('Please log in to access that page');
          return false;
        }
      })
    );
  }
}

