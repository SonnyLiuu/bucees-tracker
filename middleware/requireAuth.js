const jwt = require("jsonwebtoken");

const { User } = require("../models/userModel");
const env = require("../config/env");
const { createHttpError } = require("../util/http");

const requireAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(createHttpError(401, "Authorization token required"));
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(createHttpError(401, "Authorization token required"));
    }

    const { _id } = jwt.verify(token, env.jwtPrivateKey);
    const user = await User.findById(_id).select("_id email firstName lastName");

    if (!user) {
      return next(createHttpError(401, "Request is not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, "Request is not authorized"));
  }
};

module.exports = requireAuth;
