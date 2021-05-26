import express from "express";
import controller from "../controllers/game";

const router = express.Router();

router.post("/api/game/startroom", controller.beginGame);
router.post("/api/game/getroomusers", controller.getRoomUsers);
router.get("/api/game", controller.getGameData);
router.get("/api/game/roomexists/:id", controller.roomExists);
router.get("/api/game/roomhaspassword/:id", controller.roomHasPassword);
router.post("/api/game/addusertoroom", controller.addUserToRoom);
router.post("/api/game/removeusertoroom", controller.removeUserFromRoom);
router.get("/api/game/gamelobby/:index/:offset", controller.getGameLobbies);
router.post("/api/game/getDisplaySecretWord", controller.getDisplaySecretWord);
router.post("/api/game/getSecretWord", controller.getSecretWord);
router.post("/api/game/userCanDraw", controller.getuserCanDraw);
router.post("/api/game/isRightPassword", controller.isRightPassword);

export = router;
