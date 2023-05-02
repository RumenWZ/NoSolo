import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as alertify from 'alertifyjs';
import { User } from '../model/user';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'https://localhost:7104/api';
  username: string;

  constructor(
    private http: HttpClient,
    private alertify: AlertifyService
  ) { }

  addUser(user: User) {
    alertify.success("Registration successful")
    return this.http.post(this.baseUrl + '/account/register', user);
  }

  authUser(user: User) {
    return this.http.post(this.baseUrl + '/account/login', user);
  }

  getUsername() {
    return localStorage.getItem('userName');
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.alertify.success("You have logged out.");
  }

}
