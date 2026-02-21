/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "../api/axios";

const CATEGORIES = [
  "All",
  "Technology",
  "Finance",
  "Health",
  "Business",
  "Legal",
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export default function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchExperts = async (resetPage = false) => {
    setLoading(true);
    try {
      const params = { page: resetPage ? 1 : page, limit: 6 };
      if (search) params.search = search;
      if (category && category !== "All") params.category = category;

      const { data } = await axios.get("/experts", { params });
      setExperts(data.experts);
      setTotalPages(data.totalPages);
      if (resetPage) setPage(1);
    } catch (err) {
      toast.error("Failed to load experts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchExperts(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 -mx-4 w-screen relative left-1/2 -translate-x-1/2 px-10 py-12 mb-8 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-3"
        >
          Book a Session with the Best
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-indigo-200 text-sm mb-6"
        >
          Connect with top experts in Technology, Finance, Health, and more
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="flex gap-2 max-w-lg mx-auto"
        >
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white border-2 border-white"
          />
          <button
            type="submit"
            className="bg-white text-indigo-600 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition"
          >
            Search
          </button>
        </motion.form>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat === "All" ? "" : cat);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              category === cat || (cat === "All" && !category)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Expert Cards */}
      {!loading && (
        <>
          {experts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500">
                No experts found. Try a different search.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {experts.map((expert, i) => (
                <motion.div
                  key={expert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/experts/${expert._id}`)}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {expert.name}
                      </h2>
                      <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                        {expert.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {expert.bio}
                  </p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>⭐ {expert.rating}</span>
                    <span>🧠 {expert.experience} yrs exp</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
