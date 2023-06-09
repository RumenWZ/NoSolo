import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _isSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isSidenavOpen(): BehaviorSubject<boolean> {
    return this._isSidenavOpen;
  }

  toggleSidenav(): void {
    this._isSidenavOpen.next(!this._isSidenavOpen.value);
  }

}
