import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserDTO } from '../model/user';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { Observable, Subject, of, tap } from 'rxjs';

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

  authUser(user: any){
    return this.http.post(this.baseUrl + '/login', user).pipe(
      tap((response: any) => {
        const token = response.token;
        return this.getUserByToken(token).subscribe();
      })
    );
  }

  getUsername() {
    return localStorage.getItem('userName');
  }

  getUserByToken(token: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(this.baseUrl + '/get-user-by-token/' + token);
  }

  getUserByUsername(username: string) {
    return this.http.get(this.baseUrl + '/get-user-by-username/' + username);
  }

  updateUserPhoto(username: string, photo: FormData) {
    return this.http.patch(`${this.baseUrl}/update-photo/${username}`, photo);
  }

  updateDisplayName(username: string, displayName:string) {
    return this.http.patch(`${this.baseUrl}/update-display-name/${username}?displayName=${displayName}`, null);
  }

  updateDiscordUsername(username: string, discordUsername:string) {
    const encodedUsername = encodeURIComponent(username);
    const encodedDiscordUsername = encodeURIComponent(discordUsername);
    return this.http.patch(`${this.baseUrl}/update-discord-username/${encodedUsername}?discordUsername=${encodedDiscordUsername}`, null);
  }

  updateSummary(username: string, summary:string) {
    return this.http.patch(`${this.baseUrl}/update-summary/${username}?summary=${summary}`, null);
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');

    this.router.navigate(['/']);
    this.alertify.success("You have logged out.");
  }

}
