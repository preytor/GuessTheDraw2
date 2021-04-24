import { AfterContentInit, AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { GameService } from '../../services/game.service';
import { UserRoom } from '../../models/userRoom';
import { Event } from '../../models/event';
//import { io, Socket } from 'socket.io-client/build/index';
//import * as socketIo from 'socket.io-client';
import { SocketService } from '../../services/socket.service';
import { ChatMessage } from 'src/app/models/chatMessage';
import { AuthService } from '../../services/auth.service';
import { DrawLine } from 'src/app/models/drawLine';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements AfterContentInit, AfterViewInit {

  roomUsers: Array<UserRoom> = [];
 // socket: Socket;

  messages: ChatMessage[] = [];
  messageContent: string = "";
  ioConnection: any;

  chatMessage = {
    message: "",
    roomId: -1
  }

  canDraw: boolean = true;  //check here if its the turn of this player to draw (send a request to the server/the server sends you a socket telling you its your turn)
  isDrawing: boolean = false;

  currentDraw = {
    color: 'black',
    width: 2,
    x: -1,
    y: -1,
  }

  //canvas
  @ViewChild('drawingboard') drawingboard!: ElementRef<HTMLCanvasElement>;
  public content!: CanvasRenderingContext2D | null;

  constructor(private GameService: GameService, private Router: Router, private route: ActivatedRoute, private socketService: SocketService, private authService: AuthService) {     
    this.route.queryParams.subscribe(params => {
      let parameterID = params['id'];
      let IDinNumber: number = +parameterID;

      this.chatMessage.roomId = IDinNumber;
    });



  }

  ngAfterViewInit(): void {
    this.content = this.drawingboard.nativeElement.getContext('2d');


  }

  

  ngAfterContentInit(): void {
    if(!isNaN(this.chatMessage.roomId)){
      this.roomExists(this.chatMessage.roomId).then(
        res => {
          Promise.resolve();
          this.processIfRoomExists(res);
        },
        err => {
          Promise.reject();
        }
      );
    }else{
      console.log("no room");
    }


  }

        
      
  ngOnDestroy(): void{
    this.socketService.leaveRoom(this.chatMessage.roomId);
  }

/*  roomExists(id: number): boolean { //pending to fix this, the response is weird
    this.GameService.roomExists(id)
    .subscribe(
      res => {
        console.log('console room exists '+Object(res)["exists"])///////////////////////////////////////////////
        return Object(res)["exists"];
      },
      err => console.log(err)
    );
    return false
  }*/

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
    this.socketService.joinRoom(`room_${this.chatMessage.roomId}`);

    /** Chat Messages */
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

    /** Drawing */
    this.socketService.onDrawCanvas()
    .subscribe((message: DrawLine) => {
      console.log("draw received ", message);
      //draw here stuff
      this.drawLine(message.x0, message.y0, message.x1, message.y1, message.color, message.width, false);
    });

    this.socketService.onClearCanvas()
    .subscribe((message) => {
      console.log("clear canvas received ", message);
      //draw here stuff
      this.clearCanvas(false);
    });

  }

  public sendMessage(): void{
    //console.log(this.messageContent);
    if(!this.messageContent){
      return;
    }

    this.socketService.sendMessage({
      from: this.authService.getUser()!,//"", //getauthService().getUser() or something
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

  /** Drawing functions */
  changeDrawingColor(color: string): void{
    if(!this.canDraw) return
    console.log("new color is ", color)
    this.currentDraw.color = color;
  }

  changeDrawingSize(size: number): void{
    if(!this.canDraw) return
    console.log("new size is ", size)
    this.currentDraw.width = size;
  }

  clearCanvas(emit: boolean): void{
    if(!this.canDraw) return
    console.log("canvas cleared");
    this.content?.clearRect(0, 0, this.drawingboard.nativeElement.width, this.drawingboard.nativeElement.height);
    if(!emit) { return }
    this.socketService.clearCanvas(this.chatMessage.roomId);
  }

  drawLine(x0: number, y0: number, x1: number, y1: number, color: string, width: number, emit: boolean) {
    this.content?.beginPath();
    this.content?.moveTo(x0, y0);
    this.content?.lineTo(x1, y1);
    this.content!.strokeStyle = color;
    this.content!.lineWidth = width;
    this.content?.stroke();
    this.content?.closePath();

    if(!emit) { return }

    this.socketService.emitDrawing(x0, y0, x1, y1, color, width, this.chatMessage.roomId);
  }

  getMousePos(event: MouseEvent){
    let rect = this.drawingboard.nativeElement.getBoundingClientRect();

    let scaleX = this.drawingboard.nativeElement.width / rect.width;
    let scaleY = this.drawingboard.nativeElement.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    }
  }

  //mouse functions
  onMouseMove(e: MouseEvent){
    if(!this.canDraw) return
    if(!this.isDrawing) return
    console.log(e);
    
    let mousePos = this.getMousePos(e);

    this.drawLine(this.currentDraw.x, this.currentDraw.y, mousePos.x, mousePos.y, this.currentDraw.color, this.currentDraw.width, true);

    this.currentDraw.x = mousePos.x;
    this.currentDraw.y = mousePos.y;
  }

  throttle(callback: any, delay: number){
    let previousCall = new Date().getTime();

    return () => {
      let time = new Date().getTime();

      if((time-previousCall) >= delay){
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  beginDrawing(e: MouseEvent){
    if(!this.canDraw) return
    this.isDrawing = true;

    let mousePos = this.getMousePos(e);

    this.currentDraw.x = mousePos.x;
    this.currentDraw.y = mousePos.y;
  }

  drawDot(e: MouseEvent){
    if(!this.canDraw) return
    if (this.isDrawing) { return; }

    let mousePos = this.getMousePos(e);

    this.drawLine(mousePos.x, mousePos.y, mousePos.x+this.currentDraw.width, mousePos.y+this.currentDraw.width, this.currentDraw.color, this.currentDraw.width, true);
    this.isDrawing = false;
  }

  stopDrawing(e: MouseEvent){
    //if (this.isDrawing) { return; }
    this.isDrawing = false;
  }
  
  //other methods
  roomExists(id: number): Promise<boolean>{
    return new Promise((resolve, reject): void => {
      this.GameService.roomExists(id).then(
        data => {
          console.log(`data in roomexists is: ${data}`)
          if(data==true){
            resolve(true);
          }else{
            resolve(false);
          }
        }
      );
    });
  }
    /*
    this.GameService.roomExists(id)
    .then(data => {
      console.log(`data in roomexists is: ${data}`)
      if(data==true){
        return true;
      }else{
        return false;
      }
    },
    (er) => {
      console.log(er);
      return false;
    });
    return false;
  }*/

  processIfRoomExists(exists: boolean){
    console.log("PROCESSED: ",exists)
    if(exists){
      console.log("room id: "+this.chatMessage.roomId);
      //init the connection to socket.io
      this.initIoconnection();

      //check if it has password

        //if it has password you have to insert it

      //else you load the component normally

    }else{
      console.log("room doesnt exist");////////////////////////////////////////////////
      //redirect to main menu
      console.log("redirecting")
    }
  }
}