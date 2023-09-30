import { Component, Input } from '@angular/core';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-skeleton-friend',
  templateUrl: './skeleton-friend.component.html',
  styleUrls: ['./skeleton-friend.component.css']
})
export class SkeletonFriendComponent {
  randomizedWidth: string;
  showSkeletonLoading: boolean = true;
  @Input() renderDelay: number = 0;

  delaySkeletonLoading() {
    this.showSkeletonLoading = false;
    const delay = timer(this.renderDelay);

    delay.pipe(take(1)).subscribe(() => {
      this.showSkeletonLoading = true;
    });
  }

  ngOnInit() {
    const randomRem = Math.floor(Math.random() * 5 + 5);
    this.randomizedWidth = `${randomRem}rem`;

    this.delaySkeletonLoading();
  }

}
