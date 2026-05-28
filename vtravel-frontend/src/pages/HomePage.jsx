import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories, destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";

const stats = [
  { value: "24+", label: "Handpicked Destinations" },
  { value: "4", label: "Iconic Categories" },
  { value: "100%", label: "Solo Travel Focused" },
  { value: "₹0", label: "Hidden Charges" },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Featured picks — 2 from each category
  const featured = [
    destinations.temples[0],
    destinations.hills[2],
    destinations.forests[2],
    destinations.beaches[0],
  ];

  return (
    <div className="min-h-screen">
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen hero-gradient flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-forest-600/10 rounded-full blur-3xl" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 category-pill text-saffron-400 text-sm font-medium px-4 py-2 rounded-full mb-8 animate-fade-up">
            <span className="animate-float inline-block">✦</span>
            <span>India's Premier Solo Travel Guide</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-up animate-delay-100">
            Discover India,
            <br />
            <span className="text-gradient">Your Own Way</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-delay-200">
            From sacred temple towns to misty peaks, wild forests to pristine beaches —
            curated guides crafted exclusively for the solo adventurer.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-10 animate-fade-up animate-delay-300">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-saffron-400 focus:bg-white/15 transition-all"
            />
            <button
              type="submit"
              className="bg-saffron-600 hover:bg-saffron-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
            >
              Search ↗
            </button>
          </form>

          {/* Quick category buttons */}
          <div className="flex flex-wrap gap-2 justify-center animate-fade-up animate-delay-400">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="category-pill text-gray-200 hover:text-white hover:border-saffron-400 text-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-saffron-600/20"
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-float" />
          </div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────────── */}
      <section className="bg-earth-800 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-saffron-400 mb-1">{value}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-earth-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-earth-900 mb-3">
              Choose Your Journey
            </h2>
            <p className="text-earth-600 max-w-xl mx-auto">
              Four distinct worlds of India, each with its own soul. Pick yours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const count = destinations[cat.id]?.length || 0;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} p-6 min-h-[200px] flex flex-col justify-between card-hover`}
                >
                  <div>
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <h3 className="font-display text-xl font-bold text-white mb-1">{cat.label}</h3>
                    <p className="text-white/60 text-sm">{cat.tagline}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <span className="bg-white/20 text-white/90 text-xs px-3 py-1 rounded-full">
                      {count} destinations
                    </span>
                    <span className="text-white/80 group-hover:translate-x-1 transition-transform inline-block text-lg">→</span>
                  </div>
                  {/* Decorative circle */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURED DESTINATIONS ─────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold text-earth-900 mb-2">
                Editors' Top Picks
              </h2>
              <p className="text-earth-600">Handpicked gems for solo explorers</p>
            </div>
            <Link
              to="/category/temples"
              className="hidden sm:inline-flex text-saffron-600 hover:text-saffron-700 font-medium text-sm items-center gap-1"
            >
              View all destinations →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLO TRAVEL TIPS ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-earth-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-3">
              Solo Travel Essentials
            </h2>
            <p className="text-gray-400">Everything you need to travel India alone — safely and joyfully</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🛡️", title: "Safety First", desc: "Always share your itinerary with someone back home. Use trusted accommodation platforms and keep emergency contacts saved." },
              { icon: "💰", title: "Budget Smart", desc: "India offers extraordinary value. Hostels, dhabas, and state buses can stretch your money while giving authentic experiences." },
              { icon: "🗺️", title: "Plan Flexibly", desc: "Book your first night only. The best solo travel stories come from unplanned diversions and unexpected conversations." },
              { icon: "📱", title: "Stay Connected", desc: "Get a local SIM (Jio or Airtel) on arrival. Download offline maps. Most tourist areas have good coverage." },
              { icon: "🎒", title: "Pack Light", desc: "A 40L backpack is enough for months. You can buy or wash anything in India. Heavy bags kill spontaneity." },
              { icon: "🤝", title: "Trust the Culture", desc: "Indians are extraordinarily hospitable. Accept chai offers, ask locals for recommendations, be open to invitations." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-earth-700/50 rounded-2xl p-5 border border-earth-600/30">
                <div className="text-2xl mb-3">{icon}</div>
                <h4 className="text-white font-semibold mb-2">{title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-r from-saffron-800 to-saffron-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to Begin Your Solo Journey?
          </h2>
          <p className="text-saffron-100 mb-8 text-lg">
            Start exploring India's most iconic solo travel destinations today.
            No groups required — just you and the open road.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/category/temples"
              className="bg-white text-saffron-800 font-semibold px-7 py-3 rounded-full hover:bg-saffron-50 transition-all duration-200"
            >
              Explore Destinations
            </Link>
            <Link
              to="/plan"
              className="border-2 border-white text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
