import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

//doesnt work, for now ignore
const chat = (io: Server<DefaultEventsMap, DefaultEventsMap>) => {
  io.on("connection", function (socket: Socket) {
    console.log("A user connected test");
  });
};

export default chat;
