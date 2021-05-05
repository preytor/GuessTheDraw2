import { Server, Socket } from "socket.io";

//doesnt work, for now ignore
const chat = (io: Server) => {
  console.log("entra en chat")
  
  io.on("connection", function (socket: Socket) {
    console.log("A user connected test");
  });
};

export default chat;
