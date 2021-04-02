import IGameUser from "./interfaces/gameUser";

class GameLogic {

    gameUsers: Array<IGameUser> = [];
    id: number;
    secretWord: string = "";

    constructor(_id: number){
        this.id = _id;
    }

    setSecretWord(_secretWord: string):void {
        this.secretWord = _secretWord;
    }

    getSecretWord(): string{
        return this.secretWord;
    }
}