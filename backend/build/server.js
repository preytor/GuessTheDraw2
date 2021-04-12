"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var cors = require("cors");
var NAMESPACE = "Server";
var CORS_ORIGIN = "http://localhost:4200";
var router = express_1.default();
/** Create the server */
var httpServer = http_1.default.createServer(router);
/** Create the socket server */
var io = new socket_io_1.Server(httpServer, {
    //ponerle aqui la ip del cliente
    cors: {
        origin: CORS_ORIGIN,
        methods: ["GET", "POST"],
        allowedHeaders: ["gtd-socket"],
        credentials: true,
    },
});
//io.adapter(redis({ host: "localhost", port: 4200 })); // we select the client as this IP
/** Holding the game data */
var newgame = {
    gameUsers: [],
    roomName: "ddd",
    roomPassword: "d",
    id: 1,
    secretWord: "meme",
};
gamedata_1.default.addGame(newgame);
gamedata_1.default.addGame(newgame);
logging_1.default.info("GAME", "Started module to handle the games");
var x = gamedata_1.default.getCurrentGames().entries();
logging_1.default.info("get current games:", gamedata_1.default.getGameAt(0).secretWord); //this works
/** Connect to Mongo */
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then(function (result) {
    logging_1.default.info(NAMESPACE, "Connected to mongoDB!");
})
    .catch(function (error) {
    logging_1.default.error(NAMESPACE, error.message, error);
});
/** Logging the request */
router.use(function (req, res, next) {
    logging_1.default.info(NAMESPACE, "METHOD - [" + req.method + "], URL - [" + req.url + "], IP - [" + req.socket.remoteAddress + "]");
    res.on("finish", function () {
        logging_1.default.info(NAMESPACE, "METHOD - [" + req.method + "], URL - [" + req.url + "], IP - [" + req.socket.remoteAddress + "], STATUS - [" + res.statusCode + "]");
    });
    next();
});
/** Parse the request */
router.use(express_1.default.urlencoded({ extended: false }));
router.use(express_1.default.json());
/** Rules of our API */
var originsWhitelist = ["http://localhost:4200", "http://localhost:80", "*"];
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
router.use(cors(options)); /*router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //delete this after production
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );*/ //(OLD)
/** Rules of our API */ /*  if (req.method == "OPTIONS") {  //if uncomment this it throws a CORS error
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST PUT");
    return res.status(200).json({});
  }*/
/*
  next();
});*/
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
io.on("connection", function (socket) {
    //mandar el socket a la ip del cliente
    console.log("A user connected");
    socket.on("chat_message", function (message) {
        console.log("meesage: ", message);
        socket.to(message.roomid).emit(message); //just in case
        socket.emit(message);
        io.to(message.roomid).emit(message); //just in case
        io.emit(message);
    });
    socket.on("join", function (id) {
        console.log("player joined  the room ", id);
        socket.join(id);
    });
    socket.on("disconnect", function (reason) {
        console.log("A user disconnected");
        console.log(reason); // "ping timeout"
    });
});
//enable pre-flight
router.options("*", cors(options));
/** Listen to the server */
httpServer.listen(config_1.default.server.port, function () {
    return logging_1.default.info(NAMESPACE, "Server running on " + config_1.default.server.hostname + ":" + config_1.default.server.port);
});
