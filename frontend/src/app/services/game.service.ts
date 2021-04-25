import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserRoom } from '../models/userRoom';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  AUTH_SERVER: string = 'http://localhost:3000';  //the backend server

  constructor(private HttpClient: HttpClient, private AuthService: AuthService) { }

  startRoom(roomParameters: any){ //make an interface that is something like "name, password, userHost" or something like that
    return this.HttpClient.post(`${this.AUTH_SERVER}/game/startroom`, roomParameters);
  }

  roomExists(id: any): Promise<boolean>{
    return this.HttpClient.get(`${this.AUTH_SERVER}/game/roomexists/${id}`)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
    
    //this works but doesnt work at the same time
    //return this.HttpClient.get<boolean>(`${this.AUTH_SERVER}/game/roomexists/${id}`)
    //.subscribe((data) => {console.log(data); return data});





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

        console.log("exists : ", _exists)
        return false;*/
/*    return this.HttpClient.get(`${this.AUTH_SERVER}/game/roomexists/${id}`)
    .pipe(
      tap(
        (res) => {
          if(res){
            console.log("response: ", Object(res)["exists"])
            return Object(res)["exists"];
          }
        }
      )
    );*/
  }

  roomHasPassword(id: any): Promise<boolean>{
    return this.HttpClient.get(`${this.AUTH_SERVER}/game/roomhaspassword/${id}`)
    .toPromise().then(response => <any>response).catch(error => {
      return error;
    });
  }

  getRoomUsers(roomID: number){
    return this.HttpClient.post<Array<UserRoom>>(`${this.AUTH_SERVER}/game/getroomusers`, roomID);
  }

  addUserToRoom(roomID: number, userData: any){
    return this.HttpClient.post(`${this.AUTH_SERVER}/game/addusertoroom/`, roomID, userData);
  }
}
