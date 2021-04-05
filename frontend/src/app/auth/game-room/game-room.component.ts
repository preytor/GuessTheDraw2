import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { GameService } from '../../services/game.service';
import { UserRoom } from '../../models/userRoom';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  roomID: number = -1;
  roomUsers: Array<UserRoom> = [];

  constructor(private GameService: GameService, private Router: Router, private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      let parameterID = params['id'];
      let IDinNumber: number = +parameterID;
      if(!isNaN(IDinNumber)){      
        if(this.roomExists(IDinNumber)){
          this.roomID = IDinNumber;
          console.log("room id: "+IDinNumber);
        }else{
          console.log("room doesnt exist");
        }
      }else{
        console.log("no room");
      }

    });
  }

  ngOnInit(): void {
  }

  roomExists(id: number): boolean { //pending to fix this, the response is weird
    this.GameService.roomExists(id)
    .subscribe(
      res => {
        console.log(res)
        return res;
      },
      err => console.log(err)
    );
    return false
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
