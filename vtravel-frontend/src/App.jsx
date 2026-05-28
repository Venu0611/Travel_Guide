import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import DestinationDetail from "./pages/DestinationDetail";
import SearchPage from "./pages/SearchPage";
import PlanTripPage from "./pages/PlanTripPage";
import BookingsPage from "./pages/BookingsPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import TravelInfoPage from "./pages/TravelInfoPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function RequireAuth({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-saffron-600 text-2xl animate-pulse">✦</div></div>;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-saffron-600 text-2xl animate-pulse">✦</div></div>;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-50">
      <div className="text-center px-4">
        <div className="text-7xl mb-5">🗺️</div>
        <h2 className="font-display text-4xl text-earth-800 mb-3">Off the Map</h2>
        <p className="text-earth-500 mb-7 text-lg">Looks like you wandered somewhere we haven't mapped yet.</p>
        <a href="/" className="bg-saffron-600 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-saffron-500 transition-all">
          Back to Home
        </a>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin — no navbar/footer */}
        <Route path="/admin/*" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

        {/* Auth page — no navbar/footer */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public routes */}
        <Route path="/"                        element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/category/:categoryId"    element={<MainLayout><CategoryPage /></MainLayout>} />
        <Route path="/destination/:id"         element={<MainLayout><DestinationDetail /></MainLayout>} />
        <Route path="/travel-info/:id"         element={<MainLayout><TravelInfoPage /></MainLayout>} />
        <Route path="/search"                  element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/about"                   element={<MainLayout><AboutPage /></MainLayout>} />

        {/* Protected routes */}
        <Route path="/plan"           element={<RequireAuth><MainLayout><PlanTripPage /></MainLayout></RequireAuth>} />
        <Route path="/bookings"       element={<RequireAuth><MainLayout><BookingsPage /></MainLayout></RequireAuth>} />
        <Route path="/bookings/:bookingId" element={<RequireAuth><MainLayout><TripDetailsPage /></MainLayout></RequireAuth>} />

        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
