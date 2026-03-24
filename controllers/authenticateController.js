const Joi = require("joi");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const { User, validate } = require("../models/userModel");
const VerificationToken = require("../models/verificationTokenModel");
const PasswordResetToken = require("../models/passwordResetTokenModel");
const env = require("../config/env");
const sendEmail = require("../util/sendEmailAPI");
const { createHttpError, sendResponse } = require("../util/http");

const client = new OAuth2Client(env.googleClientId);

const createToken = (_id) =>
  jwt.sign({ _id }, env.jwtPrivateKey, { expiresIn: "3d" });

const validateOrThrow = (validationResult) => {
  if (validationResult.error) {
    throw createHttpError(400, validationResult.error.details[0].message);
  }
};

const getUserData = (user) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  picture: user.picture,
});

const issueVerificationToken = async (userId) => {
  const tokenValue = crypto.randomBytes(5).toString("hex");

  await VerificationToken.deleteMany({ userId });

  return VerificationToken.create({
    userId,
    token: tokenValue,
  });
};

const issuePasswordResetToken = async (userId) => {
  const tokenValue = crypto.randomBytes(32).toString("hex");

  await PasswordResetToken.deleteMany({ userId });

  return PasswordResetToken.create({
    userId,
    token: tokenValue,
  });
};

const sendVerificationEmail = async (user) => {
  const token = await issueVerificationToken(user._id);
  const url = `${env.appBaseUrl}users/${user._id}/verify/${token.token}`;

  await sendEmail(
    user.email,
    "Verify your email bucco!",
    "Click this link to verify your email:",
    url
  );
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw createHttpError(400, "Missing Google credential");
  }

  let ticket;

  try {
    ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });
  } catch (error) {
    throw createHttpError(500, "Google login failed");
  }

  const payload = ticket.getPayload();
  const email = payload.email;
  const fullName = payload.name || "";
  const googleId = payload.sub;
  const picture = payload.picture || "";
  const emailVerified = payload.email_verified;

  if (!email || !emailVerified) {
    throw createHttpError(400, "Google account email is not verified");
  }

  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  let user = await User.findOne({ email });

  if (!user) {
    user = await new User({
      firstName,
      lastName,
      email,
      password: null,
      verified: true,
      googleId,
      picture,
      authProvider: "google",
    }).save();
  } else {
    if (!user.googleId) user.googleId = googleId;
    if (!user.picture) user.picture = picture;
    if (!user.firstName) user.firstName = firstName;
    if (!user.lastName) user.lastName = lastName;
    user.verified = true;
    user.authProvider = "google";

    await user.save();
  }

  return sendResponse(res, {
    message: "Login Successful!",
    payload: {
      userData: getUserData(user),
      token: createToken(user._id),
    },
  });
};

const registerAuth = async (req, res) => {
  validateOrThrow(validate(req.body));

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    throw createHttpError(409, "User with this email already exists.");
  }

  const salt = await bcrypt.genSalt(env.bcryptSaltRounds);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  user = await new User({ ...req.body, password: hashPassword }).save();

  await sendVerificationEmail(user);

  return sendResponse(res, {
    statusCode: 201,
    message: "Verification Email Sent!",
  });
};

const emailVerify = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    throw createHttpError(400, "Invalid link (user)");
  }

  const token = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!token) {
    if (user.verified) {
      return sendResponse(res, {
        message: "Email already verified",
      });
    }

    throw createHttpError(400, "Invalid link (token)");
  }

  await User.updateOne({ _id: user._id }, { $set: { verified: true } });
  await token.deleteOne();

  return sendResponse(res, {
    message: "Email Verified Successfully",
  });
};

const loginAuth = async (req, res) => {
  validateOrThrow(validateLogin(req.body));

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw createHttpError(401, "Invalid Email!");
  }

  if (!user.password) {
    throw createHttpError(
      401,
      "This account uses Google sign-in. Please continue with Google."
    );
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    throw createHttpError(401, "Invalid Password!");
  }

  if (!user.verified) {
    await sendVerificationEmail(user);

    throw createHttpError(
      400,
      "Another email has been sent, please verify your account before signing in."
    );
  }

  const userData = await User.findOne(
    { email: req.body.email },
    {
      _id: 0,
      firstName: 1,
      lastName: 1,
      email: 1,
      picture: 1,
    }
  );

  return sendResponse(res, {
    message: "Login Successful!",
    payload: {
      userData,
      token: createToken(user._id),
    },
  });
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data);
};

const forgotAuth = async (req, res) => {
  validateOrThrow(validateEmail(req.body));

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw createHttpError(401, "Invalid Email!");
  }

  const token = await issuePasswordResetToken(user._id);
  const url = `${env.appBaseUrl}users/${user._id}/reset-password/${token.token}`;

  await sendEmail(
    user.email,
    "Reset that password!",
    "Use this link to reset your password:",
    url
  );

  return sendResponse(res, {
    statusCode: 201,
    message: "Password change link sent!",
  });
};

const validateEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
  });

  return schema.validate(data);
};

const updatePasswordAuth = async (req, res) => {
  validateOrThrow(validatePassword(req.body));

  const { id, token } = req.params;
  const { password } = req.body;

  const resetToken = await PasswordResetToken.findOne({ userId: id, token });

  if (!resetToken) {
    throw createHttpError(400, "Invalid reset password link");
  }

  const user = await User.findById(id);

  if (!user) {
    throw createHttpError(400, "Invalid user");
  }

  const salt = await bcrypt.genSalt(env.bcryptSaltRounds);
  const hashPassword = await bcrypt.hash(password, salt);

  await User.updateOne({ _id: user._id }, { password: hashPassword });
  await resetToken.deleteOne();

  return sendResponse(res, {
    message: "Password successfully reset",
  });
};

const validatePassword = (data) => {
  const schema = Joi.object({
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data);
};

module.exports = {
  forgotAuth,
  loginAuth,
  registerAuth,
  emailVerify,
  updatePasswordAuth,
  googleLogin,
};
