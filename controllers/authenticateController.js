const { User, validate } = require("../models/userModel");
const Token = require("../models/tokenModel");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const sendEmail = require("../util/sendEmailAPI");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.JWTPRIVATEKEY, { expiresIn: "3d" });
};

// login through google
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).send({ message: "Missing Google credential" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const fullName = payload.name || "";
    const googleId = payload.sub;
    const picture = payload.picture || "";
    const emailVerified = payload.email_verified;

    if (!email || !emailVerified) {
      return res
        .status(400)
        .send({ message: "Google account email is not verified" });
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

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
    };

    const token = createToken(user._id);

    return res.status(200).send({
      userData,
      token,
      message: "Login Successful!",
    });
  } catch (error) {
    console.log("Google login error:", error);
    return res.status(500).send({ message: "Google login failed" });
  }
};
// post a registration
const registerAuth = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });

    if (user)
      return res
        .status(409)
        .send({ message: "User with this email already exists." });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(5).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify your email bucco!", url);

    res.status(201).send({ message: "Verification Email Sent!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// verify a registration email
const emailVerify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link (user)" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    console.log(req.params);

    if (!token)
      return res.status(400).send({ message: "Invalid link (token)" });

    await User.updateOne({ _id: user._id }, { $set: { verified: true } });
    await token.deleteOne();

    res.status(200).send({ message: "Email Verified Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// post a login
const loginAuth = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).send({ message: "Invalid Email!" });

    if (!user.password) {
      return res.status(401).send({
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password!" });

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(5).toString("hex"),
        }).save();
      }

      const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, "Verify your email bucco!", url);

      return res.status(400).send({
        message:
          "Another email has been sent, please verify your account before signing in.",
      });
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

    const token = createToken(user._id);

    res.status(200).send({
      userData,
      token,
      message: "Login Successful!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

// send a email for password reset
const forgotAuth = async (req, res) => {
  try {
    const { error } = validateEmail(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ message: "Invalid Email!" });

    // Check if a token already exists for the user
    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      // If no token exists, create a new one
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    } else {
      // If a token already exists, update it
      token.token = crypto.randomBytes(32).toString("hex");
      await token.save();
    }

    const url = `${process.env.BASE_URL}users/${user._id}/reset-password/${token.token}`;

    await sendEmail(user.email, "Reset that password!", url);

    res.status(201).send({ message: "Password change link sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const validateEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
  });
  return schema.validate(data);
};

// update a password
const updatePasswordAuth = async (req, res) => {
  try {
    const { error } = validatePassword(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { id, token } = req.params;
    const { password } = req.body;

    // Verify the token
    const resetToken = await Token.findOne({ userId: id, token });
    if (!resetToken)
      return res.status(400).send({ message: "Invalid reset password link" });

    // Find the user
    const user = await User.findById(id);
    if (!user) return res.status(400).send({ message: "Invalid user" });

    // Update the user's password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    await User.updateOne({ _id: user._id }, { password: hashPassword });

    res.status(200).send({ message: "Password successfully reset" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
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
