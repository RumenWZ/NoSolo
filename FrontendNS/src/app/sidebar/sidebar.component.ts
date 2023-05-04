import { Component,} from '@angular/core';
import { UserService } from '../services/user.service';
import { sidebarMenuEntries } from './sidebarMenuEntries';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  username: string;
  isOpen = false;
  sidebarData = sidebarMenuEntries;

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

  onCloseButton() {
    setTimeout(() => {
      this.onOffcanvasHidden();
    }, 250)
  }

  onBurgermenuClick() {
    this.isOpen = true;
  }

  userIsLoggedin() {
    this.username = this.user.getUsername();
    return this.user.getUsername();
  }

  onDashboard() {
    console.log('Dashboard button clicked');
  }

  executeFunction(functionName: string) {
    if (functionName === 'onLogout')
      this.onLogout();
    else if (functionName === 'onDashboard')
      this.onDashboard()
  }
}
