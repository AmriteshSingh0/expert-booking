# ExpertBook 🧠

A platform where users can discover and book one-on-one sessions with verified experts across domains like Technology, Finance, Health, Business, and Legal.

No waiting rooms. No middlemen. Just pick an expert, choose a slot, and book instantly.

---

## 🚀 Live Demo :https://expert-booking-frontend.onrender.com

## What This App Does

ExpertBook lets users browse a curated list of experts, view their available time slots in real time, and book a session in under a minute. If someone else books a slot while you're looking at it, it disappears instantly — no refreshing needed. Every booking is tied to your account and you can cancel anytime before it's confirmed.

---

## Security

- Passwords are hashed using **bcryptjs** before being stored — plain text passwords never touch the database
- Authentication is handled via **JWT tokens** that expire after 24 hours
- Protected routes on both frontend and backend — you cannot access booking or my bookings without a valid token
- The token is attached automatically to every API request via an Axios interceptor
- Double booking is prevented at the database level using MongoDB's atomic `findOneAndUpdate` operation — even if two users click the same slot at the exact same millisecond, only one goes through

---

## Features

- 🔐 Register and login with JWT authentication
- 👨‍💼 Browse experts with live search, category filter and pagination
- 📅 View available slots grouped by date
- ⚡ Real-time slot updates using Socket.io — slots gray out instantly when booked
- 🚫 Race condition safe double booking prevention
- ✅ Book sessions with full form validation
- 📋 View all your bookings with status (Pending / Confirmed / Completed)
- ❌ Cancel pending bookings (slot is freed back up automatically)
- 🎨 Fully responsive UI with smooth animations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io |
| HTTP Client | Axios |

---

## Technical Deep Dive

### Architecture

The app is split into two completely separate services — a React frontend served by Vite and a Node/Express REST API. They communicate over HTTP for standard CRUD operations and over WebSockets for real-time events. Both services read configuration from environment variables and are designed to be deployed independently.

### Authentication Flow

1. User registers → password is hashed with bcrypt (10 salt rounds) → user document saved to MongoDB
2. On login → bcrypt compares entered password with stored hash → if match, a signed JWT is returned
3. JWT is stored in localStorage and attached to every subsequent request via an Axios request interceptor
4. Protected backend routes run a middleware that verifies the JWT signature and attaches the user to `req.user`

### Real-Time Slot Updates

When a user opens an expert's detail page, the frontend emits a `join_expert` event with the expert's ID. Socket.io puts that socket into a room named after the expert ID. When any user successfully books a slot, the backend emits a `slot_booked` event to everyone in that room with the date and time slot. The frontend listener updates the local React state immediately — no polling, no page refresh.

### Double Booking Prevention

The naive approach would be to check if a slot is booked and then update it in two separate operations. The problem is two users could both pass the check before either update completes. Instead we use a single atomic MongoDB operation:
```js
const expert = await Expert.findOneAndUpdate(
  {
    _id: expertId,
    slots: { $elemMatch: { date, time: timeSlot, isBooked: false } },
  },
  { $set: { "slots.$.isBooked": true } },
  { new: true }
);

if (!expert) {
  return res.status(400).json({ message: "Slot already booked" });
}
```

The filter condition `isBooked: false` is part of the same operation as the update. MongoDB guarantees that only one of two simultaneous requests will match — the other gets null back and is rejected.

### Folder Structure
```
expert-booking/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login
│   │   ├── expertController.js# Get experts, get by ID
│   │   └── bookingController.js# Create, cancel, update status
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Expert.js          # Expert + slots schema
│   │   └── Booking.js         # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expertRoutes.js
│   │   └── bookingRoutes.js
│   ├── seed.js                # Database seeder
│   └── server.js              # Entry point
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js       # Axios instance with interceptor
        ├── components/
        │   ├── Layout.jsx
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx # Global auth state
        ├── pages/
        │   ├── Landing.jsx
        │   ├── ExpertList.jsx
        │   ├── ExpertDetail.jsx
        │   ├── Booking.jsx
        │   ├── MyBookings.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        └── socket/
            └── socket.js      # Socket.io client
```

### API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login and get token |
| GET | /experts | No | Get experts with pagination and filter |
| GET | /experts/:id | No | Get single expert with slots |
| POST | /bookings | Yes | Create a booking |
| GET | /bookings?email= | Yes | Get user bookings by email |
| PATCH | /bookings/:id/status | No | Update booking status |
| PATCH | /bookings/:id/cancel | Yes | Cancel a booking |

---

## Local Setup

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```
```bash
node seed.js   # populate database
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:5000
```
```bash
npm run dev
```
