import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Friend } from '../model/friend';
import { Observable, Subject } from 'rxjs';
import { User, UserDTO } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  baseUrl = 'https://localhost:7104/api/friend';
  friendsChatIsOpen: Subject<boolean> = new Subject<boolean>();
  chattingWithUser: EventEmitter<UserDTO> = new EventEmitter<UserDTO>();

  constructor(private http: HttpClient) { }



  raiseCurrentChatUser(user: UserDTO) {
    this.chattingWithUser.emit(user);
  }

  // API Calls
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

  getAllFriendsOfUser(token: string) {
    return this.http.get(`${this.baseUrl}/get-all-my-friends/${token}`);
  }
}
