import IGameUser from "./interfaces/gameUser";

class GameLogic {

    gameUsers: Array<IGameUser> = [];
    id: number;
    secretWord: string = "";

    constructor(_id: number){
        this.id = _id;
    }

/*  //Commented for now, find a way to put them somewhere 
    const setSecretWord = (_secretWord: string):void => {
        this.secretWord = _secretWord;
    }
    
    const getSecretWord = (): string => {
        return this.secretWord;
    }*/
}

export = GameLogic;