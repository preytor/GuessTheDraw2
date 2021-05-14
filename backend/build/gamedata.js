"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var words = ["Far", "Oil", "Cow", "Murky", "Closed",
    "Sheep", "Hard", "Crab", "Tight", "Meat", "Immense", "Tree",
    "School", "Addition", "Division", "Sleep", "Music", "Butter", "Corn",
    "Animal", "Observe", "Steam", "Fear", "Cotton", "Lift", "Owner",
    "Puzzle", "Turtle", "Fish", "Road",
    "Windmill", "Lamp", "Ocean", "Beach", "Noise", "Sunflower", "Quiet",
    "Thirsty", "Fear", "Tractor", "Happy", "Vagabond", "Ill", "Many",
    "Deep", "Space", "Present", "Tall", "House", "Clean", "Tired",
    "Plane", "Ten", "Computer",
    "Stone", "Wood", "Late", "Scattered", "Sad", "Wise", "Yellow", "Nasty",
    "Folder", "Girl", "Boy", "Family", "Unknown", "Ghost",
    "Flower", "Smell", "Point", "Duck", "Drunk", "Barbarian",
    "Rainy", "Aboard", "Ship", "Bed", "Hell", "Snow",
    "Mountain", "River", "Earthquake", "Book", "Toilet",
    "Run", "Door", "Key", "Trash", "Console", "Water", "Moon",
    "Drunk", "Rain", "Acid", "Toxic",
    "Car", "Dog", "Cat", "Pencil", "Paper", "Helicopter",
    "Guitar", "Gym", "Ice Cream", "Beautiful", "Tourist",
    "Handsome", "Army", "Heavy", "Thought", "Old", "Absent",
    "Ugly", "Quick", "Worried", "Sun",
    "Cloudy", "Hungry", "Cold", "Church", "Zealous", "Hospital"];
