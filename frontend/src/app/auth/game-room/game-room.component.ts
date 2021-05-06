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

  //currentuser
  currentUser: string = "";

  //display word
  displayWord: string = "";

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

  //timer
  timerValue: number | undefined;

  @HostListener('window:beforeunload', ['$event'])  //this still doesnt work i think
  doSomething($event:any) {
    this.GameService.removeUserFromRoom(this.chatMessage.roomId, this.currentUser)
    .subscribe( () => {
      this.socketService.leaveRoom(this.chatMessage.roomId, this.currentUser);
    });
  }

  constructor(private GameService: GameService, private Router: Router, private route: ActivatedRoute, private socketService: SocketService, private authService: AuthService) {     
    this.route.queryParams.subscribe(params => {
      let parameterID = params['id'];
      let IDinNumber: number = +parameterID;

      this.chatMessage.roomId = IDinNumber;

      //this.getRoomUsers(IDinNumber);
    });

    window.onbeforeunload = function () {
      return "Do you really want to close?";
    };

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
      //should redirect
      this.Router.navigate(['/']);
    }


  }

        
      
  ngOnDestroy(): void{
    //test if this even works, seems like it doesnt
/*    this.GameService.removeUserFromRoom(this.chatMessage.roomId, this.currentUser)
    .subscribe( () => {
      this.socketService.leaveRoom(this.chatMessage.roomId, this.currentUser);
    });*/
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
    console.log("ROOM ID GER TOOM USERS"+roomID)
    this.GameService.getRoomUsers(roomID).then(
      res => {
        Promise.resolve();
        console.log("get room users: ", res)
        let users: Array<UserRoom> = [];
        if(res != null) users = res;

        //console.log("Users in getrooom ", res)
        console.log("getting room users")
        this.roomUsers = [];
        for(let i = 0; i<users.length; i++){
          this.roomUsers.push(users[i])
        }

        this.roomUsers.sort(this.dynamicSort("-score"));
      },
      err => {
        Promise.reject();
      }
    );
  }

  private initIoconnection(): void{
    this.socketService.initSocket();
    let id: string = ""+this.chatMessage.roomId; 
    this.socketService.joinRoom(id, `user_${this.currentUser}`);

    /** Chat Messages */
    this.ioConnection = this.socketService  //this is the received messages
    .onMessage()
    .subscribe((message: any) => {  //ChatMessage
      console.log("message received: ", message.message);
      this.messages.push(message);
    });

    this.socketService.onJoin()
    .subscribe((roomID: any) => {
      console.log("join received ", roomID.roomID);
      this.getRoomUsers(roomID.roomID);
    });

    this.socketService.onLeft()
    .subscribe((roomID: any) => {
      console.log("left received ", roomID.roomID);
      this.getRoomUsers(roomID.roomID);
    });

    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log('test connected');
    });

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('test disconnected');
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

    /** Game */
    this.socketService.onHostChange()
    .subscribe((message) => {
      console.log("received host change ", message);
      //do stuff to change who can draw
    
      //restart timer
      let count: number = 60, timer = setInterval(() => {
        this.timerValue=count--;
        if(count == 1) clearInterval(timer);
      }, 1000);
    });

    this.socketService.onShowHint()
    .subscribe((message) => {
    console.log("received update hint ", message);
      //do stuff
      this.updateVisibleSecretWord();
    });
  }

  public sendMessage(): void{
    //console.log(this.messageContent);
    if(!this.messageContent){
      return;
    }

    let _chatMessage: ChatMessage = {
      from: this.currentUser,
      message: ": "+this.messageContent,
      room: this.chatMessage.roomId
    }


    this.messages.push(_chatMessage);
    this.socketService.sendMessage({
      from: this.currentUser,//"", //getauthService().getUser() or something
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

  roomHasPassword(id: number): Promise<boolean>{
    return new Promise((resolve, reject): void => {
      this.GameService.roomHasPassword(id).then(
        data => {
          console.log(`data in roomhaspassword is: ${data}`)
          if(data==true){
            resolve(true);
          }else{
            resolve(false);
          }
        }
      );
    });
  }

  initializeGame(){
    console.log("Initializing game");

    this.currentUser = this.authService.getUser();

    //init the connection to socket.io
    this.initIoconnection();

    let userdata: UserRoom = {    
      username: this.currentUser,
      isRegistered: this.authService.isLogged(),
      score: 0,
      totalScore: 0,
      hasBeenHost: false
    };
    console.log("roomid: ", this.chatMessage.roomId, "  userdata: ", userdata)
    //for some reason this below doesnt work
    this.GameService.addUserToRoom(this.chatMessage.roomId, userdata)
    .subscribe( () => {
      //refresh players in room after adding a new one
      console.log("room id thingy this "+this.chatMessage.roomId)
      this.getRoomUsers(this.chatMessage.roomId);
    })

    this.updateVisibleSecretWord();
  }

  processIfRoomHasPassword(hasPassword: boolean){
    //if it has password you have to insert it
    if(hasPassword){
      console.log("room has password")
      
      //make the verification here, but this below needs to be in
      this.initializeGame();
    }else{    //else you load the component normally
      console.log("room doesnt have password")

      //put the login to false and initialite the game
      this.initializeGame();
    }
  }

  processIfRoomExists(exists: boolean){
    console.log("PROCESSED: ",exists)
    if(exists){
      console.log("room id: "+this.chatMessage.roomId);
      //check if it has password
      this.roomHasPassword(this.chatMessage.roomId).then(
        res => {
          Promise.resolve();
          this.processIfRoomHasPassword(res);
        },
        err => {
          Promise.reject();
        }
      );
    }else{
      console.log("room doesnt exist");
      //redirect to main menu
      console.log("redirecting")
      this.Router.navigate(['/']);
    }
  }

  dynamicSort(property: string) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a: any, b: any) => {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  updateVisibleSecretWord(){
    this.getSecretWordDisplayed(this.chatMessage.roomId).then(
      res => {
        Promise.resolve();
        this.displayWord = `${res.split('').join(' ')}`;
      },
      err => {
        Promise.reject();
      }
    );
  }

  getSecretWordDisplayed(id: number): Promise<String>{
    return new Promise((resolve, reject): void => {
      this.GameService.getSecretWordDisplay(id).then(
        data => {
          let value = Object(data)["displayWord"];
          resolve(value);
        }
      );
    });
  }
}