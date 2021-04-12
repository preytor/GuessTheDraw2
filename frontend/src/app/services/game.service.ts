import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserRoom } from '../models/userRoom';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  AUTH_SERVER: string = 'http://localhost:3000';  //the backend server

  constructor(private HttpClient: HttpClient, private AuthService: AuthService) { }

  startRoom(roomParameters: any){ //make an interface that is something like "name, password, userHost" or something like that
    return this.HttpClient.post(`${this.AUTH_SERVER}/game/startroom`, roomParameters);
  }

  roomExists(id: number){
    return this.HttpClient.get(`${this.AUTH_SERVER}/game/roomexists/${id}`);
  }

  getRoomUsers(roomID: number){
    return this.HttpClient.post<Array<UserRoom>>(`${this.AUTH_SERVER}/game/getroomusers`, roomID);
  }
}
