import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserDTO } from '../model/user';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'https://localhost:7104/api/account';
  username: string;
  userForUserCard: EventEmitter<UserDTO> = new EventEmitter<UserDTO>();

  constructor(
    private http: HttpClient,
    private alertify: AlertifyService,
    private router: Router
  ) { }

  raiseCurrentUserProfileCard(user: UserDTO) {
    this.userForUserCard.emit(user);
  }

  // API calls
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

  findUsers(token: string, searchString: string) {
    return this.http.get(`${this.baseUrl}/find-users/${token}/${searchString}`);
  }

  verifyLoggedIn(): boolean {
    if (localStorage.getItem('token') == null || localStorage.getItem('userName') == null || localStorage.getItem('user') == null) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');

    this.router.navigate(['/']);
    this.alertify.success("You have logged out.");
  }

}
