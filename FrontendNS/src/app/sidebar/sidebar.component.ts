import { Component,} from '@angular/core';
import { UserService } from '../services/user.service';
import { sidebarMenuEntries, sidebarMenuEntriesAdmin } from './sidebarMenuEntries';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  username: string;
  isOpen = false;
  sidebarData = sidebarMenuEntries;
  sidebarDataAdmin = sidebarMenuEntriesAdmin;
  offcanvas: Element;

  constructor(
    private user: UserService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  onLogout() {
    this.user.logoutUser();
    this.fullyCloseSideBar();

  }

  onOffcanvasHidden() {
    this.isOpen = false;

  }

  onCloseButton() {
    setTimeout(() => {
      this.onOffcanvasHidden();
    }, 250);
  }

  onBurgermenuClick() {
    this.isOpen = true;
  }

  fullyCloseSideBar() {
    const offcanvasElement = document.querySelector('.offcanvas');
    const backdropElement = document.querySelector('.offcanvas-backdrop');
    offcanvasElement.classList.remove();
    offcanvasElement.parentNode.removeChild(backdropElement);
    this.isOpen = false;
  }

  userIsLoggedin() {
    this.username = this.user.getUsername();
    return this.user.getUsername();
  }

  onDashboard() {
    console.log('Dashboard button clicked');
  }

  onGameAdd() {
    this.router.navigate(['/add-game']);
    this.fullyCloseSideBar();
  }

  onGamesList() {
    this.router.navigate(['/game-list']);
    this.fullyCloseSideBar();
  }

  executeFunction(functionName: string) {
    switch (functionName) {
      case 'onLogout': this.onLogout();
        break;
      case 'onDashboard': this.onDashboard();
        break;
      case 'onGameAdd': this.onGameAdd();
        break;
      case 'onGameList': this.onGamesList();
        break;
      default:
        console.log('Unknown function');
        break;
    }
  }
  ngOnInit() {
    this.offcanvas = document.getElementById('offcanvasRight');
    console.log(this.offcanvas);
  }
}
