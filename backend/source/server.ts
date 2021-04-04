import http from "http";
import express from "express";
import logging from "./config/logging";
import config from "./config/config";
import mongoose from "mongoose";
import sampleRoutes from "./routes/sample";
import userRoutes from "./routes/user";
import gameRoutes from "./routes/game";
import gamedata from './gamedata';
import GameLogic from "./game-logic";

const NAMESPACE = "Server";
const router = express();

/** Holding the game data */

const newgame: GameLogic = {
  gameUsers: [], 
  id: 1, 
  secretWord: "meme"
};

gamedata.addGame(newgame);

logging.info(
  "GAME",
  `Started module to handle the games`
)

var x: any = gamedata.getCurrentGames().entries();  //also gives an undefined if i do a .length


  logging.info("get current games:" , x[0]);  //gives an undefined


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
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //delete this after production
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

/*  if (req.method == "OPTIONS") {  //if uncomment this it throws a CORS error
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST PUT");
    return res.status(200).json({});
  }*/

  next();
});

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

/** Create the server */
const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () =>
  logging.info(
    NAMESPACE,
    `Server running on ${config.server.hostname}:${config.server.port}`
  )
);
