import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from '../services/auth.service';
import { GameRoomComponent } from './game-room/game-room.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { RankingComponent } from './ranking/ranking.component';

import { PrivateSitesGuard } from '../private-sites.guard';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, GameRoomComponent, UserSettingsComponent, RankingComponent],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    HttpClientModule
  ],
  providers:[AuthService, PrivateSitesGuard]
})
export class AuthModule { }
