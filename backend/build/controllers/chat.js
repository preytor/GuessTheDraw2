"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//doesnt work, for now ignore
var chat = function (io) {
    io.on("connection", function (socket) {
        console.log("A user connected test");
    });
};
exports.default = chat;
