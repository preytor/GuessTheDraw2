"use strict";
var GameLogic = /** @class */ (function () {
    function GameLogic(_id, roomName, roomPassword) {
        this.gameUsers = [];
        this.secretWord = "";
        this.id = _id;
        this.roomName = roomName;
        this.roomPassword = roomPassword;
    }
    return GameLogic;
}());
module.exports = GameLogic;
