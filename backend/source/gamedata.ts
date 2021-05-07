import GameLogic from "./game-logic";
import { GameData } from "./models/gameData";
import { UserRoom } from "./models/userRoom";
import { GameLobby } from "./models/gameLobby";
import {io} from "./server";

const words: string[] = ["Far","Oil","Cow","Murky","Closed",
"Sheep","Hard","Crab","Tight","Meat","Immense","Tree",
"School","Addition","Division","Sleep","Music","Butter","Corn",
"Animal","Observe","Steam","Fear","Cotton","Lift","Owner",
"Puzzle","Turtle","Fish","Road",
"Windmill","Lamp","Ocean","Beach","Noise","Sunflower","Quiet",
"Thirsty","Fear","Tractor","Happy","Vagabond","Ill","Many",
"Deep","Space","Present","Tall","House","Clean","Tired",
"Plane","Ten","Computer",
"Stone","Wood","Late","Scattered","Sad","Wise","Yellow","Nasty",
"Folder","Girl","Boy","Family","Unknown","Ghost",
"Flower","Smell","Point","Duck","Drunk","Barbarian",
"Rainy","Aboard","Ship","Bed","Hell", "Snow",
"Mountain","River","Earthquake","Book","Toilet",
"Run","Door","Key","Trash","Console","Water","Moon",
"Drunk","Rain","Acid","Toxic",
"Car","Dog","Cat","Pencil","Paper","Helicopter",
"Guitar","Gym","Ice Cream","Beautiful","Tourist",
"Handsome","Army","Heavy","Thought","Old","Absent",
"Ugly","Quick","Worried","Sun",
"Cloudy","Hungry","Cold","Church","Zealous","Hospital"];

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

const getSecretWord = (id: number): string => {
  return (gameExists(id)) ? getGameFromID(id)!.secretWord : "";
}

const beginGame = (id: number, timerSeconds: any, gameRound: any) => {
  
  console.log(`begingame in game ${id} is working - BEFORE`)
  if(!gameExists(id)) return;
  if(getGameFromID(id)?.hasFinished == true) return;

  //reset timers
//  let lowerTimerVar: any;
//  clearTimeout(lowerTimerVar); 
  if(timerSeconds!=null){
    clearInterval(timerSeconds);
  }
  if(gameRound!=null){
    clearTimeout(gameRound); 
  }
  
  //calculate the score math of all the players in the room 
  //and set the current score to 0
  restartScores(id);
  //set timer to 60
  getGameFromID(id)!.timer = 60;

  //console.log("listeners and shit",io.sockets.adapter.rooms)
  //io.sockets.emit("clear", {roomid: 1});  //works
  //let players = io.sockets.adapter.rooms.get(`room_${id}`);
  //console.log("players in listener and shit: ", players);
  console.log(`begingame in game ${id} is working - AFTER`)
  //io.to(`room_${id}`).emit("host_change", {roomid: id});//works, below is 1 for testing
  //io.to(`room_1`).emit("host_change", {roomid: id});

  //TODO PENDING, ERROR: TypeError: Cannot read property 'gameUsers' of undefined
  let gameData = getGameFromID(id);
  const _seconds = 60000; //60 seconds
  setPlayerHost(id); //send a socket to this player and he can draw (the rest can't)
  let secretWord = generateSecretWord();
  let viewWord = "";
  for(let i = 0; i<secretWord.length; i++){
    viewWord+="_";
  }

  gameData!.secretWord! = secretWord;
  gameData!.displaySecretWord! = viewWord;

  //send the clients except the host the word but as _ in an array (array["_", "_", "_"]) etc...
  
  console.log("blabla ", getGameFromID(id))
  //update timer every second
  let _timerSeconds = setInterval(() => {
    getGameFromID(id)!.timer -=1;
    console.log("timer: "+getGameFromID(id)!.timer)
  }, 1000);

  //discover word at 30 seconds
  setTimeout(() => { discoverLetterInRoom(id) }, 30000);
  //discover word at 50 seconds
  setTimeout(() => { discoverLetterInRoom(id) }, 50000);
  //do an "if (!hasFinished) {"
  let _gameRound = setTimeout(() => { beginGame(id, _timerSeconds, _gameRound); }, _seconds);
}

