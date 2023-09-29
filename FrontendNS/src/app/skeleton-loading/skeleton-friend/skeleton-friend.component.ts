import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-friend',
  templateUrl: './skeleton-friend.component.html',
  styleUrls: ['./skeleton-friend.component.css']
})
export class SkeletonFriendComponent {
  @Input() skeletonNameWidth: number;
  
}
