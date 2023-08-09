import { Component, Input } from '@angular/core';
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
  @Input() userProfile: UserDTO;
  userViewing: UserDTO;
  userProfileGames: UserGameDTO[];
  userGameDetailsOpen: boolean = false;
  userGameSelected: UserGameDTO;
  private userSubscription: Subscription;

  selectedTab: string = 'description';

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
    if (this.userViewing?.profileImageUrl === '') {
      this.userViewing.profileImageUrl = '/assets/images/default-user.png';
    }
    if (this.userViewing?.displayName === '') {
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
    const token = localStorage.getItem('token');
    this.user.getUserByToken(token).subscribe((response: any) => {
      this.userViewing = response;
      if (this.isViewingOwnProfile()) {
        this.userGame.getUserGames(this.userViewing.username).subscribe((response: any) => {
          this.userProfileGames = response;
          this.assignDefaultValues();
        });
      } else {
        this.userGame.getUserGamesForMatching(this.userViewing.username, this.userProfile.username).subscribe((response: any) => {
          this.userProfileGames = response;
          this.assignDefaultValues();
        });
      }
    });
  }

  private isViewingOwnProfile(): boolean {
    return this.userViewing && this.userProfile && this.userViewing.username === this.userProfile.username;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
