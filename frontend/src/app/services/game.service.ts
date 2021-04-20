import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserRoom } from '../models/userRoom';
import { tap } from 'rxjs/operators';

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
/*    let _exists;
    this.HttpClient.get(`${this.AUTH_SERVER}/game/roomexists/${id}`)
    .subscribe(
      res => {
        Object.values(res)[0];
      },
      err => console.log(err)
    );*/

/*    let _exists = this.HttpClient.get(`${this.AUTH_SERVER}/game/roomexists/${id}`)
    .pipe(
      tap(
        (res) => {
          if(res){
            let response = Object(res)["exists"];
            console.log("response: ", response)
            _exists = response;
            return response;
          }
        }
      )
    );

        console.log("exists : ", _exists)*/
    return this.HttpClient.get(`${this.AUTH_SERVER}/game/roomexists/${id}`)
    .pipe(
      tap(
        (res) => {
          if(res){
            console.log("response: ", Object(res)["exists"])
            return Object(res)["exists"];
          }
        }
      )
    );
  }

  getRoomUsers(roomID: number){
    return this.HttpClient.post<Array<UserRoom>>(`${this.AUTH_SERVER}/game/getroomusers`, roomID);
  }
}
