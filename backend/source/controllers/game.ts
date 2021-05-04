import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import gamedata from "../gamedata";
import { GameData } from "../models/gameData";
import { UserRoom } from "../models/userRoom";

const NAMESPACE = "GAME";

const getRoomUsers = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "getting room users");
  let roomNumber: any = req.body.roomID;
  let id: number = parseInt(roomNumber);
  
  return res.status(200).json(
    gamedata.getRoomUsers(id)
  );
};

const beginGame = (req: Request, res: Response, next: NextFunction) => {
  /*  POST PARAMETERS
    roomParameters = {
      roomName: "",
      roomPassword: "",
      username: this.username,
      isRegistered: this.authService.isLogged()
    }
  */
  let userHost: UserRoom = {
    username: req.body.username,
    isRegistered: req.body.isRegistered,
    score: 0,
    totalScore: 0,
  };

  let _id = gamedata.getCurrentGames().length + 1;

  const newgame: GameData = {
    gameUsers: [userHost],
    roomName: req.body.roomName,
    roomPassword: req.body.roomPassword,
    id: _id,
    secretWord: "",
  };

  gamedata.addGame(newgame);

  logging.info(
    NAMESPACE,
    `beginning a game, id: ${newgame.id}, room name: ${newgame.roomName}, room password: ${newgame.roomPassword}, username host: ${req.body.username}, is registered account: ${req.body.isRegistered}`
  );
  return res.status(200).json({
    result: true,
    id: _id
  });
};

const getGameData = (req: Request, res: Response, next: NextFunction) => {
  let roomNumber: any = req.query.room;
  let id: number = parseInt(roomNumber);
  logging.info(NAMESPACE, `Game is ${roomNumber}`);


  //temporally
  return res.status(200).json(
    gamedata.getGameFromID(id)
  );
};


const roomExists = (req: Request, res: Response, next: NextFunction) => {
  let _roomID: any = req.params.id;
  let id: number = +_roomID;
  logging.info(NAMESPACE, `Game is ${id}`);
  
  let exists = gamedata.gameExists(id);
  
  return res.status(200).json(
    exists
  );
};

const roomHasPassword = (req: Request, res: Response, next: NextFunction) => {
  let _roomID: any = req.params.id;
  let id: number = +_roomID;
  
  let exists = gamedata.getGameFromID(id);
  let hasPassword = exists?.roomPassword!=="";

  return res.status(200).json(
    hasPassword
  );
};

const addUserToRoom = (req: Request, res: Response, next: NextFunction) => {
  let _roomID: any = req.body.roomID;
  let id: number = parseInt(_roomID);

  let _user: any = req.body.user;
  let user: UserRoom = _user;

  return res.status(200).json(
    gamedata.addUserInRoom(id, user)
  );
};

const removeUserFromRoom = (req: Request, res: Response, next: NextFunction) => {
  let _roomID: any = req.body.roomID;
  let id: number = parseInt(_roomID);

  let _user: any = req.body.user;
  let userName: string = _user;
  console.log("BALBALABLA REMOVING USER FROM ROOM ", id, userName)
  return res.status(200).json(
    gamedata.removeUserInRoom(id, userName)
  );
};

const getGameLobbies = (req: Request, res: Response, next: NextFunction) => {
  let _index: any = req.params.index;
  let index: number = parseInt(_index);

  let _offset: any = req.params.offset;
  let offset: number = _offset;
  
  return res.status(200).json(
    gamedata.getGameLobbies(index, offset)
  );
};



export default { beginGame, getRoomUsers, getGameData, roomExists, roomHasPassword, addUserToRoom, removeUserFromRoom, getGameLobbies };
