import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
};

function SkeletonBooking() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`/bookings?email=${user.email}`);
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    setCancelling(bookingId);
    try {
      await axios.patch(`/bookings/${bookingId}/cancel`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => <SkeletonBooking key={i} />)}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">All your scheduled expert sessions</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-600 font-medium mb-1">No bookings yet</p>
          <p className="text-gray-400 text-sm mb-5">Go book a session with an expert!</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Browse Experts
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.expert.image}
                    alt={booking.expert.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{booking.expert.name}</h3>
                    <p className="text-sm text-gray-500">{booking.expert.category}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              <div className="flex gap-6 text-sm text-gray-500 mt-4">
                <span>📅 {booking.date}</span>
                <span>🕐 {booking.timeSlot}</span>
              </div>

              {booking.notes && (
                <p className="mt-3 text-sm text-gray-400 italic">"{booking.notes}"</p>
              )}

              {booking.status === "pending" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancelling === booking._id}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50"
                  >
                    {cancelling === booking._id ? "Cancelling..." : "Cancel Booking"}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}