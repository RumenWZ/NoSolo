import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _isMainSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isFriendsSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isMainSidenavOpen(): BehaviorSubject<boolean> {
    return this._isMainSidenavOpen;
  }

  get isFriendsSidenavOpen(): BehaviorSubject<boolean> {
    return this._isFriendsSidenavOpen;
  }

  toggleMainSidenav(): void {
    this._isMainSidenavOpen.next(!this._isMainSidenavOpen.value);
  }

  toggleFriendsSidenav(): void {
    this._isFriendsSidenavOpen.next(!this._isFriendsSidenavOpen.value);
  }


}
