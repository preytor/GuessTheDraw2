"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    getCurrentGames().push(newgame);
    console.log(currentGames.length);
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
    return currentGames.some(function (x) { return x.id === id; });
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
};
