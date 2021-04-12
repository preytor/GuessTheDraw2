"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var game_1 = __importDefault(require("../controllers/game"));
var router = express_1.default.Router();
router.post("/game/startroom", game_1.default.beginGame);
router.post("/game/getroomusers", game_1.default.getRoomUsers);
router.get("/game", game_1.default.getGameData);
router.post("/game/roomexists/", game_1.default.roomExists);
module.exports = router;
