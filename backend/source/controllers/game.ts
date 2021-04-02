import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import config from "../config/config";

const NAMESPACE = "Game";

const getRoomUsers = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE,"getting room users");
};

const beginGame = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE,"beginning a game");
};

export default { beginGame, getRoomUsers };