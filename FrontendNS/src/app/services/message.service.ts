import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl + '/message';

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
