import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";

const NAMESPACE = "Game";

const getRoomUsers = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE,"getting room users");
};

const beginGame = (req: Request, res: Response, next: NextFunction) => {
  /*  POST PARAMETERS
    roomParameters = {
      roomName: "",
      roomPassword: "",
      username: this.username
    }
  */
  logging.info(NAMESPACE,`beginning a game, roomname: ${req.body.roomName}, password: ${req.body.roomPassword}, username host: ${req.body.username}`);
};

const getGameData = (req: Request, res: Response, next: NextFunction) => {
  let roomNumber = req.query.room;

  logging.info(NAMESPACE, `Game is ${roomNumber}`);
};

export default { beginGame, getRoomUsers, getGameData };