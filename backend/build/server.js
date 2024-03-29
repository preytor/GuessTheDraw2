"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
var mongoose_1 = __importDefault(require("mongoose"));
var sample_1 = __importDefault(require("./routes/sample"));
var user_1 = __importDefault(require("./routes/user"));
var game_1 = __importDefault(require("./routes/game"));
var gamedata_1 = __importDefault(require("./gamedata"));
var chat_1 = __importDefault(require("./controllers/chat"));
var socket_io_1 = require("socket.io");
var initDBData_1 = __importDefault(require("./config/initDBData"));
//import { createAdapter } from 'socket.io-redis';
//import { RedisClient } from 'redis';
var cors = require("cors");
var NAMESPACE = "Server";
var CORS_ORIGIN = [
    config_1.default.server.host_origin,
    //pending to test add here and/or
    //in the angular app the docker ip
    "185.237.99.127:4200",
    "185.237.99.127:81",
    "185.237.99.127:80",   
    "185.237.99.127:81",
    "http://frontend:4200",
    "http://frontend:80",
    "http://frontend:81",
    "frontend:4200",
    "frontend:80",
    "frontend:81",
    "localhost:4200",
    "localhost:80",
    "localhost:81",
]; //add here the other ip
var router = (0, express_1.default)();
/** Create the server */
var httpServer = http_1.default.createServer(router);
/** Create the socket server */
exports.io = new socket_io_1.Server(httpServer, {
    //httpServer instead of 4200
    //ponerle aqui la ip del cliente
    cors: {
        origin: "*",
        //origin: CORS_ORIGIN,
        //methods: ["GET", "POST"],
        /*    allowedHeaders: ["gtd-socket"],
        credentials: false,*/
    },
});
//const pubClient = new RedisClient({ host: 'localhost', port: 4200 });
//const subClient = pubClient.duplicate();
//io.adapter(createAdapter({ pubClient, subClient }));
//test for docker env variables
/*
- MONGO_USERNAME=myUserAdmin
- MONGO_PASSWORD=abc123
- MONGO_HOST=database
- SERVER_HOSTNAME=backend
- HOST_ORIGIN=http://frontend:80
*/
console.log("MONGO_USERNAME: ", process.env.MONGO_USERNAME);
console.log("MONGO_PASSWORD: ", process.env.MONGO_PASSWORD);
console.log("MONGO_URL: ", process.env.MONGO_URL);
console.log("SERVER_HOSTNAME: ", process.env.SERVER_HOSTNAME);
console.log("HOST_ORIGIN: ", process.env.HOST_ORIGIN);
console.log(CORS_ORIGIN);
/** Holding the game data */
var newgame = {
    gameUsers: [],
    roomName: "Sala de prueba con contraseña",
    roomPassword: "d",
    id: 1,
    secretWord: "test",
    displaySecretWord: "____",
    hasFinished: false,
    hostName: "",
    timer: 60,
};
var newgame2 = {
    gameUsers: [],
    roomName: "Sala de prueba sin contraseña",
    roomPassword: "",
    id: 2,
    secretWord: "as",
    displaySecretWord: "__",
    hasFinished: false,
    hostName: "",
    timer: 60,
};
//gamedata.addGame(newgame);
//gamedata.addGame(newgame2);
logging_1.default.info("GAME", "Started module to handle the games");
var x = gamedata_1.default.getCurrentGames().entries();
//logging.info("get current games:", gamedata.getGameAt(0).secretWord); //this works
/** Connect to Mongo */
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then(function (result) {
    logging_1.default.info(NAMESPACE, "Connected to mongoDB!");
    initDBData_1.default.initDBData();
})
    .catch(function (error) {
    logging_1.default.error(NAMESPACE, error.message, error);
});
router.use(cors());
/** Logging the request */
router.use(function (req, res, next) {
    logging_1.default.info(NAMESPACE, "METHOD - [".concat(req.method, "], URL - [").concat(req.url, "], IP - [").concat(req.socket.remoteAddress, "]"));
    res.on("finish", function () {
        logging_1.default.info(NAMESPACE, "METHOD - [".concat(req.method, "], URL - [").concat(req.url, "], IP - [").concat(req.socket.remoteAddress, "], STATUS - [").concat(res.statusCode, "]"));
    });
    /*
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }*/
    next();
});
/** Parse the request */
router.use(express_1.default.urlencoded({ extended: false }));
router.use(express_1.default.json());
/** Rules of our API */
var originsWhitelist = [
    config_1.default.server.host_origin,
    "http://frontend:4200",
    "http://frontend:80",
    "http://frontend:81",
    "http://localhost:4200",
    "http://localhost:80",
    "http://localhost:81",
    "*",
];
var options = {
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
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    preflightContinue: false,
};
//use cors middleware
//router.use(cors(options));
/** Routes */
router.use("/sample", sample_1.default);
router.use(user_1.default);
router.use(game_1.default);
/** Error Handling */
router.use(function (req, res, next) {
    var error = new Error("not found");
    return res.status(404).json({
        message: error.message,
    });
});
/** Chat */
router.use(chat_1.default); //doesnt really work
exports.io.on("connection", function (socket) {
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
        var rooms = socket.rooms;
        var _roomID = -1;
        var _userN = "";
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
        if (gamedata_1.default.removeUserInRoom(_roomID, _userN)) {
            socket.to("room_".concat(_roomID)).emit("left", { roomID: _roomID });
            var newMessage = {
                from: "",
                message: "".concat(_userN, " has left the game"),
                room: _roomID,
            };
            socket.to("room_".concat(_roomID)).emit("chat_message", newMessage);
            console.log("Removing room ", _roomID, " since it has no more users");
            if (gamedata_1.default.getRoomUsers(_roomID).length == 0 ||
                gamedata_1.default.getRoomUsers(_roomID).length == -1) {
                gamedata_1.default.removeGameById(_roomID);
            }
        }
    });
    socket.on("chat_message", function (message) {
        console.log("message: ", message, "socketid: ", socket.id);
        //  socket.to(message.roomid).emit("chat_message", message.message); //only sends to himself
        //  socket.emit("chat_message", message.message);
        var newMessage = {
            from: message.from,
            message: ": ".concat(message.message),
            room: message.room,
        };
        if (gamedata_1.default.gameExists(message.room)) {
            var guess = message.message;
            var secretWord = gamedata_1.default.getSecretWord(message.room);
            if (secretWord === undefined) {
                return;
            }
            console.log("guess: ", guess.toLowerCase());
            console.log("secretword: ", secretWord.toLowerCase());
            console.log("same?: ", guess.toLowerCase().includes(secretWord.toLowerCase()));
            if (guess.toLowerCase().includes(secretWord.toLowerCase())) {
                //gamedata give score
                gamedata_1.default.giveScoreToPlayer(message.room, message.from);
                //guessed right
                var successMessage = {
                    from: message.from,
                    message: " has guessed the word right!",
                    room: message.room,
                };
                exports.io.to("room_".concat(message.room)).emit("chat_message", successMessage);
                exports.io.to("room_".concat(message.room)).emit("update_score", {
                    room: successMessage.room,
                });
                exports.io.to("room_".concat(message.room)).emit("forbid_guessing", {
                    playerName: message.from,
                });
            }
            else {
                console.log("message to room: ", "room_".concat(message.room));
                socket.to("room_".concat(message.room)).emit("chat_message", newMessage); //just in case
                socket.rooms.forEach(function (object) {
                    return console.log("rooms message: " + object);
                });
                //socket.emit("chat_message", newMessage);
            }
        }
    });
    socket.on("join", function (message) {
        console.log("player ", socket.id, " joined  the room ", message.id);
        //socket.rooms.add(`${id}`);
        //also join a room that is the user name
        //so later i can check the rooms he is,
        //if it has the room_number you get the room and if it has the user_userName you get the user name
        var nameRoom = "room_".concat(message.id);
        console.log("nameroom: ".concat(nameRoom));
        socket.join(nameRoom);
        socket.join(message.userName);
        console.log("joined: " + nameRoom);
        socket.rooms.forEach(function (object) { return console.log("rooms: " + object); });
        console.log("end rooms");
        var newMessage = {
            from: "",
            message: "A new player has joined",
            room: message.id,
        };
        socket.to(nameRoom).emit("join", { roomID: message.id });
        socket.to(nameRoom).emit("chat_message", newMessage);
    });
    socket.on("leave", function (id) {
        console.log("Player ", socket.id, " left the game");
        socket.leave("".concat(id));
        socket.rooms.forEach(function (object) { return console.log("rooms leave: " + object); });
    });
    //** Drawing */
    socket.on("drawing", function (message) {
        console.log("dasdasdsd: ", message.roomid);
        socket.to("room_".concat(message.roomid)).emit("drawing", message);
        socket.rooms.forEach(function (object) { return console.log("rooms drawing: " + object); });
        //io.emit("drawing", message);
    });
    socket.on("clear", function (message) {
        console.log("dasdasdsd clear: ", message.roomid);
        socket.to("room_".concat(message.roomid)).emit("clear", message);
        //io.emit("clear", message);
    });
});
//enable pre-flight
//router.options("*", cors(options));
/** Listen to the server */
httpServer.listen(config_1.default.server.port, function () {
    return logging_1.default.info(NAMESPACE, "Server running on ".concat(config_1.default.server.hostname, ":").concat(config_1.default.server.port));
});
