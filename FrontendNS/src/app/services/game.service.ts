import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  baseUrl = 'https://localhost:7104/api';

  constructor(
    private http: HttpClient,
  ) {}

  addGame(game: FormData) {
    return this.http.post(this.baseUrl + '/game/add', game);
  }
}
