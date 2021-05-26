"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("../models/user"));
var fillDocuments = function () {
    var users = [
        {
            username: "LuisVita",
            email: "asd@gdas.com",
            password: "$2a$10$DANJOrEOw.UESWJnLnakY.gVFGDLTf/eS5Uz17MMmm7RcQNqjLWAS",
            score: 100,
            __v: 0,
        },
        {
            username: "kittykat123",
            email: "asd@gdas3.com",
            password: "$2a$10$I2oAE4KrGFWVlqs0sofbZuaMfcSk9V0jBgE8CuU1Qk5ZTMNFkoveq",
            score: 108,
            __v: 0,
        },
        {
            username: "elreydegaming",
            email: "asd@gdas3.com",
            password: "$2a$10$CKce/ouVopNlyR5.aRRSt.yDegsraC1Whi.aAoIesLeDoDEGoAjve",
            score: 25,
            __v: 0,
        },
        {
            username: "Xx_creepydoll_xX",
            email: "asd@gdas3.com",
            password: "$2a$10$7q2ZRhbCMHMs7hOMtWvAnuT00jwx2jrf2uPx/N1KezLDQ2wWggQYi",
            score: 203,
            __v: 0,
        },
        {
            username: "TuxedoKamen",
            email: "asd@gdas3.com",
            password: "$2a$10$5gOZ9SvTWhqyTp0eotBokOgL7zGKJ9AGa1hbFH4TjdupoMXudSYpe",
            score: 15,
            __v: 0,
        },
        {
            username: "Manashield",
            email: "asd@gmail.com",
            password: "$2a$10$/c6rQ2FPjiogPkK7DLMTcODw8QMz1/gnXq6ry19/qR./f1GozX6N.",
            score: 59,
            __v: 0,
        },
        {
            username: "ElTigre",
            email: "asdf123@gmail.com",
            password: "$2a$10$EehKmICt2wS2sP90to7Gb.PuJ4/1oWssqwkpSvn6wrifRLId5lQHi",
            score: 99,
            __v: 0,
        },
        {
            username: "fenelchat",
            email: "fenelchat@gmail.com",
            password: "$2a$10$HwkqjivylcDyazCHIx5A6OU1ZB2zRIwU/SSxW1.5b8PMzoSSpmBoS",
            score: 12,
            __v: 0,
        },
        {
            username: "Girasol",
            email: "bananemetalique@hotmail.com",
            password: "$2a$10$zKvhhUY62WsPBN2zgXv6iOkxdw/n5bu2hxOAw75iBNd15N5PMFX1W",
            __v: 0,
            score: 1455,
        },
    ];
    for (var user in users) {
        new user_1.default(users[user]).save().catch(function (err) {
            console.log(err.message);
        });
    }
};
var initDBData = function () {
    //User.collection.drop();
    //console.log("deleted db");
    user_1.default.countDocuments(function (err, count) {
        if (!err && count === 0) {
            console.log("tiene documentos:", false);
            fillDocuments();
        }
        else {
            console.log("tiene documentos:", true);
        }
    });
};
exports.default = {
    initDBData: initDBData,
};
