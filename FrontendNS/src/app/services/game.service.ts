import { Injectable } from "@angular/core";
import { Game } from "../model/game";
import { HttpClient } from "@angular/common/http";
import { AlertifyService } from "./alertify.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  baseUrl = 'https://localhost:7104/api';

  constructor(
    private http: HttpClient,
    private alertify: AlertifyService
  ) {}

  addGame(game: Game) {
    this.alertify.success('Successfully added game to database');
    return this.http.post(this.baseUrl + '/game/add', game);
  }
}
