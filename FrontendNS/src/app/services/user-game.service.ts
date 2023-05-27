import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserGame } from '../model/user-game';


@Injectable({
  providedIn: 'root'
})
export class UserGameService {
  baseUrl = 'https://localhost:7104/api';
  username: string;

  constructor(
    private http: HttpClient,
  ) { }


  addUserGame(userGame: UserGame) {
    return this.http.post(this.baseUrl + '/usergame/add', userGame);
  }

  getUserGames(username: string) {
    return this.http.get(this.baseUrl + '/usergame/get-user-games/' + username);
  }

  getUserGame(id: number) {
    return this.http.get(`${this.baseUrl}/usergame/get-user-game/${id}`);
  }

  deleteUserGame(id: number) {
    return this.http.delete(`${this.baseUrl}/usergame/delete/${id}`);
  }

}
