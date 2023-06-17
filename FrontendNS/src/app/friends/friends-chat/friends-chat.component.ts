import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'src/app/model/user';
import { chatMessages } from './chatMessagesForTesting';

@Component({
  selector: 'app-friends-chat',
  templateUrl: './friends-chat.component.html',
  styleUrls: ['./friends-chat.component.css']
})
export class FriendsChatComponent implements OnChanges{
  friendsChatEnabled: boolean = true;
  @Input() chatUser: any;
  messageFieldPlaceholder: string;
  chatMessages = chatMessages;

  ngOnInit() {
    this.messageFieldPlaceholder = `Message ${this.chatUser.username}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatUser'] && changes['chatUser'].currentValue) {
      this.messageFieldPlaceholder = `Message ${this.chatUser.username}`;
    }
  }
}
