import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { GameService } from '../../services/game.service';
import { UserRoom } from '../../models/userRoom';
import { Event } from '../../models/event';
//import { io, Socket } from 'socket.io-client/build/index';
//import * as socketIo from 'socket.io-client';
import { SocketService } from '../../services/socket.service';
import { ChatMessage } from 'src/app/models/chatMessage';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  roomUsers: Array<UserRoom> = [];
 // socket: Socket;

  messages: ChatMessage[] = [];
  messageContent: string = "";
  ioConnection: any;

  chatMessage = {
    message: "",
    roomId: 0
  }

  constructor(private GameService: GameService, private Router: Router, private route: ActivatedRoute, private socketService: SocketService) {     
    //initialize connection with the chat
/*    this.socket = io("http://localhost:3000");
    if(this.socket!=null){
      console.log("initialized chat");
    }*/

    this.route.queryParams.subscribe(params => {
      let parameterID = params['id'];
      let IDinNumber: number = +parameterID;

      this.chatMessage.roomId = IDinNumber;
      this.initIoconnection();

      this.socketService  //this is the received messages
      .onMessage()
      .subscribe((message: any) => {  //ChatMessage
        console.log("message received: ", message.message);
        this.messages.push(message);
      });

      
      this.socketService  //this is the received messages
      .onMessage2()
      .subscribe((message: ChatMessage) => {  //ChatMessage
        console.log("message 2 received: ", message.message);
        this.messages.push(message);
      });

      /** add  this in the "roomExists" */
      //this.socket.join(IDinNumber); //FIGURE OUT WHERE TO PUT THIS//

      if(!isNaN(IDinNumber)){      
        if(this.roomExists(IDinNumber)){
          this.chatMessage.roomId = IDinNumber;
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
      
      //localStorage.debug = '*'; socket.io debug

      /** Chat events */

  /*    this.socket.on("chat message", function (message: any) {
        console.log("debug chat message");
        console.log(message);
        document.body.innerHTML += message;
      });*/

      /** Chat functions */
      //this.sendMessage("test on client", IDinNumber);

      this.socketService.onMessage2();
      this.socketService.listenToMessages();//doesnt listen
    });


  }

  

  ngOnInit(): void {
    this.socketService.listen("chat_message")
    .subscribe((data: any) => {
      console.log(data);
    });

    this.socketService
    .getMessages()
    .subscribe((message: ChatMessage) => {
      console.log("message: ", message);
      this.messages.push(message);
    });

    this.socketService
    .onMessage()
    .subscribe((message: ChatMessage) => {
      console.log("message 1 : ", message);
      this.messages.push(message);
    });

    this.socketService
    .onMessage2()
    .subscribe((message: ChatMessage) => {
      console.log("message 2: ", message);
      this.messages.push(message);
    });
  }

        
      
  ngOnDestroy(): void{
    this.socketService.leaveRoom(this.chatMessage.roomId);
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

  private initIoconnection(): void{
    this.socketService.initSocket();
    this.socketService.joinRoom(this.chatMessage.roomId);

    this.ioConnection = this.socketService  //this is the received messages
    .onMessage()
    .subscribe((message: any) => {  //ChatMessage
      console.log("message received: ", message.message);
      this.messages.push(message);
    });

    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log('test connected');
    });

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('test disconnected');
    });

    this.socketService.onEvent(Event.MESSAGE).subscribe((message: any) => {
      console.log("message received: ", message.message);
    });
  }

  public sendMessage(): void{
    //console.log(this.messageContent);
    if(!this.messageContent){
      return;
    }

    this.socketService.sendMessage({
      from: "", //getauthService().getUser() or something
      message: this.messageContent,
      room: this.chatMessage.roomId
    });
    //console.log("room: ",this.chatMessage.roomId);
    this.messageContent = "";
  }
  
  //try this:
  //https://sbcode.net/tssock/server-io-broadcast/

  /** chat functions */
  sendChatMessage(){
    event?.preventDefault();
   // if(this.chatMessage.message!==""){
   //   this.sendMessage(this.chatMessage.message, this.chatMessage.roomId);
  //  }
  }/**

  sendMessage = (text: string, roomid: number) => {
    this.socket.emit('chat message', text, roomid);
  }*/

}
