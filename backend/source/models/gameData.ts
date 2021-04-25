import { UserRoom } from "./userRoom";

export interface GameData{
    gameUsers: Array<UserRoom>,
    roomName: string,
    roomPassword: string,
    id: number,
    secretWord: string
}