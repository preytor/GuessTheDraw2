"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importDefault(require("../config/logging"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var mongoose_1 = __importDefault(require("mongoose"));
var user_1 = __importDefault(require("../models/user"));
var signJWT_1 = __importDefault(require("../functions/signJWT"));
var config_1 = __importDefault(require("../config/config"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var NAMESPACE = "Users";
var validateToken = function (req, res, next) {
    logging_1.default.info(NAMESPACE, "Token validated, user authorized");
    return res.status(200).json({
        message: "Authorized",
    });
};
var register = function (req, res, next) {
    var _a = req.body, username = _a.username, email = _a.email, password = _a.password, repassword = _a.repassword;
    if (password !== repassword) {
        return res.status(400).json({
            message: "Password and repeat password aren't the same",
        });
    }
    else {
        //pending to be redone down here
        bcryptjs_1.default.hash(password, 10, function (hashError, hash) {
            if (hashError) {
                return res.status(500).json({
                    message: hashError.message,
                    error: hashError,
                });
            }
            var _user = new user_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                username: username,
                email: email,
                password: hash,
            });
            var accessToken = jsonwebtoken_1.default.sign({ username: _user.id }, config_1.default.server.token.secret, {
                expiresIn: config_1.default.server.token.expireTime,
            });
            var dataUser = {
                username: _user.username,
                email: _user.email,
                accessToken: accessToken,
                expiresIn: config_1.default.server.token.expireTime,
            };
            return _user
                .save()
                .then(function (user) {
                return res.status(201).json({
                    username: username,
                });
            })
                .catch(function (error) {
                return res.status(500).json({
                    message: error.message,
                    error: error,
                });
            });
        });
    }
};
var login = function (req, res, next) {
    console.log(req.body);
    var _a = req.body, email = _a.email, password = _a.password;
    user_1.default.find({ email: email })
        .exec()
        .then(function (users) {
        if (users.length !== 1) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        bcryptjs_1.default.compare(password, users[0].password, function (error, result) {
            if (error) {
                logging_1.default.error(NAMESPACE, error.message, error);
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }
            else if (result) {
                signJWT_1.default(users[0], function (_error, token) {
                    if (_error) {
                        logging_1.default.error(NAMESPACE, "Unable to sign token: ", error);
                        return res.status(401).json({
                            message: "Unauthorized",
                            error: _error,
                        });
                    }
                    else if (token) {
                        return res.status(200).json({
                            message: "Auth successful",
                            token: token,
                            username: users[0].username,
                        });
                    }
                });
            }
        });
    })
        .catch(function (error) {
        return res.status(500).json({
            message: error.message,
            error: error,
        });
    });
};
var getAllUsers = function (req, res, next) {
    user_1.default.find()
        .select("-password")
        .exec()
        .then(function (users) {
        return res.status(200).json({
            users: users,
            count: users.length,
        });
    })
        .catch(function (error) {
        return res.status(500).json({
            message: error.message,
            error: error,
        });
    });
};
var getRanking = function (req, res, next) {
    var limit = req.params.limit;
    var offset = req.params.offset;
    var _limit = parseInt(limit);
    var _offset = parseInt(offset);
    user_1.default.find()
        .sort({ score: -1 })
        .select("username")
        .select("score")
        .skip(_offset > 0 ? (_offset - 1) * _limit : 0)
        .limit(_limit) //limit
        .exec()
        .then(function (users) {
        return res.status(200).json({
            users: users,
            count: users.length,
        });
    })
        .catch(function (error) {
        return res.status(500).json({
            message: error.message,
            error: error,
        });
    });
};
exports.default = { validateToken: validateToken, register: register, login: login, getAllUsers: getAllUsers, getRanking: getRanking };
