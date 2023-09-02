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
    var roomNumber = req.body.roomID;
    var id = parseInt(roomNumber);
    return res.status(200).json(gamedata_1.default.getRoomUsers(id));
};
var beginGame = function (req, res, next) {
    //we dont care about this for now
    //because it would have an empty player in it
    /*  let userHost: UserRoom = {
      username: req.body.username,
      isRegistered: req.body.isRegistered,
      score: 0,
      totalScore: 0,
      hasBeenHost: false
    };*/
    var _id = gamedata_1.default.getCurrentGames().length + 1;
    var newgame = {
        gameUsers: [],
        roomName: req.body.roomName,
        roomPassword: req.body.roomPassword,
        id: _id,
        secretWord: "",
        displaySecretWord: "",
        hasFinished: false,
        hostName: "",
        timer: 60,
    };
    gamedata_1.default.addGame(newgame);
    console.log("begignning asdas das ", _id);
    gamedata_1.default.beginGame(_id, null, null);
    logging_1.default.info(NAMESPACE, "beginning a game, id: ".concat(newgame.id, ", room name: ").concat(newgame.roomName, ", room password: ").concat(newgame.roomPassword, ", username host: ").concat(req.body.username, ", is registered account: ").concat(req.body.isRegistered));
    return res.status(200).json({
        result: true,
        id: _id,
    });
};
var getGameData = function (req, res, next) {
    var roomNumber = req.query.room;
    var id = parseInt(roomNumber);
    logging_1.default.info(NAMESPACE, "Game is ".concat(roomNumber));
    //temporally
    return res.status(200).json(gamedata_1.default.getGameFromID(id));
};
var roomExists = function (req, res, next) {
    var _roomID = req.params.id;
    var id = +_roomID;
    logging_1.default.info(NAMESPACE, "Game is ".concat(id));
    var exists = gamedata_1.default.gameExists(id);
    return res.status(200).json(exists);
};
var roomHasPassword = function (req, res, next) {
    var _roomID = req.params.id;
    var id = +_roomID;
    var exists = gamedata_1.default.getGameFromID(id);
    var hasPassword = (exists === null || exists === void 0 ? void 0 : exists.roomPassword) !== "";
    return res.status(200).json(hasPassword);
};
var addUserToRoom = function (req, res, next) {
    var _roomID = req.body.roomID;
    var id = parseInt(_roomID);
    var _user = req.body.user;
    var user = _user;
    return res.status(200).json(gamedata_1.default.addUserInRoom(id, user));
};
var removeUserFromRoom = function (req, res, next) {
    var _roomID = req.body.roomID;
    var id = parseInt(_roomID);
    var _user = req.body.user;
    var userName = _user;
    console.log("BALBALABLA REMOVING USER FROM ROOM ", id, userName);
    return res.status(200).json(gamedata_1.default.removeUserInRoom(id, userName));
};
var getGameLobbies = function (req, res, next) {
    var _index = req.params.index;
    var index = parseInt(_index);
    var _offset = req.params.offset;
    var offset = _offset;
    return res.status(200).json(gamedata_1.default.getGameLobbies(index, offset));
};
var getDisplaySecretWord = function (req, res, next) {
    var _roomID = req.body.roomID;
    var id = parseInt(_roomID);
    return res
        .status(200)
        .json({ displayWord: gamedata_1.default.getDisplaySecretWord(id) });
};
var getSecretWord = function (req, res, next) {
    var _roomID = req.body.roomID;
    var id = parseInt(_roomID);
    return res.status(200).json({ secretWord: gamedata_1.default.getSecretWord(id) });
};
var getuserCanDraw = function (req, res, next) {
    var _roomID = req.body.id;
    var id = parseInt(_roomID);
    var _user = req.body.userName;
    var userName = _user;
    return res.status(200).json(gamedata_1.default.playerCanDraw(id, userName));
};
var isRightPassword = function (req, res, next) {
    var _roomID = req.body.id;
    var id = parseInt(_roomID);
    var _password = req.body.password;
    var password = _password;
    return res.status(200).json(gamedata_1.default.isTheRightPassword(id, password));
};
exports.default = {
    beginGame: beginGame,
    getRoomUsers: getRoomUsers,
    getGameData: getGameData,
    roomExists: roomExists,
    roomHasPassword: roomHasPassword,
    addUserToRoom: addUserToRoom,
    removeUserFromRoom: removeUserFromRoom,
    getGameLobbies: getGameLobbies,
    getDisplaySecretWord: getDisplaySecretWord,
    getSecretWord: getSecretWord,
    getuserCanDraw: getuserCanDraw,
    isRightPassword: isRightPassword,
};
