import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user";
import signJWT from "../functions/signJWT";
import config from "../config/config";
import jwt from "jsonwebtoken";

const NAMESPACE = "Users";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Token validated, user authorized");

  return res.status(200).json({
    message: "Authorized",
  });
};

const register = (req: Request, res: Response, next: NextFunction) => {
  let { username, email, password, repassword } = req.body;

  if (password !== repassword) {
    return res.status(400).json({
      message: "Password and repeat password aren't the same",
    });
  } else {
    //pending to be redone down here
    bcryptjs.hash(password, 10, (hashError, hash) => {
      if (hashError) {
        return res.status(500).json({
          message: hashError.message,
          error: hashError,
        });
      }

      const _user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: hash,
      });

      const accessToken = jwt.sign(
        { username: _user.id },
        config.server.token.secret,
        {
          expiresIn: config.server.token.expireTime,
        }
      );

      const dataUser = {
        username: _user.username,
        email: _user.email,
        accessToken: accessToken,
        expiresIn: config.server.token.expireTime,
      };

      return _user
        .save()
        .then((user) => {
          return res.status(201).json({
            dataUser,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            error,
          });
        });
    });
  }
};

const login = (req: Request, res: Response, next: NextFunction) => {
  let { email, password } = req.body;

  User.find({ email: email })
    .exec()
    .then((users) => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      bcryptjs.compare(password, users[0].password, (error, result) => {
        if (error) {
          logging.error(NAMESPACE, error.message, error);

          return res.status(401).json({
            message: "Unauthorized",
          });
        } else if (result) {
          signJWT(users[0], (_error, token) => {
            if (_error) {
              logging.error(NAMESPACE, "Unable to sign token: ", error);
              return res.status(401).json({
                message: "Unauthorized",
                error: _error,
              });
            } else if (token) {
              return res.status(200).json({
                message: "Auth successful",
                token,
                username: users[0].username,
              });
            }
          });
        }
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .select("-password")
    .exec()
    .then((users) => {
      return res.status(200).json({
        users,
        count: users.length,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const getRanking = (req: Request, res: Response, next: NextFunction) => {
  let limit = req.params.limit as string;
  let offset = req.params.offset as string;
  let _limit: number = parseInt(limit);
  let _offset: number = parseInt(offset);

  User.find()
    .sort({score: -1})
    .select("username")
    .select("score")
    .skip(_offset > 0 ? ( ( _offset - 1 ) * _limit ) : 0)
    .limit(_limit) //limit
    .exec()
    .then((users) => {
      return res.status(200).json({
        users,
        count: users.length,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default { validateToken, register, login, getAllUsers, getRanking };
