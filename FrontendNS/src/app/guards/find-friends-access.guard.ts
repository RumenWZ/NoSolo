import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AlertifyService } from '../services/alertify.service';
import { UserGameService } from '../services/user-game.service';
import { UserGameDTO } from '../model/user-game';

@Injectable({
  providedIn: 'root'
})
export class FindFriendsAccessGuard implements CanActivate {
  constructor(
    private router: Router,
    private alertify: AlertifyService,
    private userGameService: UserGameService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      return this.userGameService.getLoggedinUserGames().pipe(
        map((userGames: UserGameDTO[]) => {
          if (userGames.length > 0) {
            return true;
          } else {
            this.alertify.warning('You do not have any games added to your Games List.');
            this.alertify.warning('Please select at least one game to be matched with other users.');
            this.router.navigate(['/game-selection']);
            return false
          }
        }), catchError(() => of(false)));
    }
  }
