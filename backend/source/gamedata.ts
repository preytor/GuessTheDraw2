import GameLogic from "./game-logic";
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

  console.log("user exists in room id: ",id)
  if(!gameExists(id)){ return false; }

  let users = getGameFromID(id)?.gameUsers;
  let exists = false;

  if(users!.length<=0){ return false; }
  if(userName===""){ return false; }

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
  if(userExistsInRoom(id, userName)){
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

const getDisplaySecretWord = (id: number) => {
  return (gameExists(id)) ? getGameFromID(id)?.displaySecretWord : "";
}

const beginGame = (id: number) => {

  console.log(`begingame in game ${id} is working`)

  //TODO PENDING
  let gameData = getGameFromID(id);
  const _seconds = 60000; //60 seconds
  const host = setPlayerHost(id) //send a socket to this player and he can draw (the rest can't)
//  const secretWord = getSecretWord()

  //send the clients except the host the word but as _ in an array (array["_", "_", "_"]) etc...
  
  //discover word at 30 seconds
  setTimeout(() => { discoverLetterInRoom(id) }, 30000);
  //discover word at 50 seconds
  setTimeout(() => { discoverLetterInRoom(id) }, 50000);
  //do an "if (!hasFinished) {"
  if(!gameExists(id)) return;
  if(getGameFromID(id)?.hasFinished == true) return;
  setTimeout(() => { beginGame(id) }, _seconds);
}

const discoverLetterInRoom = (id: number) => {

}

const setPlayerHost = (id: number) => {
  let players = getGameFromID(id)?.gameUsers;
  let foundHost = false;
  if(players!.length>0){
    for(let i = 0; i<players!.length; i++){
      if(players![i].hasBeenHost==false){
        currentGames[id].gameUsers[i].hasBeenHost=true;
        foundHost = true;
        //TODO: make the player the host 
        break;
      }
    }

    if(!foundHost){
      for(let i = 0; i<players!.length; i++){
        if(i>0){
          currentGames[id].gameUsers[i].hasBeenHost=false;
        }else{
          //TODO: make the player the host 
        }
      }
    }
  }

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
  beginGame,
  getDisplaySecretWord
};
