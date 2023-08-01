import { Component } from '@angular/core';
import { mergeMap } from 'rxjs';
import { UserDTO } from 'src/app/model/user';
import { UserGame, UserGameDTO } from 'src/app/model/user-game';
import { UserGameService } from 'src/app/services/user-game.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  userProfile: UserDTO;
  userViewing: UserDTO;
  userProfileGames: UserGameDTO[];

  userForTesting = 'Testuser';

  selectedTab: string = 'games';

  constructor(
    private user: UserService,
    private userGame: UserGameService
  ) {}

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  onUserGame(game: UserGameDTO) {

  }

  assignDefaultValues() {
    if (this.userProfile.profileImageUrl === '') {
      this.userProfile.profileImageUrl = '/assets/images/default-user.png';
    }
    if (this.userProfile.displayName === '') {
      this.userProfile.displayName = this.userProfile.username;
    }
    if (this.userViewing.profileImageUrl === '') {
      this.userViewing.profileImageUrl = '/assets/images/default-user.png';
    }
    if (this.userViewing.displayName === '') {
      this.userViewing.displayName = this.userViewing.username;
    }
  }

  ngOnInit() {
    this.user.getUserByToken(localStorage.getItem('token')).pipe(
      mergeMap((response: any) => {
        this.userViewing = response;
        return this.user.getUserByUsername(this.userForTesting);
      }),
      mergeMap((response: any) => {
        this.userProfile = response;
        return this.userGame.getUserGamesForMatching(this.userViewing.username, this.userProfile.username);
      })
    ).subscribe((response: any) => {
      this.userProfileGames = response;
      console.log(response)
      this.assignDefaultValues();
    });
  }

}