var currentGames = [];
var getCurrentGames = function () {
    return currentGames;
};
var getGameAt = function (index) {
    return currentGames[index];
};
var getGameFromID = function (id) {
    return currentGames.find(function (x) { return x.id === id; });
};
var addGame = function (newgame) {
    if (!gameExists(newgame.id)) {
        getCurrentGames().push(newgame);
        console.log(currentGames.length);
        return true;
    }
    return false;
};
var removeGame = function (gameToRemove) {
    for (var i = 0, iLen = getCurrentGames().length; i < iLen; i++) {
        if (getCurrentGames()[i].id == gameToRemove.id) {
            getCurrentGames().splice(i, 1);
            break;
        }
    }
};
var gameExists = function (id) {
    //  logging.info("GAME_EXISTS", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    //  logging.info("GAME_EXISTS", `Game exists?: ${currentGames.some((x) => x.id === id)}`)
    return currentGames.some(function (x) { return x.id === id; });
};
var getRoomUsers = function (id) {
    var _a;
    return (_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.gameUsers;
};
var userExistsInRoom = function (id, userName) {
    var _a;
    console.log("user exists in room id: ", id);
    if (!gameExists(id)) {
        return false;
    }
    var users = (_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.gameUsers;
    var exists = false;
    if (users.length <= 0) {
        return false;
    }
    if (userName === "") {
        return false;
    }
    console.log("enters in length");
    for (var i = 0, iLen = users.length; i < iLen; i++) {
        console.log(users[i].username, "  -  ", userName);
        if (users[i].username == userName) {
            exists = true;
            break;
        }
    }
    return exists;
};
var addUserInRoom = function (id, user) {
    var _a;
    if (!userExistsInRoom(id, user.username)) {
        (_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.gameUsers.push(user);
        return true;
    }
    return false;
};
var removeUserInRoom = function (id, userName) {
    var _a, _b, _c;
    if (userExistsInRoom(id, userName)) {
        for (var i = 0; i < ((_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.gameUsers.length); i++) {
            if (((_b = getGameFromID(id)) === null || _b === void 0 ? void 0 : _b.gameUsers[i].username) == userName) {
                (_c = getGameFromID(id)) === null || _c === void 0 ? void 0 : _c.gameUsers.splice(i, 1);
                break;
            }
        }
        return true;
    }
    return false;
};
var getGameLobbies = function (index, offset) {
    var games = getCurrentGames();
    var lobbies = [];
    for (var i = index; i < offset || games.length - 1; i++) {
        if (games[i] === undefined)
            break;
        var game = {
            name: games[i].roomName,
            hasPassword: (games[i].roomPassword.length == 0) ? false : true,
            numPlayers: games[i].gameUsers.length,
            id: games[i].id
        };
        lobbies.push(game);
    }
    return lobbies;
};
var getDisplaySecretWord = function (id) {
    var _a;
    return (gameExists(id)) ? (_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.displaySecretWord : "";
};
var getSecretWord = function (id) {
    return (gameExists(id)) ? getGameFromID(id).secretWord : "";
};
var beginGame = function (id, timerSeconds, gameRound) {
    var _a;
    console.log("begingame in game " + id + " is working - BEFORE");
    if (!gameExists(id))
        return;
    if (((_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.hasFinished) == true)
        return;
    //reset timers
    //  let lowerTimerVar: any;
    //  clearTimeout(lowerTimerVar); 
    if (timerSeconds != null) {
        clearInterval(timerSeconds);
    }
    if (gameRound != null) {
        clearTimeout(gameRound);
    }
    //calculate the score math of all the players in the room 
    //and set the current score to 0
    restartScores(id);
    //set timer to 60
    getGameFromID(id).timer = 60;
    //console.log("listeners and shit",io.sockets.adapter.rooms)
    //io.sockets.emit("clear", {roomid: 1});  //works
    //let players = io.sockets.adapter.rooms.get(`room_${id}`);
    //console.log("players in listener and shit: ", players);
    console.log("begingame in game " + id + " is working - AFTER");
    //io.to(`room_${id}`).emit("host_change", {roomid: id});//works, below is 1 for testing
    //io.to(`room_1`).emit("host_change", {roomid: id});
    //TODO PENDING, ERROR: TypeError: Cannot read property 'gameUsers' of undefined
    var gameData = getGameFromID(id);
    var _seconds = 60000; //60 seconds
    setPlayerHost(id); //send a socket to this player and he can draw (the rest can't)
    var secretWord = generateSecretWord();
    var viewWord = "";
    for (var i = 0; i < secretWord.length; i++) {
        viewWord += "_";
    }
    gameData.secretWord = secretWord;
    gameData.displaySecretWord = viewWord;
    //send the clients except the host the word but as _ in an array (array["_", "_", "_"]) etc...
    console.log("blabla ", getGameFromID(id));
    //update timer every second
    var _timerSeconds = setInterval(function () {
        getGameFromID(id).timer -= 1;
        console.log("timer: " + getGameFromID(id).timer);
    }, 1000);
    //discover word at 30 seconds
    setTimeout(function () { discoverLetterInRoom(id); }, 30000);
    //discover word at 50 seconds
    setTimeout(function () { discoverLetterInRoom(id); }, 50000);
    //do an "if (!hasFinished) {"
    var _gameRound = setTimeout(function () { beginGame(id, _timerSeconds, _gameRound); }, _seconds);
};
var discoverLetterInRoom = function (id) {
    var _a;
    if (!gameExists(id))
        return;
    if (((_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.hasFinished) == true)
        return;
    var gameSecretWord = getGameFromID(id).secretWord;
    var replaced = false;
    do {
        var randomLetter = randomIntFromInterval(0, gameSecretWord.length - 1);
        if (getGameFromID(id).displaySecretWord.charAt(randomLetter) == "_") {
            var secret = getGameFromID(id).secretWord;
            var display = getGameFromID(id).displaySecretWord;
            var newDisplay = setCharAt(display, randomLetter, secret.charAt(randomLetter));
            getGameFromID(id).displaySecretWord = newDisplay;
            replaced = true;
            console.log("new display in room " + id + " is: ", getGameFromID(id).displaySecretWord);
            server_1.io.to("room_" + id).emit("show_hint", { roomid: id });
        }
    } while (!replaced);
};
var setPlayerHost = function (id) {
    var players = getGameFromID(id).gameUsers;
    var foundHost = false;
    if (players.length > 0) {
        for (var i = 0; i < players.length; i++) {
            console.log("player at i: " + i + " ", players[i]);
            if (players[i] != undefined) {
                if (players[i].hasBeenHost == false) {
                    //currentGames[id].gameUsers[i].hasBeenHost=true;
                    players[i].hasBeenHost = true;
                    foundHost = true;
                    //TODO: make the player the host 
                    server_1.io.to("room_" + id).emit("host_change", { roomid: id, newHost: players[i].username });
                    getGameFromID(id).hostName = players[i].username;
                    break;
                }
                else {
                }
            }
        }
        if (!foundHost) {
            var _newHost = void 0;
            for (var i = 0; i < players.length; i++) {
                if (getGameFromID(id).gameUsers === undefined)
                    continue;
                if (i > 0) {
                    getGameFromID(id).gameUsers[i].hasBeenHost = false;
                }
                else {
                    //TODO: make the player the host 
                    _newHost = players[i].username;
                    getGameFromID(id).hostName = _newHost;
                }
            }
            server_1.io.to("room_" + id).emit("host_change", { roomid: id, newHost: _newHost });
        }
        server_1.io.to("room_" + id).emit("show_hint", { roomid: id });
        server_1.io.to("room_" + id).emit("clear", { roomid: id });
    }
};
var generateSecretWord = function () {
    ///
    var randomN = randomIntFromInterval(0, words.length);
    var word = words[randomN];
    return "" + word;
};
//utils
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function setCharAt(str, index, chr) {
    if (index > str.length - 1)
        return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}
var playerCanDraw = function (id, userName) {
    if (!gameExists(id)) {
        return false;
    }
    var canDraw = (getGameFromID(id).hostName === userName) ? true : false;
    return canDraw;
};
var isTheRightPassword = function (id, password) {
    if (!gameExists(id)) {
        return false;
    }
    var rightPassword = (getGameFromID(id).roomPassword === password) ? true : false;
    return rightPassword;
};
var giveScoreToPlayer = function (id, userName) {
    var _a, _b;
    if (!gameExists(id)) {
        return;
    }
    if (!userExistsInRoom(id, userName)) {
        return;
    }
    var timeLeft = getGameFromID(id).timer;
    if (userExistsInRoom(id, userName)) {
        for (var i = 0; i < ((_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.gameUsers.length); i++) {
            if (((_b = getGameFromID(id)) === null || _b === void 0 ? void 0 : _b.gameUsers[i].username) == userName) {
                getGameFromID(id).gameUsers[i].score += timeLeft;
                break;
            }
        }
    }
};
var restartScores = function (id) {
    var _a;
    if (!gameExists(id)) {
        return;
    }
    for (var i = 0; i < ((_a = getGameFromID(id)) === null || _a === void 0 ? void 0 : _a.gameUsers.length); i++) {
        if (getGameFromID(id).gameUsers[i] != undefined) {
            getGameFromID(id).gameUsers[i].totalScore += getGameFromID(id).gameUsers[i].score;
            getGameFromID(id).gameUsers[i].score = 0;
        }
    }
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
exports.default = {
    getCurrentGames: getCurrentGames,
    getGameAt: getGameAt,
    getGameFromID: getGameFromID,
    addGame: addGame,
    removeGame: removeGame,
    gameExists: gameExists,
    getRoomUsers: getRoomUsers,
    userExistsInRoom: userExistsInRoom,
    addUserInRoom: addUserInRoom,
    removeUserInRoom: removeUserInRoom,
    getGameLobbies: getGameLobbies,
    beginGame: beginGame,
    getDisplaySecretWord: getDisplaySecretWord,
    getSecretWord: getSecretWord,
    playerCanDraw: playerCanDraw,
    giveScoreToPlayer: giveScoreToPlayer,
    restartScores: restartScores,
    isTheRightPassword: isTheRightPassword
};
