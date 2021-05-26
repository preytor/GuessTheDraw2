import express from "express";
import controller from "../controllers/user";
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.get("/api/validate", extractJWT, controller.validateToken);
router.post("/api/register", controller.register);
router.post("/api/login", controller.login);
router.get("/api/get/all", controller.getAllUsers);
router.get("/api/ranking/:offset/:limit", controller.getRanking);

export = router;
