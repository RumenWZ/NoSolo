import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'src/app/model/user';
import { chatMessages } from './chatMessagesForTesting';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/model/message';

@Component({
  selector: 'app-friends-chat',
  templateUrl: './friends-chat.component.html',
  styleUrls: ['./friends-chat.component.css']
})
export class FriendsChatComponent implements OnChanges{
  friendsChatEnabled: boolean = true;
  @Input() chatUser: any;
  messageFieldPlaceholder: string;
  chatMessages: any;
  chatFieldMessage: string;
  token: string;

  constructor (
    private message: MessageService
  ) {}

  chatMessagesProcessor() {

  }

  sendMessage() {
    this.message.sendMessage(this.token, this.chatUser.username, this.chatFieldMessage).subscribe((response: any) => {
      if (response == 201) {
        this.chatFieldMessage = '';
      }
    })

  }

  getChatMessages() {
    this.message.getMessagesForUsers(this.token, this.chatUser.username).subscribe((response: Message) => {
      this.chatMessages = response;
      console.log(chatMessages);
    })
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.messageFieldPlaceholder = `Message ${this.chatUser.displayName}`;

    this.getChatMessages()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatUser'] && changes['chatUser'].currentValue) {
      this.messageFieldPlaceholder = `Message ${this.chatUser.username}`;
      this.getChatMessages();
    }
  }
}
