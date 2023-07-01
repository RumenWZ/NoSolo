import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = 'https://localhost:7104/api/message';

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(token: string, username: string, message: string) {
    return this.http.post(`${this.baseUrl}/send-message/${token}/${username}/${message}`, null);
  }
}
