const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const env = require("../config/env");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    verified: { type: Boolean, default: false },
    googleId: { type: String, default: null },
    picture: { type: String, default: "" },
    authProvider: { type: String, default: "local" },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, env.jwtPrivateKey, {
    expiresIn: "1d",
  });
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  });

  return schema.validate(data);
};

module.exports = { User, validate };
