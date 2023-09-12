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
  getFriendship(username: string): Observable<Friend> {
    return this.http.get<Friend>(`${this.baseUrl}/get-friendship/${username}`);
  }

  acceptFriendRequest(username: string) {
    return this.http.patch(`${this.baseUrl}/accept-friend-request/${username}`, null).pipe(
      tap(() => this.updateFriendsList.emit())
    );
  }

  removeFriend(username: string) {
    return this.http.delete(`${this.baseUrl}/delete-friendship/${username}`).pipe(
      tap(() => this.updateFriendsList.emit())
    );
  }

  sendFriendRequest(username: string) {
    return this.http.post(`${this.baseUrl}/send-friend-request/${username}`, null);
  }

  getIncomingFriendRequests() {
    return this.http.get(`${this.baseUrl}/get-my-friend-requests`);
  }

  getAllFriendsOfUser() {
    return this.http.get(`${this.baseUrl}/get-all-my-friends`);
  }

  getAllFriendRequestsByUser() {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/get-friendship-requests-of-user`);
  }
}
