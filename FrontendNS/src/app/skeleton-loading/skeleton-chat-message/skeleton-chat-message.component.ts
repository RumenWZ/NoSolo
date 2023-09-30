import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-chat-message',
  templateUrl: './skeleton-chat-message.component.html',
  styleUrls: ['./skeleton-chat-message.component.css']
})
export class SkeletonChatMessageComponent {
  randomizedWidth: string;

  ngOnInit() {
    const randomRem = Math.floor(Math.random() * 9 + 6); // Generate a random number between 6 and 14
    this.randomizedWidth = `${randomRem}rem`;
  }
}
