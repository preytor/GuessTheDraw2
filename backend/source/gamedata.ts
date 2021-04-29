import GameLogic from "./game-logic";
import logging from "./config/logging";
import { GameData } from "./models/gameData";
import { UserRoom } from "./models/userRoom";

var currentGames: Array<GameData> = [];

const getCurrentGames = (): Array<GameData> => {
  return currentGames;
};

const getGameAt = (index: number): GameData => {
  return currentGames[index];
};

const getGameFromID = (id: number): GameData | undefined => {
  return currentGames.find((x) => x.id === id);
};

const addGame = (newgame: GameData): boolean => {
  if(!gameExists(newgame.id)){
    getCurrentGames().push(newgame);
    console.log(currentGames.length);
    return true;
  }
  return false;
};

const removeGame = (gameToRemove: GameLogic): void => {
  for (var i = 0, iLen = getCurrentGames().length; i < iLen; i++) {
    if (getCurrentGames()[i].id == gameToRemove.id) {
      getCurrentGames().splice(i, 1);
      break;
    }
  }
};

const gameExists = (id: number): boolean => {
  logging.info("GAME_EXISTS", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
  logging.info("GAME_EXISTS", `Game exists?: ${currentGames.some((x) => x.id === id)}`)
  return currentGames.some((x) => x.id === id);
};

const getRoomUsers = (id: number): Array<UserRoom> => {
  return getGameFromID(id)?.gameUsers!;
};

const userExistsInRoom = (id: number, user: UserRoom): boolean => {
  console.log("get game from id: ", getGameFromID(id))
  let users = getGameFromID(id)?.gameUsers;
  console.log(users)
  let exists = false;
  if(users!.length>0){
    console.log("enters in length")
    for (var i = 0, iLen = users!.length; i < iLen; i++) {
      console.log(users![i].username, "  -  ", user.username)
      if (users![i].username == user.username) {
        exists = true;
        break;
      }
    }
  }
  return exists;
};

const addUserInRoom = (id: number, user: UserRoom): boolean => {
  console.log("user exists in rooom: ",userExistsInRoom(id, user));
  if(!userExistsInRoom(id, user)){
    getGameFromID(id)?.gameUsers.push(user);
    return true;
  }
  return false;
};

/*
function getCurrentGames(): Array<GameLogic>{
    return currentGames;
}

function getGameFromID(id: any): GameLogic | undefined{
    for (var i=0, iLen=getCurrentGames().length; i<iLen; i++) {
        if (getCurrentGames()[i].id == id) return getCurrentGames()[i];
    }
}

function addGame(newgame: GameLogic): void{
    getCurrentGames().push(newgame);
}

function removeGame(gameToRemove: GameLogic): void{
    for (var i=0, iLen=getCurrentGames().length; i<iLen; i++) {
        if (getCurrentGames()[i].id == gameToRemove.id){
            getCurrentGames().splice(i, 1);
            break;
        }
    }
}*/

export default {
  getCurrentGames,
  getGameAt,
  getGameFromID,
  addGame,
  removeGame,
  gameExists,
  getRoomUsers,
  userExistsInRoom,
  addUserInRoom,
};