const discoverLetterInRoom = (id: number) => {
  if(!gameExists(id)) return;
  if(getGameFromID(id)?.hasFinished == true) return;

  let gameSecretWord = getGameFromID(id)!.secretWord;

  let replaced = false;
  do{
    let randomLetter = randomIntFromInterval(0, gameSecretWord!.length-1);

    if(getGameFromID(id)!.displaySecretWord.charAt(randomLetter)=="_"){
      let secret = getGameFromID(id)!.secretWord;
      let display = getGameFromID(id)!.displaySecretWord;

      let newDisplay = setCharAt(display, randomLetter, secret.charAt(randomLetter));
      getGameFromID(id)!.displaySecretWord = newDisplay;
      replaced = true;
      console.log("new display in room "+id+" is: ",getGameFromID(id)!.displaySecretWord)
      io.to(`room_${id}`).emit("show_hint", {roomid: id});
    }
  }while(!replaced);
}

const setPlayerHost = (id: number) => {
  let players = getGameFromID(id)!.gameUsers;
  let foundHost = false;
  if(players.length>0){
    for(let i = 0; i<players.length; i++){
      console.log("player at i: "+i+" ",players![i])
      if(players[i]!=undefined){
        if(players![i].hasBeenHost==false){
          //currentGames[id].gameUsers[i].hasBeenHost=true;
          players[i].hasBeenHost=true;
          foundHost = true;
          
          //TODO: make the player the host 
          io.to(`room_${id}`).emit("host_change", {roomid: id, newHost: players[i]!.username});
          getGameFromID(id)!.hostName=players[i]!.username;
          break;
        }else{

        }
      }
    }

    if(!foundHost){
      let _newHost;

      for(let i = 0; i<players!.length; i++){
        if(getGameFromID(id)!.gameUsers===undefined) continue;

        if(i>0){
          getGameFromID(id)!.gameUsers[i]!.hasBeenHost=false;
        }else{
          //TODO: make the player the host 
          _newHost = players[i]!.username;
          getGameFromID(id)!.hostName=_newHost;
        }
      }
      io.to(`room_${id}`).emit("host_change", {roomid: id, newHost: _newHost});
    }
    io.to(`room_${id}`).emit("show_hint", {roomid: id});
    io.to(`room_${id}`).emit("clear", {roomid: id});
  }

}

const generateSecretWord = () => {
  ///
  let randomN = randomIntFromInterval(0, words.length);
  let word = words[randomN];
  return `${word}`;
}


//utils
function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setCharAt(str: string,index: number,chr: string) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

const playerCanDraw = (id: number, userName: string): boolean => {

  if(!gameExists(id)){ return false; }

  let canDraw = (getGameFromID(id)!.hostName===userName) ? true : false;

  return canDraw;
};

const giveScoreToPlayer = (id: number, userName: string) => {
  if(!gameExists(id)){ return }
  if(!userExistsInRoom(id, userName)){ return }

  let timeLeft = getGameFromID(id)!.timer;

  if(userExistsInRoom(id, userName)){
    for(let i = 0; i < getGameFromID(id)?.gameUsers.length!; i++){
      if(getGameFromID(id)?.gameUsers[i].username == userName){
        getGameFromID(id)!.gameUsers[i]!.score += timeLeft;
        break;
      }
    }
  }
}

const restartScores = (id: number) => {
  if(!gameExists(id)){ return }

  for(let i = 0; i < getGameFromID(id)?.gameUsers.length!; i++){
    if(getGameFromID(id)!.gameUsers[i]!=undefined){
        getGameFromID(id)!.gameUsers[i]!.totalScore += getGameFromID(id)!.gameUsers[i]!.score;
        getGameFromID(id)!.gameUsers[i]!.score = 0;
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
  getDisplaySecretWord,
  getSecretWord,
  playerCanDraw,
  giveScoreToPlayer,
  restartScores
};
