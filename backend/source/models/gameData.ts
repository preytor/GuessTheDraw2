import { UserRoom } from "./userRoom";

export interface GameData{
    gameUsers: Array<UserRoom>,
    roomName: string,
    roomPassword: string,
    id: number,
    secretWord: string,
    displaySecretWord: string,
    hasFinished: boolean,
    hostName: string,
    timer: number
}