import { Component, HostListener } from '@angular/core';
import { friendsList } from './friendsListObjectsForTesting';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent {
  isSmallScreen: boolean;
  isSidenavOpen: boolean = false;
  friendsList = friendsList;

  constructor(
    private sidenavService: SidenavService
  ) {
    this.isSmallScreen = window.innerWidth < 768;
  }

  toggleSidenav() {
    this.sidenavService.toggleFriendsSidenav();
  }

  ngOnInit() {
    this.sidenavService.isFriendsSidenavOpen.subscribe((isOpen: boolean) => {
      this.isSidenavOpen = isOpen;
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
