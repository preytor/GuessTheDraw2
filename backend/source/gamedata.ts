import GameLogic from './game-logic';

var currentGames: Array<GameLogic> = [];

const getCurrentGames = (): Array<GameLogic> => {
    return currentGames;
}

const getGameAt = (index: number): GameLogic => {
    return currentGames[index];
}

const getGameFromID = (id: any): GameLogic | undefined => {
    for (var i=0, iLen=getCurrentGames().length; i<iLen; i++) {
        if (getCurrentGames()[i].id == id) return getCurrentGames()[i];
    }
}

const addGame = (newgame: GameLogic): void => {
    getCurrentGames().push(newgame);
    console.log(currentGames.length);
}

const removeGame = (gameToRemove: GameLogic): void => {
    for (var i=0, iLen=getCurrentGames().length; i<iLen; i++) {
        if (getCurrentGames()[i].id == gameToRemove.id){
            getCurrentGames().splice(i, 1);
            break;
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
    removeGame
};