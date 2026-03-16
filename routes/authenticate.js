const express = require("express");
const {
  forgotAuth,
  loginAuth,
  registerAuth,
  emailVerify,
  updatePasswordAuth,
  googleLogin,
} = require("../controllers/authenticateController");

const router = express.Router();

router.post("/google", googleLogin);

// POST a registration
router.post("/register", registerAuth);

// Verify a email
router.get("/register/:id/verify/:token", emailVerify);

// POST a login
router.post("/login", loginAuth);

// POST a email
router.post("/forgot", forgotAuth);

// UPDATE a new password
router.patch("/:id/reset/:token", updatePasswordAuth);

module.exports = router;
