import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  roomParameters = {
    roomName: "",
    roomPassword: ""
    //find a way to get the user or generate a random name like "anonymous<numbers>"
  }

  constructor(private GameService: GameService, private Router: Router) { }

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
