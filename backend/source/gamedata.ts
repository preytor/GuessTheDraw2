import GameLogic from "./game-logic";
import logging from "./config/logging";
import { GameData } from "./models/gameData";
import { UserRoom } from "./models/userRoom";
import { GameLobby } from "./models/gameLobby";

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
//  logging.info("GAME_EXISTS", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
//  logging.info("GAME_EXISTS", `Game exists?: ${currentGames.some((x) => x.id === id)}`)
  return currentGames.some((x) => x.id === id);
};

const getRoomUsers = (id: number): Array<UserRoom> => {
  return getGameFromID(id)?.gameUsers!;
};

const userExistsInRoom = (id: number, userName: string): boolean => {

  let users = getGameFromID(id)?.gameUsers;
  let exists = false;

  if(users!.length==0){ return false; }

  console.log("enters in length")
  for (var i = 0, iLen = users!.length; i < iLen; i++) {
    console.log(users![i].username, "  -  ", userName)
    if (users![i].username == userName) {
      exists = true;
      break;
    }
  }
  return exists;
};

const addUserInRoom = (id: number, user: UserRoom): boolean => {
  if(!userExistsInRoom(id, user.username)){
    getGameFromID(id)?.gameUsers.push(user);
    return true;
  }
  return false;
};

const removeUserInRoom = (id: number, userName: string): boolean => {
  if(!userExistsInRoom(id, userName)){
    for(let i = 0; i < getGameFromID(id)?.gameUsers.length!; i++){
      if(getGameFromID(id)?.gameUsers[i].username == userName){
        getGameFromID(id)?.gameUsers.splice(i, 1);
        break;
      }
    }
    return true;
  }
  return false;
};

const getGameLobbies = (index: number, offset: number): GameLobby[] => {
  let games = getCurrentGames();
  let lobbies: GameLobby[] = [];

  for(let i = index; i < offset || games.length-1; i++){
    if(games[i] === undefined) break;

    let game: GameLobby = {
      name: games[i].roomName,
      hasPassword: (games[i].roomPassword.length==0) ? false : true,
      numPlayers: games[i].gameUsers.length,
      id: games[i].id
    }

    lobbies.push(game);
  }

  return lobbies;
};

const beginGame = (id: number) => {
  //TODO PENDING
  getGameFromID(id)
}

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
  removeUserInRoom,
  getGameLobbies,
};
