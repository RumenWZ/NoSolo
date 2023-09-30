import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-friend',
  templateUrl: './skeleton-friend.component.html',
  styleUrls: ['./skeleton-friend.component.css']
})
export class SkeletonFriendComponent {
  randomizedWidth: string;

  ngOnInit() {
    const randomRem = Math.floor(Math.random() * 5 + 5);
    this.randomizedWidth = `${randomRem}rem`;
  }

}
