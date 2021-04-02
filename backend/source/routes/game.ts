import express from "express";
import controller from "../controllers/game";

const router = express.Router();

router.post("/game/startroom", controller.beginGame);
router.post("/game/getroomusers", controller.getRoomUsers);

export = router;