import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import gamedata from '../gamedata';
import GameLogic from '../game-logic';
import IGameUser from '../interfaces/gameUser';

const NAMESPACE = "GAME";

const getRoomUsers = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE,"getting room users");
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
    let userHost: IGameUser = {
      username: req.body.username,
      isRegistered: req.body.isRegistered,
      score: 0,
      totalscore: 0
    }

    const newgame: GameLogic = {
      gameUsers: [userHost], 
      roomName: req.body.roomName,
      roomPassword: req.body.roomPassword,
      id: gamedata.getCurrentGames().length+1, 
      secretWord: ""
    };

    gamedata.addGame(newgame);
  
    logging.info(NAMESPACE,`beginning a game, id: ${newgame.id}, room name: ${newgame.roomName}, room password: ${newgame.roomPassword}, username host: ${req.body.username}, is registered account: ${req.body.isRegistered}`);
};

const getGameData = (req: Request, res: Response, next: NextFunction) => {
  let roomNumber = req.query.room;

  logging.info(NAMESPACE, `Game is ${roomNumber}`);
};

const roomExists = (req: Request, res: Response, next: NextFunction) => {
  let _roomID: any = req.query.id;
  let id: number = +_roomID;
  logging.info(NAMESPACE, `Game is ${id}`);
  return res.status(200).json({
    result: gamedata.gameExists(id)
  });
};

export default { beginGame, getRoomUsers, getGameData, roomExists };