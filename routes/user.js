const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const requireAuth = require("../middleware/requireAuth");
const { getCurrentUser } = require("../controllers/userController");

const router = express.Router();

router.use(requireAuth);

router.get("/me", asyncHandler(getCurrentUser));

module.exports = router;
