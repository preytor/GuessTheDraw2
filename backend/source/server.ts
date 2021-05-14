import http from "http";
import express from "express";
import logging from "./config/logging";
import config from "./config/config";
import mongoose from "mongoose";
import sampleRoutes from "./routes/sample";
import userRoutes from "./routes/user";
import gameRoutes from "./routes/game";
import gamedata from "./gamedata";
import GameLogic from "./game-logic";
import Chat from "./controllers/chat";
import { Server, Socket } from "socket.io";
import { GameData } from "./models/gameData";
//import { createAdapter } from 'socket.io-redis';
//import { RedisClient } from 'redis';

var cors = require("cors");

const NAMESPACE = "Server";
const CORS_ORIGIN = ["http://localhost:4200"]; //add here the other ip
const router = express();

/** Create the server */
const httpServer = http.createServer(router);
/** Create the socket server */
export const io = new Server(httpServer, {
  //httpServer instead of 4200
  //ponerle aqui la ip del cliente
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["gtd-socket"],
    credentials: true,
  },
});
//const pubClient = new RedisClient({ host: 'localhost', port: 4200 });
//const subClient = pubClient.duplicate();

//io.adapter(createAdapter({ pubClient, subClient }));

/** Holding the game data */

const newgame: GameData = {
  gameUsers: [],
  roomName: "ddd",
  roomPassword: "d",
  id: 1,
  secretWord: "meme",
  displaySecretWord: "____",
  hasFinished: false,
  hostName: "",
  timer: 60,
};

const newgame2: GameData = {
  gameUsers: [],
  roomName: "meme2",
  roomPassword: "",
  id: 2,
  secretWord: "as",
  displaySecretWord: "__",
  hasFinished: false,
  hostName: "",
  timer: 60,
};

gamedata.addGame(newgame);
gamedata.addGame(newgame2);

logging.info("GAME", `Started module to handle the games`);

var x: any = gamedata.getCurrentGames().entries();

logging.info("get current games:", gamedata.getGameAt(0).secretWord); //this works

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    logging.info(NAMESPACE, "Connected to mongoDB!");
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

/** Logging the request */
router.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    );
  });

  next();
});

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** Rules of our API */
const originsWhitelist = ["http://localhost:4200", "http://localhost:80", "*"];

const options = {
  //: cors.CorsOptions
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: function (origin: any, callback: any) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  preflightContinue: false,
};

//use cors middleware
router.use(cors(options));

/** Routes */
router.use("/sample", sampleRoutes);
router.use(userRoutes);
router.use(gameRoutes);

/** Error Handling */
router.use((req, res, next) => {
  const error = new Error("not found");

  return res.status(404).json({
    message: error.message,
  });
});

/** Chat */
router.use(Chat); //doesnt really work
io.on("connection", function (socket: Socket) {
  //mandar el socket a la ip del cliente
  console.log("A user connected");

  /* not used, changed to disconnecting
  socket.on("disconnect", (id) => {
    console.log(`--player left ${id}`)
    console.log("player left the room ", socket.id);
    console.log(socket.rooms.size)
    socket.rooms.forEach(
      object => console.log("room left: "+object)
    )
    console.log("player left the room  --");

    //console.log(reason); // "ping timeout"
  });*/

  socket.on("disconnecting", function () {
    let rooms = socket.rooms;

    let _roomID = -1;
    let _userN = "";
    rooms.forEach(function (room) {
      if (room.indexOf("room_") > -1) {
        _roomID = parseInt(room.split("_", 2)[1]);
        console.log("roomID split: ", _roomID);
        //with this we have the room id of the player who just left
      }
      if (room.indexOf("user_") > -1) {
        _userN = room.split("_", 2)[1];
        console.log("userN split: ", _userN);
        //with this we have the user name of the player who just left
      }
    });

    if (gamedata.removeUserInRoom(_roomID, _userN)) {
      socket.to(`room_${_roomID}`).emit("left", { roomID: _roomID });
      let newMessage = {
        from: "",
        message: `${_userN} has left the game`,
        room: _roomID,
      };
      socket.to(`room_${_roomID}`).emit("chat_message", newMessage);
    }
  });

  socket.on("chat_message", (message) => {
    console.log("message: ", message, "socketid: ", socket.id);
    //  socket.to(message.roomid).emit("chat_message", message.message); //only sends to himself
    //  socket.emit("chat_message", message.message);
    let newMessage = {
      from: message.from,
      message: `: ${message.message}`,
      room: message.room,
    };

    if (gamedata.gameExists(message.room)) {
      let guess: string = message.message;
      let secretWord: string | undefined = gamedata!.getSecretWord(
        message.room
      );
      if (secretWord === undefined) {
        return;
      }
      console.log("guess: ", guess.toLowerCase());
      console.log("secretword: ", secretWord.toLowerCase());
      console.log(
        "same?: ",
        guess.toLowerCase().includes(secretWord!.toLowerCase())
      );

      if (guess.toLowerCase().includes(secretWord!.toLowerCase())) {
        //gamedata give score
        gamedata.giveScoreToPlayer(message.room, message.from);
        //guessed right
        let successMessage = {
          from: message.from,
          message: ` has guessed the word right!`,
          room: message.room,
        };
        io.to(`room_${message.room}`).emit("chat_message", successMessage);
        io.to(`room_${message.room}`).emit("update_score", {
          room: successMessage.room,
        });
        io.to(`room_${message.room}`).emit("forbid_guessing", {
          playerName: message.from,
        });
      } else {
        console.log("message to room: ", `room_${message.room}`);
        socket.to(`room_${message.room}`).emit("chat_message", newMessage); //just in case
        socket.rooms.forEach((object) =>
          console.log("rooms message: " + object)
        );
        //socket.emit("chat_message", newMessage);
      }
    }
  });

  socket.on("join", (message) => {
    console.log("player ", socket.id, " joined  the room ", message.id);
    //socket.rooms.add(`${id}`);

    //also join a room that is the user name
    //so later i can check the rooms he is,
    //if it has the room_number you get the room and if it has the user_userName you get the user name
    const nameRoom = `room_${message.id}`;
    console.log(`nameroom: ${nameRoom}`);
    socket.join(nameRoom);
    socket.join(message.userName);

    console.log("joined: " + nameRoom);
    socket.rooms.forEach((object) => console.log("rooms: " + object));
    console.log("end rooms");
    let newMessage = {
      from: "",
      message: "A new player has joined",
      room: message.id,
    };
    socket.to(nameRoom).emit("join", { roomID: message.id });
    socket.to(nameRoom).emit("chat_message", newMessage);
  });

  socket.on("leave", (id) => {
    console.log("Player ", socket.id, " left the game");
    socket.leave(`${id}`);
    socket.rooms.forEach((object) => console.log("rooms leave: " + object));
  });

  //** Drawing */

  socket.on("drawing", (message) => {
    console.log("dasdasdsd: ", message.roomid);
    socket.to(`room_${message.roomid}`).emit("drawing", message);
    socket.rooms.forEach((object) => console.log("rooms drawing: " + object));

    //io.emit("drawing", message);
  });

  socket.on("clear", (message) => {
    console.log("dasdasdsd clear: ", message.roomid);
    socket.to(`room_${message.roomid}`).emit("clear", message);
    //io.emit("clear", message);
  });
});

//enable pre-flight
router.options("*", cors(options));

/** Listen to the server */
httpServer.listen(config.server.port, () =>
  logging.info(
    NAMESPACE,
    `Server running on ${config.server.hostname}:${config.server.port}`
  )
);
