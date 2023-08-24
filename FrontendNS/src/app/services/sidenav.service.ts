import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _isMainSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isFriendsSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userDetailsUpdated: Subject<void> = new Subject<void>();
  private isTransitioning: boolean = false;

  get isMainSidenavOpen(): BehaviorSubject<boolean> {
    return this._isMainSidenavOpen;
  }

  get isFriendsSidenavOpen(): BehaviorSubject<boolean> {
    return this._isFriendsSidenavOpen;
  }

  toggleMainSidenav(): void {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this._isMainSidenavOpen.next(!this._isMainSidenavOpen.value);

      timer(375).subscribe(() => {
        this.isTransitioning = false;
      });
    }
  }

  toggleFriendsSidenav(): void {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this._isFriendsSidenavOpen.next(!this._isFriendsSidenavOpen.value);

      timer(375).subscribe(() => {
        this.isTransitioning = false;
      });
    }
  }

  get userDetailsUpdated$(): Observable<void> {
    return this.userDetailsUpdated.asObservable();
  }

  updateUserDetails(): void {
    this.userDetailsUpdated.next();
  }
}
