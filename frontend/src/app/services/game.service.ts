import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserRoom } from '../models/userRoom';
import { CreateGameData } from '../models/createGameData';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  AUTH_SERVER: string = 'http://localhost:3000';  //the backend server

  constructor(private HttpClient: HttpClient, private AuthService: AuthService) { }

  startRoom(roomParameters: CreateGameData){ //make an interface that is something like "name, password, userHost" or something like that
    return this.HttpClient.post(`${this.AUTH_SERVER}/game/startroom`, roomParameters);
  }

  roomExists(id: any): Promise<boolean>{
    return this.HttpClient.get(`${this.AUTH_SERVER}/game/roomexists/${id}`)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }

  roomHasPassword(id: any): Promise<boolean>{
    return this.HttpClient.get(`${this.AUTH_SERVER}/game/roomhaspassword/${id}`)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }

  getRoomUsers(_roomID: number): Promise<UserRoom[]>{
    let content = {roomID: _roomID}
    return this.HttpClient.post<Array<UserRoom>>(`${this.AUTH_SERVER}/game/getroomusers`, content)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });;
  }

  addUserToRoom(_roomID: number, _userData: UserRoom){
    console.log("adding user to room")
    let content = {roomID: _roomID, user: _userData}
    console.log("content: ",content)
    return this.HttpClient.post(`${this.AUTH_SERVER}/game/addusertoroom`, content);
  }
}
