import IGameUser from "./interfaces/gameUser";

class GameLogic {
  gameUsers: Array<IGameUser> = [];
  roomName: string;
  roomPassword: string;
  id: number;
  secretWord: string = "";

  constructor(_id: number, roomName: string, roomPassword: string) {
    this.id = _id;
    this.roomName = roomName;
    this.roomPassword = roomPassword;
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
