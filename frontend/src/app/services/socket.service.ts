import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
//import { io } from 'socket.io-client';
//import * as io from 'socket.io-client';
import { io, Socket } from 'socket.io-client/build/index';
import { ChatMessage } from '../models/chatMessage';
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
    this.socket = io("ws://localhost:3000", {
      withCredentials: true,
      extraHeaders: {
        "gtd-socket": "gtd"
      }
    });
  }

  public joinRoom(id: number): void{
/*    this.socket.emit('join', { id }, () => {
      alert('memer');
    });*/
    this.socket.emit('join', id);
  }

  public leaveRoom(id: number) {
    this.socket.emit('disconnect', id);
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

  public onMessage2(): Observable<ChatMessage>{
    return fromEvent(this.socket, 'chat_message');
  }

  public getMessages = () => {
    return Observable.create((observer: any) => {
      this.socket.on('chat_message', (message: any) => {
        observer.next(message);
      });
    });
  }

  public onEvent(event: Event): Observable<any>{
    return new Observable<Event>((observer) => {
      this.socket.on(event, () => observer.next());
    });
  }

  public listenToMessages(){
    console.log("enters in here listenToMessages();")
    this.socket.on('chat_message', (message: any) => {
      console.log("chat message: ", message.message)
    });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

}
