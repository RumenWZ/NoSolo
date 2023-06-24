import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Friend } from '../model/friend';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  baseUrl = 'https://localhost:7104/api/friend';

  constructor(private http: HttpClient) { }

  getFriendship(token: string, username: string): Observable<Friend> {
    return this.http.get<Friend>(`${this.baseUrl}/get-friendship/${token}/${username}`);
  }
}
