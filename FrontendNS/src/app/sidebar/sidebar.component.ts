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
    this.username = null;
    const offcanvasElement = document.querySelector('.offcanvas');
    const backdropElement = document.querySelector('.offcanvas-backdrop');
    offcanvasElement.classList.remove();
    backdropElement.parentNode.removeChild(backdropElement);
    location.reload();

  }

  onOffcanvasHidden() {

    this.isOpen = false;
  }

  checkStatus(){
    console.log('Is open : ', this.isOpen);
    console.log('Userisloggedin : ', this.userIsLoggedin());
  }

  onBurgermenuClick() {
    this.isOpen = true;
  }

  userIsLoggedin() {
    this.username = this.user.getUsername();
    return this.user.getUsername();
  }
}
