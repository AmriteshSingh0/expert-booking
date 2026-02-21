import Booking from "../models/Booking.js";
import Expert from "../models/Expert.js";

// POST /bookings
export const createBooking = async (req, res) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Atomic update - prevents double booking race condition
    const expert = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        slots: { $elemMatch: { date, time: timeSlot, isBooked: false } },
      },
      { $set: { "slots.$.isBooked": true } },
      { new: true }
    );

    if (!expert) {
      return res.status(400).json({ message: "Slot already booked or not available" });
    }

    const booking = await Booking.create({
      expert: expertId,
      name,
      email,
      phone,
      date,
      timeSlot,
      notes,
    });

    // Emit real-time event (io attached to req in server.js)
    req.io.to(expertId).emit("slot_booked", { date, timeSlot });

    res.status(201).json({ message: "Booking successful!", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /bookings?email=
export const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const bookings = await Booking.find({ email }).populate("expert", "name category image");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    // free the slot back up
    await Expert.findOneAndUpdate(
      { _id: booking.expert, "slots.date": booking.date, "slots.time": booking.timeSlot },
      { $set: { "slots.$.isBooked": false } }
    );

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};