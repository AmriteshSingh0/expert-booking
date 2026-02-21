import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import expertRoutes from "./routes/expertRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
});

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Attach io to every request so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/experts", expertRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("join_expert", (expertId) => {
    socket.join(expertId);
  });

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Expert Booking API is running " });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});