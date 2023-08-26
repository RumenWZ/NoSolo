import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  baseUrl = 'https://localhost:7104/api/game';

  constructor(
    private http: HttpClient,
  ) {}

  addGame(token: string, game: FormData) {
    return this.http.post(this.baseUrl + `/add/${token}`, game);
  }

  getGamesList() {
    return this.http.get(this.baseUrl + '/getall');
  }

  deleteGame(token: string, id: number): Observable<any> {
    return this.http.delete(this.baseUrl + `/delete/${token}/${id}`);
  }
}
