//import * as io from "socket.io-client"
import { io } from 'socket.io-client/build/index';

/** obsolete for now, it goes in the game-room component */

export class Chat{
    ChatInit = () => {
        console.log("initialized chat");
        io("http://localhost:3000");
    };
}


export default Chat;