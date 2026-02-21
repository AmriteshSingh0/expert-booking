import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "../api/axios";
import socket from "../socket/socket";
import { useAuth } from "../context/AuthContext";

function SkeletonDetail() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-4">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-5 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 bg-gray-200 rounded-lg w-24" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpert();
    socket.emit("join_expert", id);

    socket.on("slot_booked", ({ date, timeSlot }) => {
      setExpert((prev) => {
        if (!prev) return prev;
        const updatedSlots = prev.slots.map((s) => {
          if (s.date === date && s.time === timeSlot) {
            return { ...s, isBooked: true };
          }
          return s;
        });
        return { ...prev, slots: updatedSlots };
      });
      toast("A slot was just booked!", { icon: "🔔" });
    });

    return () => {
      socket.off("slot_booked");
    };
  }, [id]);

  const fetchExpert = async () => {
    try {
      const { data } = await axios.get(`/experts/${id}`);
      setExpert(data);
    } catch (err) {
      toast.error("Failed to load expert details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    if (!user) {
      toast.error("Please login to book a session");
      return navigate("/login");
    }
    navigate(`/booking/${expert._id}`, {
      state: { date: slot.date, timeSlot: slot.time },
    });
  };

  const groupByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    }, {});
  };

  if (loading) return <SkeletonDetail />;

  if (!expert) return (
    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">Expert not found.</div>
  );

  const groupedSlots = groupByDate(expert.slots);
  const availableCount = expert.slots.filter((s) => !s.isBooked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-indigo-600 transition mb-4 flex items-center gap-1"
      >
        ← Back to experts
      </button>

      {/* Expert Info Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-5 mb-4">
          <img
            src={expert.image}
            alt={expert.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{expert.name}</h1>
            <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-0.5 rounded-full">
              {expert.category}
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-4">{expert.bio}</p>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>⭐ {expert.rating} rating</span>
          <span>🧠 {expert.experience} years experience</span>
          <span>🟢 {availableCount} slots available</span>
        </div>
      </div>

      {/* Slots */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Available Slots</h2>

      {Object.keys(groupedSlots).length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-gray-500">No slots available for this expert.</p>
        </div>
      ) : (
        Object.entries(groupedSlots).map(([date, slots], i) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4"
          >
            <h3 className="font-semibold text-gray-700 mb-3">📅 {date}</h3>
            <div className="flex flex-wrap gap-3">
              {slots.map((slot) => (
                <button
                  key={slot._id}
                  disabled={slot.isBooked}
                  onClick={() => handleSlotClick(slot)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    slot.isBooked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-200"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}