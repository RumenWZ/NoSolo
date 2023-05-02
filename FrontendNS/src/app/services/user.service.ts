import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as alertify from 'alertifyjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'https://localhost:7104/';
  username: string;

  constructor(
    private http: HttpClient
  ) { }

  addUser(user: User) {
    return this.http.post(this.baseUrl + 'api/register', user);
  }

  authUser(user: User) {
    return this.http.post(this.baseUrl + 'api/login', user);
  }

  getUsername(): string {
    return localStorage.getItem('userName');
  }

}
