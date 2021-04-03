import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { UserRoom } from '../../models/userRoom';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  roomUsers: Array<UserRoom> = [];

  constructor(private GameService: GameService, private Router: Router) { }

  ngOnInit(): void {
  }

  getRoomUsers(roomID: number){
    this.GameService.getRoomUsers(roomID)
    .subscribe(
      res => {
        console.log(res)
        this.roomUsers = res;
      },
      err => console.log(err)
    )
  }

}
