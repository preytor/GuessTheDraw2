import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
//import { io } from 'socket.io-client';
//import * as io from 'socket.io-client';
import { io, Socket } from 'socket.io-client/build/index';
import { ChatMessage } from '../models/chatMessage';
import { DrawLine } from '../models/drawLine';
import { Event } from '../models/event';
//var io = require('socket.io-client'); //doesnt work well

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;

  constructor() { 
    this.socket = io("ws://localhost:3000", {
      withCredentials: true,
      extraHeaders: {
        "gtd-socket": "gtd"
      }
    });
  }

  public initSocket(): void{
    try {
      this.socket = io("ws://localhost:3000", {
      withCredentials: true,
      extraHeaders: {
        "gtd-socket": "gtd"
      }
    });
    }catch(e){
      console.log('Could not connect to the server')
    }
  }

  /** chat */
  public joinRoom(id: string): void{
/*  this.socket.emit('join', { id }, () => {
      alert('memer');
    });*/
    this.socket.emit('join', id);
  }

  public leaveRoom(id: number) {
    this.socket.emit('leave', id);
    this.socket.off();
  }

  public sendMessage(message: ChatMessage): void {
    this.socket.emit('chat_message', message);
  }

  public onMessage(): Observable<ChatMessage>{
    return new Observable<ChatMessage>((observer) => {
      this.socket.on('chat_message', (data: ChatMessage) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any>{
    return new Observable<Event>((observer) => {
      this.socket.on(event, () => observer.next());
    });
  }

  /** Drawing */
  emitDrawing(x0: number, y0: number, x1: number, y1: number, color: string, width: number) {
    let drawSocket: DrawLine = {
      color: color,
      width: width,
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1
    }
    this.socket.emit(drawSocket);
  }

  clearCanvas() {
    this.socket.emit('clear', true);
  }

}
