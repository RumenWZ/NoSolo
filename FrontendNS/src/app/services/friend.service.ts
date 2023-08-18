import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Friend } from '../model/friend';
import { Observable, Subject, tap } from 'rxjs';
import { User, UserDTO } from '../model/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  baseUrl = 'https://localhost:7104/api/friend';
  friendsChatIsOpen: Subject<boolean> = new Subject<boolean>();
  chattingWithUser: EventEmitter<UserDTO> = new EventEmitter<UserDTO>();
  updateFriendsList: EventEmitter<void> = new EventEmitter<void>();
  openFriendsAll: EventEmitter<void> = new EventEmitter<void>();
  openFriendsPending: EventEmitter<void> = new EventEmitter<void>();
  openFriendsAdd: EventEmitter<void> = new EventEmitter<void>();
  openFriendsRequested: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private http: HttpClient) { }

  raiseCurrentChatUser(user: UserDTO) {
    this.chattingWithUser.emit(user);
  }

  // API Calls
  getFriendship(token: string, username: string): Observable<Friend> {
    return this.http.get<Friend>(`${this.baseUrl}/get-friendship/${token}/${username}`);
  }

  acceptFriendRequest(token: string, username: string) {
    return this.http.patch(`${this.baseUrl}/accept-friend-request/${token}/${username}`, null).pipe(
      tap(() => this.updateFriendsList.emit())
    );
  }

  removeFriend(token: string, username: string) {
    return this.http.delete(`${this.baseUrl}/delete-friendship/${token}/${username}`).pipe(
      tap(() => this.updateFriendsList.emit())
    );
  }

  sendFriendRequest(token:string, username: string) {
    return this.http.post(`${this.baseUrl}/send-friend-request/${token}/${username}`, null);
  }

  getIncomingFriendRequests(token: string) {
    return this.http.get(`${this.baseUrl}/get-my-friend-requests/${token}`);
  }

  getAllFriendsOfUser(token: string) {
    return this.http.get(`${this.baseUrl}/get-all-my-friends/${token}`);
  }

  getAllFriendRequestsByUser(token: string) {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/get-friendship-requests-of-user/${token}`);
  }
}
