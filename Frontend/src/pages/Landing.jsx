import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const STATS = [
  { value: "500+", label: "Sessions Booked" },
  { value: "50+", label: "Expert Consultants" },
  { value: "4.8★", label: "Average Rating" },
  { value: "10+", label: "Categories" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse Experts",
    desc: "Explore our verified experts across multiple domains and find the right fit for you.",
  },
  {
    step: "02",
    title: "Pick a Slot",
    desc: "Choose from available time slots that work best for your schedule.",
  },
  {
    step: "03",
    title: "Book & Confirm",
    desc: "Fill in your details, confirm your booking and you're all set.",
  },
];

const CATEGORIES = [
  { icon: "💻", name: "Technology" },
  { icon: "📈", name: "Finance" },
  { icon: "🏥", name: "Health" },
  { icon: "💼", name: "Business" },
  { icon: "⚖️", name: "Legal" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section - full screen */}
      <div
        className="relative w-full min-h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.72)), url(https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white px-6 max-w-3xl mx-auto"
        >
          <span className="bg-indigo-500 bg-opacity-80 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 inline-block">
            Trusted by 500+ professionals
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-5">
            Get Guidance From{" "}
            <span className="text-indigo-400">Top Experts</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Connect with verified experts in Technology, Finance, Health,
            Business and Legal — and get the clarity you need.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate("/experts")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition"
            >
              Browse Experts
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-transparent hover:bg-white hover:bg-opacity-10 border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition"
            >
              Get Started Free
            </button>
          </div>
        </motion.div>

        {/* Sticky CTA bar at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 bg-amber-400 py-3 text-center">
          <button
            onClick={() => navigate("/experts")}
            className="font-bold text-gray-800 text-sm tracking-wide hover:underline"
          >
            Book Your Session Today! →
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-indigo-600 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-indigo-200 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Explore by Category
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Find experts across a wide range of domains
        </p>
        <div className="flex justify-center flex-wrap gap-4 max-w-2xl mx-auto">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/experts?category=${cat.name}`)}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl px-6 py-4 text-center hover:border-indigo-400 hover:shadow-md transition"
            >
              <p className="text-3xl mb-2">{cat.icon}</p>
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">How It Works</h2>
        <p className="text-gray-500 text-sm mb-10">
          Book a session in 3 simple steps
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 text-left"
            >
              <span className="text-4xl font-black text-indigo-100">
                {item.step}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-2 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-indigo-200 text-sm mb-6">
            Join hundreds of people who found the right expert for them
          </p>
          <button
            onClick={() => navigate("/experts")}
            className="bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition"
          >
            Browse All Experts
          </button>
        </motion.div>
      </div>
    </div>
  );
}
