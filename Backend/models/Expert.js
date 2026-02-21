import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    bio: { type: String },
    image: { type: String },
    slots: [slotSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Expert", expertSchema);