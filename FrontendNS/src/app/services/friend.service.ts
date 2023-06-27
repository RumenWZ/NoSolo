import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  acceptFriendRequest(token:string, username: string) {
    return this.http.patch(`${this.baseUrl}/accept-friend-request/${token}/${username}`, null);
  }

  removeFriend(token:string, username: string) {
    return this.http.delete(`${this.baseUrl}/delete-friendship/${token}/${username}`);
  }

  sendFriendRequest(token:string, username: string) {
    return this.http.post(`${this.baseUrl}/send-friend-request/${token}/${username}`, null);
  }

  getIncomingFriendRequests(token: string) {
    return this.http.get(`${this.baseUrl}/get-my-friend-requests/${token}`);
  }
}
