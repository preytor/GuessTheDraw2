import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { GameService } from '../../services/game.service';
import { UserRoom } from '../../models/userRoom';
import { io } from 'socket.io-client/build/index';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  roomID: number = -1;
  roomUsers: Array<UserRoom> = [];
  socket: any;

  chatMessage = {
    message: "",
    roomId: 0
  }

  constructor(private GameService: GameService, private Router: Router, private route: ActivatedRoute) {     
    //initialize connection with the chat
    this.socket = io("http://localhost:3000");
    if(this.socket!=null){
      console.log("initialized chat");
    }
   
    this.route.queryParams.subscribe(params => {
      let parameterID = params['id'];
      let IDinNumber: number = +parameterID;
      this.chatMessage.roomId = IDinNumber;

      /** add  this in the "roomExists" */
      //this.socket.join(IDinNumber);

      if(!isNaN(IDinNumber)){      
        if(this.roomExists(IDinNumber)){
          this.roomID = IDinNumber;
          console.log("room id: "+IDinNumber);
          //
        }else{
          console.log("room doesnt exist");
          //redirect to main menu
        }
      }else{
        console.log("no room");
      }

      /** Submiting the chat message */
      


      /** Chat events */
      this.socket.on("chat message", function (message: any) {
        console.log(message);
        document.body.innerHTML += message;
      });

      /** Chat functions */
      this.sendMessage("test on client", IDinNumber);


    });





  }

  ngOnInit(): void {
  }

  roomExists(id: number): boolean { //pending to fix this, the response is weird
    this.GameService.roomExists(id)
    .subscribe(
      res => {
        console.log('console room exists'+res)
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

  
  //try this:
  //https://sbcode.net/tssock/server-io-broadcast/

  /** chat functions */
  sendChatMessage(){
    event?.preventDefault();
    this.sendMessage(this.chatMessage.message, this.chatMessage.roomId);
  }

  sendMessage = (text: string, roomid: number) => {
    this.socket.emit('chat message', text, roomid);
  }

}
