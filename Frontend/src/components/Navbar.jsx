import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-tight">
        ExpertBook
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-indigo-200">Hi, {user.name}</span>
            <Link to="/my-bookings" className="text-sm hover:text-indigo-200 transition">
              My Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-indigo-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:text-indigo-200 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-indigo-50 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}