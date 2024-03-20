import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, newMessage } from '../model/message';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl + '/message';

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(newMessage: newMessage) {
    return this.http.post(`${this.baseUrl}/send-message`, newMessage);
  }

  getMessagesForUsers(username: string): Observable<Message> {
    return this.http.get<Message>(`${this.baseUrl}/get-messages-between-users/${username}`);
  }
}
