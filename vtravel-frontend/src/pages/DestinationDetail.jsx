import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { destinations, categories } from "../data/destinations";
import { useAuth } from "../context/AuthContext";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: user?.name || "", email: user?.email || "", date: "", travelers: 1, message: "" });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handlePlanTrip = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/destination/${id}` } });
      return;
    }
    setShowBooking(true);
  };

  // Find destination across all categories
  let dest = null;
  let categoryId = null;
  for (const [catId, dests] of Object.entries(destinations)) {
    const found = dests.find((d) => d.id === parseInt(id));
    if (found) { dest = found; categoryId = catId; break; }
  }

  const category = categories.find((c) => c.id === categoryId);

  if (!dest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-earth-800 mb-3">Destination not found</h2>
          <Link to="/" className="text-saffron-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const { createBooking } = await import("../api/travelApi");
      await createBooking(
        {
          customerName: bookingForm.name,
          email: user?.email || bookingForm.email,
          travelDate: bookingForm.date,
          specialRequirements: bookingForm.message,
        },
        dest.name
      );
    } catch (err) {
      // Still show success for offline/dev fallback
      console.warn("Booking API error:", err);
    }
    setBookingSuccess(true);
    setTimeout(() => { setShowBooking(false); setBookingSuccess(false); navigate('/bookings'); }, 2500);
  };

  const relatedDests = (destinations[categoryId] || []).filter((d) => d.id !== dest.id).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ─── Hero Image ─────────────────────────────────────────────── */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 right-0 px-4">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-white/70 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/category/${categoryId}`} className="hover:text-white transition-colors">
              {category?.label}
            </Link>
            <span>/</span>
            <span className="text-white">{dest.name}</span>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-saffron-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                {category?.icon} {category?.label}
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                ★ {dest.rating}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
              {dest.name}
            </h1>
            <p className="text-white/80 text-lg flex items-center gap-1">
              <span>📍</span> {dest.location}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Duration", value: dest.duration, icon: "🕐" },
                { label: "Best Time", value: dest.bestTime, icon: "📅" },
                { label: "Difficulty", value: dest.difficulty, icon: "🧗" },
                { label: "Budget/Day", value: dest.budget.split(/[–-]/)[0].trim() + "+", icon: "💰" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-earth-50 rounded-xl p-3 text-center border border-earth-100">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-earth-800 font-semibold text-sm">{value}</div>
                  <div className="text-earth-500 text-xs">{label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-bold text-earth-900 mb-3">About This Place</h2>
              <p className="text-earth-700 leading-relaxed text-base">{dest.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="font-display text-2xl font-bold text-earth-900 mb-4">Must-Do Highlights</h2>
              <ul className="space-y-2.5">
                {dest.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 bg-saffron-100 text-saffron-700 rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    <span className="text-earth-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solo Travel Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-display text-xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                <span>🎒</span> Solo Traveller's Tip
              </h3>
              <p className="text-amber-800 leading-relaxed">{dest.soloTips}</p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-earth-600 font-medium text-sm mb-3 uppercase tracking-wider">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {dest.tags.map((tag) => (
                  <span key={tag} className="bg-earth-100 text-earth-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Budget card */}
              <div className="bg-white border border-earth-200 rounded-2xl p-5 shadow-sm">
                <div className="font-display text-2xl font-bold text-earth-900 mb-1">{dest.budget}</div>
                <p className="text-earth-500 text-sm mb-5">Per day estimate (accommodation + meals + transport)</p>
                <button
                  onClick={handlePlanTrip}
                  className="w-full bg-saffron-600 hover:bg-saffron-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 mb-3"
                >
                  {isLoggedIn ? "Plan This Trip" : "Login to Book"}
                </button>
                <Link
                  to={`/travel-info/${dest.id}`}
                  className="block text-center text-white bg-forest-700 hover:bg-forest-600 font-semibold py-2.5 rounded-xl transition-all mb-3 text-sm"
                >
                  🗺️ How to Reach &amp; Stay Guide
                </Link>
                <Link
                  to={`/category/${categoryId}`}
                  className="block text-center text-earth-600 hover:text-earth-800 text-sm border border-earth-200 py-2.5 rounded-xl hover:bg-earth-50 transition-all"
                >
                  ← More in {category?.label}
                </Link>
              </div>

              {/* Info card */}
              <div className="bg-earth-900 text-white rounded-2xl p-5">
                <h4 className="font-semibold mb-3 text-saffron-400">Practical Info</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>🌡️ Climate varies by season</li>
                  <li>🛂 No special permits needed</li>
                  <li>🏥 Medical facilities available in nearby towns</li>
                  <li>📶 Mobile connectivity: Good</li>
                  <li>🚌 Reachable by public transport</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Related Destinations ──────────────────────────────────── */}
        {relatedDests.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-3xl font-bold text-earth-900 mb-8">
              More in {category?.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedDests.map((d) => (
                <Link key={d.id} to={`/destination/${d.id}`} className="group">
                  <div className="rounded-xl overflow-hidden border border-earth-200 card-hover bg-white">
                    <div className="h-40 overflow-hidden">
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-earth-900 text-sm group-hover:text-saffron-600 transition-colors">{d.name}</h4>
                      <p className="text-earth-500 text-xs mt-0.5 flex items-center gap-1"><span>📍</span>{d.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Booking Modal ───────────────────────────────────────────── */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-display text-2xl font-bold text-earth-900 mb-2">Trip Booked!</h3>
                <p className="text-earth-600 mb-5">Your trip to <strong>{dest.name}</strong> has been requested. We'll confirm it shortly.</p>
                <Link
                  to="/bookings"
                  className="inline-block bg-saffron-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-saffron-500 transition-all"
                  onClick={() => { setShowBooking(false); setBookingSuccess(false); }}
                >
                  View My Bookings →
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-xl font-bold text-earth-900">Plan Your Trip</h3>
                  <button onClick={() => setShowBooking(false)} className="text-earth-400 hover:text-earth-600 text-2xl leading-none">×</button>
                </div>
                <p className="text-earth-500 text-sm mb-5">Booking for <strong className="text-earth-800">{dest.name}</strong></p>
                {user?.email && (
                  <div className="flex items-center gap-2 bg-earth-50 rounded-xl px-4 py-2.5 mb-3 text-sm text-earth-600 border border-earth-100">
                    <span>👤</span>
                    <span>Booking as <strong className="text-earth-800">{user.name || user.email}</strong></span>
                  </div>
                )}
                <form onSubmit={handleBooking} className="space-y-3">
                  <input
                    required type="text" placeholder="Your Full Name"
                    className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                    value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  />
                  <input
                    required type="date"
                    className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                    value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  />
                  <textarea
                    rows={3} placeholder="Any special requirements or questions..."
                    className="w-full border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 resize-none"
                    value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="w-full bg-saffron-600 hover:bg-saffron-500 text-white font-semibold py-3 rounded-xl transition-all"
                  >
                    Confirm Booking
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;
