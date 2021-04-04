import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {


  //find a way to get the user or generate a random name like "anonymous<numbers>"  
  number = Math.random()*100;
  
  username = (this.authService.isLogged()) ? this.authService.current_user : `anonymous${this.number}`;

  roomParameters = {
    roomName: "",
    roomPassword: "",
    username: this.username
  }

  constructor(private GameService: GameService, private Router: Router, private authService: AuthService) { }


  ngOnInit(): void {
  }

  createRoom(){
    this.GameService.startRoom(this.roomParameters)
    .subscribe(
      res => {
        console.log(res)
        //if res something router redirect to game room by GET parameter, in GET you have the URL of the room
      },
      err => console.log(err)
    )
  }

}
