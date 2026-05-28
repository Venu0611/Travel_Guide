import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const isHome     = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const cats = [
    { label: "🛕 Temples",       path: "/category/temples" },
    { label: "⛰️ Hill Stations", path: "/category/hills" },
    { label: "🌿 Forests",       path: "/category/forests" },
    { label: "🏖️ Beaches",       path: "/category/beaches" },
  ];

  const navBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-earth-900/95 backdrop-blur-md shadow-lg";

  const linkCls = (path) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-saffron-600 text-white"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-saffron-400 text-2xl">✦</span>
            <span className="font-display text-xl font-bold text-white tracking-wide">V_Travel</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {cats.map((c) => <Link key={c.path} to={c.path} className={linkCls(c.path)}>{c.label}</Link>)}
            <Link to="/about" className={linkCls("/about")}>About</Link>
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link to="/plan" className="bg-saffron-600 hover:bg-saffron-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all">
                  Plan Trip
                </Link>
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full text-sm font-medium transition-all">
                    <span className="w-6 h-6 bg-saffron-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                    <span className="max-w-[6rem] truncate">{user?.name?.split(" ")[0]}</span>
                    <span className="text-white/40 text-xs">{profileOpen ? "▲" : "▼"}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-earth-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-white text-sm font-medium truncate">{user?.name}</div>
                        <div className="text-gray-400 text-xs truncate">{user?.email}</div>
                        {isAdmin && <span className="inline-block bg-saffron-600 text-white text-xs px-2 py-0.5 rounded-full mt-1">Admin</span>}
                      </div>
                      <div className="py-1">
                        <Link to="/bookings" className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 text-sm transition-colors">🎫 My Bookings</Link>
                        {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-saffron-400 hover:text-saffron-300 hover:bg-white/10 text-sm transition-colors">⚙️ Admin Panel</Link>}
                        <button onClick={() => { logout(); navigate("/"); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/10 text-sm transition-colors">
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-all">Sign In</Link>
                <Link to="/login" className="bg-saffron-600 hover:bg-saffron-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all">Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden text-white p-2 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 space-y-1">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-earth-900/98 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
          {cats.map((c) => (
            <Link key={c.path} to={c.path} className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm">{c.label}</Link>
          ))}
          <Link to="/about" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm">About</Link>
          <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
            {isLoggedIn ? (
              <>
                <Link to="/plan" className="block bg-saffron-600 text-white text-center font-semibold px-4 py-3 rounded-xl text-sm">Plan a Trip</Link>
                <Link to="/bookings" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 text-sm">🎫 My Bookings</Link>
                {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-xl text-saffron-400 hover:bg-white/10 text-sm">⚙️ Admin Panel</Link>}
                <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-white/10 text-sm">
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-center text-gray-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/10 text-sm">Sign In</Link>
                <Link to="/login" className="block bg-saffron-600 text-white text-center font-semibold px-4 py-3 rounded-xl text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
