import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserGame } from '../model/user-game';


@Injectable({
  providedIn: 'root'
})
export class UserGameService {
  baseUrl = 'https://localhost:7104/api/usergame';
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

  getUserGame(id: number) {
    return this.http.get(`${this.baseUrl}/get-user-game/${id}`);
  }

  deleteUserGame(id: number) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  updateUserGame(id: number, description: string) {
    return this.http.patch(`${this.baseUrl}/update/${id}?description=${description}`, null);
  }

  getUserGamesForMatching(username1: string, username2: string) {
    return this.http.get(`${this.baseUrl}/get-user-games-for-matching/${username1}/${username2}`);
  }

}
