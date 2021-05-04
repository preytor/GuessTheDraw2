import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { CreateGameData } from 'src/app/models/createGameData';
import { startRoom } from 'src/app/models/startRoom';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {


  //find a way to get the user or generate a random name like "anonymous<numbers>"  
  number = Math.floor(Math.random()*101);
  
  username = (this.authService.isLogged()) ? this.authService.getUser() : `anonymous${this.number}`;

  roomParameters: CreateGameData = {
    roomName: "",
    roomPassword: "",
    username: this.username,
    isRegistered: this.authService.isLogged()
  }

  constructor(private GameService: GameService, private Router: Router, private authService: AuthService) { }


  ngOnInit(): void {
  }

  createRoom(){
    this.GameService.startRoom(this.roomParameters)
    .then(
      res => {
        Promise.resolve();
        console.log(res)

        let resp: any = res;
        
        //if res something router redirect to game room by GET parameter, in GET you have the URL of the room
        this.Router.navigate(['/room', { queryParams: { id: resp.id} }]);
      },
      err => {
        Promise.reject();
        console.log(err)
      }
    )
  }

}
