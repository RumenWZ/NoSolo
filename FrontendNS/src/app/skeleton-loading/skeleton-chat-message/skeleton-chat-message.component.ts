import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-chat-message',
  templateUrl: './skeleton-chat-message.component.html',
  styleUrls: ['./skeleton-chat-message.component.css']
})
export class SkeletonChatMessageComponent {
  randomizedMessageWidth: string;

  ngOnInit() {
    this.randomizedMessageWidth = Math.floor(Math.random() * 13 + 9) + 'rem';
  }
}
