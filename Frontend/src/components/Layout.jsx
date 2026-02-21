import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const isAuth = pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {isLanding ? (
        <div className="flex-1">{children}</div>
      ) : isAuth ? (
        <div
          className="flex-1 flex items-center justify-center py-12 px-4"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.72)), url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {children}
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
          {children}
        </main>
      )}
      {<Footer />}
    </div>
  );
}