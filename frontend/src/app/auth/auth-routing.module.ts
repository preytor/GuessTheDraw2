import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { RankingComponent } from './ranking/ranking.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { BrowseRoomsComponent } from './browse-rooms/browse-rooms.component';

import { PrivateSitesGuard } from '../private-sites.guard';


const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'room', component: GameRoomComponent},
    {path: 'create-game', component: CreateRoomComponent},
    {path: 'join-game', component: BrowseRoomsComponent},
    {path: '', component: MainMenuComponent},
    {path: 'ranking', component: RankingComponent},
    {path: 'settings', component: UserSettingsComponent, canActivate: [PrivateSitesGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }