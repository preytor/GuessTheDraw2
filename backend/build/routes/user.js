"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var user_1 = __importDefault(require("../controllers/user"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var router = express_1.default.Router();
router.get("/api/validate", extractJWT_1.default, user_1.default.validateToken);
router.post("/api/register", user_1.default.register);
router.post("/api/login", user_1.default.login);
router.get("/api/get/all", user_1.default.getAllUsers);
router.get("/api/ranking/:offset/:limit", user_1.default.getRanking);
module.exports = router;
