import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as alertify from 'alertifyjs';
import { User } from '../model/user';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'https://localhost:7104/api/account';
  username: string;

  constructor(
    private http: HttpClient,
    private alertify: AlertifyService,
    private router: Router
  ) { }

  addUser(user: User) {
    return this.http.post(this.baseUrl + '/register', user);
  }

  authUser(user: User) {
    return this.http.post(this.baseUrl + '/login', user);
  }

  getUsername() {
    return localStorage.getItem('userName');
  }

  getUserByUsername(username: string) {
    return this.http.get(this.baseUrl + '/get-user-by-username/' + username);
  }

  updateUserPhoto(username: string, photo: FormData) {
    return this.http.patch(`${this.baseUrl}/update-photo/${username}`, photo);
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/']);
    this.alertify.success("You have logged out.");
  }

}
