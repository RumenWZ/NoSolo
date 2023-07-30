import { Component } from '@angular/core';
import { UserDTO } from 'src/app/model/user';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  forUser: UserDTO;

  constructor() {}

  ngOnInit() {

  }
}
