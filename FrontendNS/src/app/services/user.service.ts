import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserDTO } from '../model/user';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + '/account';
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

  addUser(user: User) {
    return this.http.post(this.baseUrl + '/register', user);
  }

  authUser(user: any){
    return this.http.post(this.baseUrl + '/login', user).pipe(
      tap((response: any) => {
        const token = response.token;
        localStorage.setItem('token', token);
      })
    );
  }

  getUsername() {
    return localStorage.getItem('userName');
  }

  getLoggedInUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(this.baseUrl + '/get-logged-in-user');
  }

  getUserByUsername(username: string) {
    return this.http.get(this.baseUrl + '/get-user-by-username/' + username);
  }

  updateUserPhoto(photo: FormData) {
    return this.http.patch(`${this.baseUrl}/update-photo`, photo);
  }

  updateDisplayName(displayName:string) {
    return this.http.patch(`${this.baseUrl}/update-display-name?displayName=${displayName}`, null);
  }

  updateDiscordUsername(discordUsername:string) {
    const encodedDiscordUsername = encodeURIComponent(discordUsername);
    return this.http.patch(`${this.baseUrl}/update-discord-username?discordUsername=${encodedDiscordUsername}`, null);
  }

  updateSummary(summary:string) {
    return this.http.patch(`${this.baseUrl}/update-summary?summary=${summary}`, null);
  }

  findUsers(searchString: string) {
    return this.http.get(`${this.baseUrl}/find-users/${searchString}`);
  }

  checkIfLoggedIn() {
    return this.http.get(`${this.baseUrl}/check-logged-in`);
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
