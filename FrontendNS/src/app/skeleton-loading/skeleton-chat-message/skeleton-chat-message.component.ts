import { Component } from '@angular/core';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-skeleton-chat-message',
  templateUrl: './skeleton-chat-message.component.html',
  styleUrls: ['./skeleton-chat-message.component.css']
})
export class SkeletonChatMessageComponent {
  randomizedMessageWidth: string;
  showSkeletonLoading: boolean = true;

  delaySkeletonLoading() {
    this.showSkeletonLoading = false;
    const delay = timer(200);

    delay.pipe(take(1)).subscribe(() => {
      this.showSkeletonLoading = true;
    });
  }

  ngOnInit() {
    this.randomizedMessageWidth = Math.floor(Math.random() * 13 + 9) + 'rem';

    this.delaySkeletonLoading();
  }
}
