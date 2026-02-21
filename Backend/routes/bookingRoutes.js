import express from "express";
import { createBooking, getBookingsByEmail, updateBookingStatus } from "../controllers/bookingController.js";
import { cancelBooking } from "../controllers/bookingController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookingsByEmail);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;