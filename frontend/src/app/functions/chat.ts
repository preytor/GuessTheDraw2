//import * as io from "socket.io-client"
import { io } from 'socket.io-client/build/index';
import { environment } from 'src/environments/environment';

/** obsolete for now, it goes in the game-room component */

export class Chat{
    ChatInit = () => {
        console.log("initialized chat");
        io(environment.apiUrl);
    };
}


export default Chat;