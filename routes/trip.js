const express = require("express");

const asyncHandler = require("../middleware/asyncHandler");
const requireAuth = require("../middleware/requireAuth");
const {
  addTrip,
  getTrips,
  removeTrip,
} = require("../controllers/tripController");

const router = express.Router();

router.use(requireAuth);

router.get("/", asyncHandler(getTrips));
router.post("/", asyncHandler(addTrip));
router.delete("/:id", asyncHandler(removeTrip));

module.exports = router;
