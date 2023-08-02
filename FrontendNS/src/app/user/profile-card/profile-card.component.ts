import { Component } from '@angular/core';
import { Subscription, mergeMap } from 'rxjs';
import { UserDTO } from 'src/app/model/user';
import { UserGameDTO } from 'src/app/model/user-game';
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
  userGameDetailsOpen: boolean = false;
  userGameSelected: UserGameDTO;
  private userSubscription: Subscription;

  selectedTab: string = 'contact';

  constructor(
    private user: UserService,
    private userGame: UserGameService
  ) {
    this.userSubscription = this.user.userForUserCard.subscribe((user: UserDTO) => {
      this.userProfile = user;
    });
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  onUserGame(game: UserGameDTO) {
    this.userGameDetailsOpen = true;
    this.userGameSelected = game;
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
    if (this.userProfile.summary === '') {
      this.userProfile.summary = 'No information given.';
    }
    if (this.userProfile.discordUsername === '') {
      this.userProfile.discordUsername = 'None provided.';
    }
  }

  ngOnInit() {
    this.user.getUserByToken(localStorage.getItem('token')).pipe(
      mergeMap((response: any) => {
        this.userViewing = response;
        return this.userGame.getUserGamesForMatching(this.userViewing.username, this.userProfile.username);
      })
    ).subscribe((response: any) => {
      this.userProfileGames = response;
      this.assignDefaultValues();
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
