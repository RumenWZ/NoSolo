import { Component, Input } from '@angular/core';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  showLoadingSpinner: boolean = true;
  @Input() renderDelay: number = 0;

  delaySkeletonLoading() {
    this.showLoadingSpinner = false;
    const delay = timer(this.renderDelay);

    delay.pipe(take(1)).subscribe(() => {
      this.showLoadingSpinner = true;
    });
  }

  ngOnInit() {
    this.delaySkeletonLoading();
  }
}
