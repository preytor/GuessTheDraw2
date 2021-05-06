import express from "express";
import controller from "../controllers/game";

const router = express.Router();

router.post("/game/startroom", controller.beginGame);
router.post("/game/getroomusers", controller.getRoomUsers);
router.get("/game", controller.getGameData);
router.get("/game/roomexists/:id", controller.roomExists);
router.get("/game/roomhaspassword/:id", controller.roomHasPassword);
router.post("/game/addusertoroom", controller.addUserToRoom);
router.post("/game/removeusertoroom", controller.removeUserFromRoom);
router.get("/game/gamelobby/:index/:offset", controller.getGameLobbies);
router.post("/game/getDisplaySecretWord", controller.getDisplaySecretWord);
router.post("/game/getSecretWord", controller.getSecretWord);
router.post("/game/userCanDraw", controller.getuserCanDraw);

export = router;
