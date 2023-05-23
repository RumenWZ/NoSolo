import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as alertify from 'alertifyjs';
import { User, UserGame } from '../model/user';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'https://localhost:7104/api';
  username: string;

  constructor(
    private http: HttpClient,
    private alertify: AlertifyService,
    private router: Router
  ) { }

  addUser(user: User) {
    return this.http.post(this.baseUrl + '/account/register', user);
  }

  authUser(user: User) {
    return this.http.post(this.baseUrl + '/account/login', user);
  }

  getUsername() {
    return localStorage.getItem('userName');
  }

  addUserGame(userGame: UserGame) {
    return this.http.post(this.baseUrl + '/usergame/add', userGame);
  }

  getUserByUsername(username: string) {
    return this.http.get(this.baseUrl + '/account/get-user-by-username/' + username);
  }

  getUserGames(username: string) {
    return this.http.get(this.baseUrl + '/usergame/get-user-games/' + username);
  }


  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/']);
    this.alertify.success("You have logged out.");
  }

}
