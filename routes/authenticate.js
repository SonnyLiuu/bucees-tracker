const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const {
  forgotAuth,
  loginAuth,
  registerAuth,
  emailVerify,
  updatePasswordAuth,
  googleLogin,
} = require("../controllers/authenticateController");

const router = express.Router();

router.post("/google", asyncHandler(googleLogin));
router.post("/register", asyncHandler(registerAuth));
router.get("/register/:id/verify/:token", asyncHandler(emailVerify));
router.post("/login", asyncHandler(loginAuth));
router.post("/forgot", asyncHandler(forgotAuth));
router.patch("/:id/reset/:token", asyncHandler(updatePasswordAuth));

module.exports = router;
