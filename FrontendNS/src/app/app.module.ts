import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GameAddComponent } from './game/game-add/game-add.component';
import { GameListComponent } from './game/game-list/game-list.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { SettingsComponent } from './settings/settings.component';
import { GameSelectionComponent } from './user-games/game-selection/game-selection.component';
import { UserGameAddComponent } from './user-games/user-game-add/user-game-add.component';
import { UserService } from './services/user.service';
import { GameService } from './services/game.service';
import { AlertifyService } from './services/alertify.service';
import { HttpErrorInterceptorService } from './services/error-interceptor.service';
import { UserGameDetailsComponent } from './user-games/user-game-details/user-game-details.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { MaterialModule } from './material/material.module';
import { SidenavService } from './services/sidenav.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FriendsPageComponent } from './friends/friends-page/friends-page.component';
import { FriendsPageSidenavComponent } from './friends/friends-page-sidenav/friends-page-sidenav.component';
import { FriendsChatComponent } from './friends/friends-chat/friends-chat.component';
import { FriendsListComponent } from './friends/friends-list/friends-list.component';
import { ViewProfileComponent } from './user/view-profile/view-profile.component';
import { FriendsIncomingRequestsComponent } from './friends/friends-incoming-requests/friends-incoming-requests.component';
import { FriendsAllComponent } from './friends/friends-all/friends-all.component';
import { FriendsAddComponent } from './friends/friends-add/friends-add.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UnauthorizedComponent } from './error/unauthorized/unauthorized.component';
import { ProfileCardComponent } from './user/profile-card/profile-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ProfileCardPopupComponent } from './user/profile-card-popup/profile-card-popup.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'add-game', component: GameAddComponent},
  {path: 'game-list', component: GameListComponent},
  {path: 'game-selection', component: GameSelectionComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'friends', component: FriendsPageComponent},
  {path: 'view-profile/:username', component: ViewProfileComponent},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: '', component: WelcomePageComponent},
  {path: 'test', component: ProfileCardComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    GameAddComponent,
    GameListComponent,
    FilterPipe,
    SortPipe,
    SettingsComponent,
    GameSelectionComponent,
    UserGameAddComponent,
    UserGameDetailsComponent,
    ConfirmDeleteComponent,
    SidenavComponent,
    FriendsPageComponent,
    FriendsPageSidenavComponent,
    FriendsChatComponent,
    FriendsListComponent,
    ViewProfileComponent,
    FriendsIncomingRequestsComponent,
    FriendsAllComponent,
    FriendsAddComponent,
    UnauthorizedComponent,
    ProfileCardComponent,
    WelcomePageComponent,
    ProfileCardPopupComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'}),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxPaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    UserService,
    GameService,
    AlertifyService,
    SidenavService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
