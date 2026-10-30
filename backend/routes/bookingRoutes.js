const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/bookingController");

router.post("/", createBooking);

router.get("/:userId", getUserBookings);

router.put(
  "/cancel/:bookingId",
  cancelBooking
);

module.exports = router;