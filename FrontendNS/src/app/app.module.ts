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
import { SidebarComponent } from './sidebar/sidebar.component';
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

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'add-game', component: GameAddComponent},
  {path: 'game-list', component: GameListComponent},
  {path: 'game-selection', component: GameSelectionComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    SidebarComponent,
    GameAddComponent,
    GameListComponent,
    FilterPipe,
    SortPipe,
    SettingsComponent,
    GameSelectionComponent,
    UserGameAddComponent,
    UserGameDetailsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'}),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    UserService,
    GameService,
    AlertifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
