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
    const offcanvasElement = document.querySelector('.offcanvas');
    const backdropElement = document.querySelector('.offcanvas-backdrop');
    offcanvasElement.classList.remove();
    backdropElement.parentNode.removeChild(backdropElement);
    location.reload();
  }

  onOffcanvasHidden() {

    this.isOpen = false;
  }

  onBurgermenuClick() {
    this.isOpen = true;
  }

  userIsLoggedin() {
    this.username = this.user.getUsername();
    return this.user.getUsername();
  }
}
