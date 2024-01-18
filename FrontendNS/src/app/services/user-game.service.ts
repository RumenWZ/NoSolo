import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatchedUserDTO, UserGame, UserGameDTO } from '../model/user-game';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserGameService {
  baseUrl = environment.apiUrl + '/usergame';
  username: string;

  constructor(
    private http: HttpClient,
  ) { }


  addUserGame(userGame: UserGame) {
    return this.http.post(this.baseUrl + '/add', userGame);
  }

  getUserGames(username: string) {
    return this.http.get(this.baseUrl + '/get-user-games/' + username);
  }

  getLoggedinUserGames() {
    return this.http.get<UserGameDTO[]>(this.baseUrl + '/get-loggedin-user-games');
  }

  getUserGame(id: number) {
    return this.http.get(`${this.baseUrl}/get-user-game/${id}`);
  }

  deleteUserGame(id: number) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  updateUserGame(id: number, description: string) {
    return this.http.patch(`${this.baseUrl}/update/${id}?description=${description}`, null);
  }

  getUserGamesForMatching(username: string) {
    return this.http.get(`${this.baseUrl}/get-user-games-for-matching/${username}`);
  }

  getMatchesForUser() {
    return this.http.get<MatchedUserDTO[]>(`${this.baseUrl}/get-matches`);
  }

}
