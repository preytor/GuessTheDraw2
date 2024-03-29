"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var NAMESPACE = "Server";
dotenv_1.default.config();
var HOST_ORIGIN = process.env.HOST_ORIGIN || "http://localhost:81";
var MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false,
};
var MONGO_USERNAME = process.env.MONGO_USERNAME || "myUserAdmin";
var MONGO_PASSWORD = process.env.MONGO_PASSWORD || "abc123";
var MONGO_HOST = process.env.MONGO_URL || "127.0.0.1:27017";
var MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: "mongodb://".concat(MONGO_USERNAME, ":").concat(MONGO_PASSWORD, "@").concat(MONGO_HOST),
};
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
var SERVER_PORT = process.env.SERVER_PORT || 3000;
var SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 24 * 60 * 60;
var SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "coolissuer";
var SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superencryptedsecret";
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET,
    },
    host_origin: HOST_ORIGIN,
};
var config = {
    mongo: MONGO,
    server: SERVER,
};
exports.default = config;
