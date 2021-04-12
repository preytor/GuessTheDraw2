"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importDefault(require("../config/logging"));
var gamedata_1 = __importDefault(require("../gamedata"));
var NAMESPACE = "GAME";
var getRoomUsers = function (req, res, next) {
    logging_1.default.info(NAMESPACE, "getting room users");
};
var beginGame = function (req, res, next) {
    /*  POST PARAMETERS
      roomParameters = {
        roomName: "",
        roomPassword: "",
        username: this.username,
        isRegistered: this.authService.isLogged()
      }
    */
    var userHost = {
        username: req.body.username,
        isRegistered: req.body.isRegistered,
        score: 0,
        totalscore: 0,
    };
    var newgame = {
        gameUsers: [userHost],
        roomName: req.body.roomName,
        roomPassword: req.body.roomPassword,
        id: gamedata_1.default.getCurrentGames().length + 1,
        secretWord: "",
    };
    gamedata_1.default.addGame(newgame);
    logging_1.default.info(NAMESPACE, "beginning a game, id: " + newgame.id + ", room name: " + newgame.roomName + ", room password: " + newgame.roomPassword + ", username host: " + req.body.username + ", is registered account: " + req.body.isRegistered);
    return res.status(200).json({
        result: true,
    });
};
var getGameData = function (req, res, next) {
    var roomNumber = req.query.room;
    logging_1.default.info(NAMESPACE, "Game is " + roomNumber);
    //temporally
    return res.status(200).json({
        result: roomNumber,
    });
};
var roomExists = function (req, res, next) {
    var _roomID = req.params.id;
    var id = +_roomID;
    logging_1.default.info(NAMESPACE, "Game is " + id);
    return res.status(200).json({
        result: gamedata_1.default.gameExists(id),
    });
};
exports.default = { beginGame: beginGame, getRoomUsers: getRoomUsers, getGameData: getGameData, roomExists: roomExists };
