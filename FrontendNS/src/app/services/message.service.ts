import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = 'https://localhost:7104/api/message';

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(username: string, message: string) {
    const encodedMessage = encodeURIComponent(message);
    return this.http.post(`${this.baseUrl}/send-message/${username}/${encodedMessage}`, null);
  }

  getMessagesForUsers(username: string): Observable<Message> {
    return this.http.get<Message>(`${this.baseUrl}/get-messages-between-users/${username}`);
  }
}
