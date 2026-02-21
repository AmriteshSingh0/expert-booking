import "dotenv/config";
import mongoose from "mongoose";
import Expert from "./models/Expert.js";

const experts = [
  {
    name: "Dr. Sarah Johnson",
    category: "Technology",
    experience: 8,
    rating: 4.8,
    bio: "Full stack developer and system architect with 8 years of experience.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    slots: [
      { date: "2026-02-25", time: "09:00 AM", isBooked: false },
      { date: "2026-02-25", time: "11:00 AM", isBooked: false },
      { date: "2026-02-25", time: "02:00 PM", isBooked: false },
      { date: "2026-02-26", time: "10:00 AM", isBooked: false },
      { date: "2026-02-26", time: "03:00 PM", isBooked: false },
    ],
  },
  {
    name: "Dr. James Carter",
    category: "Finance",
    experience: 12,
    rating: 4.9,
    bio: "Investment strategist and financial advisor with a decade of Wall Street experience.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    slots: [
      { date: "2026-02-25", time: "09:00 AM", isBooked: false },
      { date: "2026-02-25", time: "01:00 PM", isBooked: false },
      { date: "2026-02-26", time: "11:00 AM", isBooked: false },
      { date: "2026-02-26", time: "04:00 PM", isBooked: false },
    ],
  },
  {
    name: "Dr. Priya Patel",
    category: "Health",
    experience: 10,
    rating: 4.7,
    bio: "Nutritionist and wellness coach helping people build sustainable healthy habits.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    slots: [
      { date: "2026-02-25", time: "08:00 AM", isBooked: false },
      { date: "2026-02-25", time: "12:00 PM", isBooked: false },
      { date: "2026-02-26", time: "09:00 AM", isBooked: false },
      { date: "2026-02-26", time: "02:00 PM", isBooked: false },
    ],
  },
  {
    name: "Mark Thompson",
    category: "Business",
    experience: 15,
    rating: 4.6,
    bio: "Serial entrepreneur and startup mentor with 3 successful exits.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    slots: [
      { date: "2026-02-25", time: "10:00 AM", isBooked: false },
      { date: "2026-02-25", time: "03:00 PM", isBooked: false },
      { date: "2026-02-26", time: "10:00 AM", isBooked: false },
      { date: "2026-02-26", time: "01:00 PM", isBooked: false },
    ],
  },
  {
    name: "Lisa Chen",
    category: "Technology",
    experience: 6,
    rating: 4.5,
    bio: "AI/ML engineer specializing in NLP and computer vision applications.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    slots: [
      { date: "2026-02-25", time: "11:00 AM", isBooked: false },
      { date: "2026-02-25", time: "04:00 PM", isBooked: false },
      { date: "2026-02-26", time: "08:00 AM", isBooked: false },
      { date: "2026-02-26", time: "03:00 PM", isBooked: false },
    ],
  },
  {
    name: "Dr. Ahmed Hassan",
    category: "Legal",
    experience: 20,
    rating: 4.9,
    bio: "Corporate lawyer specializing in tech startups, contracts, and IP law.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    slots: [
      { date: "2026-02-25", time: "09:00 AM", isBooked: false },
      { date: "2026-02-25", time: "02:00 PM", isBooked: false },
      { date: "2026-02-26", time: "11:00 AM", isBooked: false },
      { date: "2026-02-26", time: "05:00 PM", isBooked: false },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Expert.deleteMany();
    console.log("🗑️  Cleared existing experts");

    await Expert.insertMany(experts);
    console.log("🌱 Seeded 6 experts successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seed();