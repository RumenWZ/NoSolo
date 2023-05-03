import { Component,} from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  username: string;
  isOpen = false;

  constructor(
    private user: UserService
  ) {}

  onLogout() {
    this.user.logoutUser();
    this.isOpen = false;
  }

  onOffcanvasHidden() {
    this.isOpen = false;
  }

  userIsLoggedin() {
    this.username = this.user.getUsername();
    return this.user.getUsername();
  }
}
