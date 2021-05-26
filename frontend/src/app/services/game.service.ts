import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserRoom } from '../models/userRoom';
import { CreateGameData } from '../models/createGameData';

import { Observable } from 'rxjs';
import { GameLobby } from '../models/gameLobby';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  AUTH_SERVER: string = environment.apiUrl;//'http://localhost:3000';  //the backend server

  constructor(private HttpClient: HttpClient, private AuthService: AuthService) { }

  startRoom(roomParameters: CreateGameData): Promise<any>{ //make an interface that is something like "name, password, userHost" or something like that
    console.log("WwWwWwW: ",roomParameters)
    return this.HttpClient.post(`${this.AUTH_SERVER}/api/game/startroom`, roomParameters)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }

  roomExists(id: any): Promise<boolean>{
    return this.HttpClient.get(`${this.AUTH_SERVER}/api/game/roomexists/${id}`)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }

  roomHasPassword(id: any): Promise<boolean>{
    return this.HttpClient.get(`${this.AUTH_SERVER}/api/game/roomhaspassword/${id}`)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }

  getRoomUsers(_roomID: number): Promise<UserRoom[]>{
    let content = {roomID: _roomID}
    return this.HttpClient.post<Array<UserRoom>>(`${this.AUTH_SERVER}/api/game/getroomusers`, content)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });;
  }

  addUserToRoom(_roomID: number, _userData: UserRoom){
    console.log("adding user to room")
    let content = {roomID: _roomID, user: _userData}
    console.log("content: ",content)
    return this.HttpClient.post(`${this.AUTH_SERVER}/api/game/addusertoroom`, content);
  }

  removeUserFromRoom(_roomID: number, _userName: string){
    console.log("removing user from room")
    let content = {roomID: _roomID, userName: _userName}
    console.log("content: ",content)
    return this.HttpClient.post(`${this.AUTH_SERVER}/api/game/removeusertoroom`, content);
  }

  getGameRooms(index: number, offset: number): Observable<GameLobby>{
    return this.HttpClient.get<GameLobby>(`${this.AUTH_SERVER}/api/game/gamelobby/${index}/${offset}`);
  }

  getSecretWordDisplay(id: any): Promise<String>{
    return this.HttpClient.post(`${this.AUTH_SERVER}/api/game/getDisplaySecretWord`, {roomID: id})
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }
  
  getSecretWord(id: any): Promise<String>{
    return this.HttpClient.post(`${this.AUTH_SERVER}/api/game/getSecretWord`, {roomID: id})
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }

  userCanDraw(_id: any, _userName: any): Promise<boolean>{
    return this.HttpClient.post(`${this.AUTH_SERVER}/api/game/userCanDraw`, {id: _id, userName: _userName})
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });;
  }

  isRightPassword(_id: any, _password: any): Promise<boolean>{
    return this.HttpClient.post(`${this.AUTH_SERVER}/api/game/isRightPassword`, {id: _id, password: _password})
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });;
  }
}
