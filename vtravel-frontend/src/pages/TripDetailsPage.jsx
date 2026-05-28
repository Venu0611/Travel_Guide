import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookingById, updateBookingStatus } from "../api/travelApi";
import { destinations, categories } from "../data/destinations";

/* ─── Static travel data (mirrors TravelInfoPage) ───────────────────────── */
const travelData = {
  1: {
    trains: [
      { from: "Delhi (NDLS)",    no: "12559", name: "Shiv Ganga Express",  dur: "12h 30m", cls: "Sleeper / 3AC / 2AC", price: "₹450 – ₹2,500" },
      { from: "Mumbai (CSMT)",   no: "11093", name: "Mahanagari Express",  dur: "24h 45m", cls: "Sleeper / 3AC / 2AC", price: "₹600 – ₹3,200" },
      { from: "Kolkata (HWH)",   no: "13005", name: "Amritsar Mail",       dur: "14h 20m", cls: "Sleeper / 3AC",       price: "₹400 – ₹2,000" },
      { from: "Hyderabad (SC)",  no: "12591", name: "Gorakhpur Express",   dur: "20h 10m", cls: "Sleeper / 3AC / 2AC", price: "₹520 – ₹2,800" },
    ],
    flights: [
      { from: "Delhi (DEL)",     airline: "IndiGo / Air India",  dur: "1h 20m", freq: "8–10 daily", price: "₹2,500 – ₹6,000" },
      { from: "Mumbai (BOM)",    airline: "Air India / Vistara", dur: "2h 05m", freq: "5–6 daily",  price: "₹3,500 – ₹8,000" },
      { from: "Hyderabad (HYD)",airline: "IndiGo / SpiceJet",    dur: "1h 50m", freq: "3–4 daily",  price: "₹2,800 – ₹5,500" },
      { from: "Bangalore (BLR)", airline: "IndiGo / Air India",  dur: "2h 15m", freq: "2–3 daily",  price: "₹3,200 – ₹7,000" },
    ],
    buses: [
      { from: "Delhi",      op: "UPSRTC / Shrinath", dur: "10–12h", type: "AC Sleeper", fare: "₹500–₹1,200" },
      { from: "Lucknow",    op: "UPSRTC",            dur: "3–4h",   type: "AC Chair",   fare: "₹150–₹350" },
      { from: "Prayagraj",  op: "Multiple",          dur: "1.5h",   type: "Non-AC",     fare: "₹80–₹120" },
    ],
    local: ["Auto-rickshaw (₹20–₹80)", "Cycle rickshaw (₹30–₹100)", "Boat ride on Ganges (₹50–₹500)", "E-rickshaw (₹10–₹30)"],
    nearby: ["Sarnath (12 km)", "Ramnagar Fort (14 km)", "Chunar Fort (42 km)", "Vindhyachal (72 km)"],
    hotels: [
      { name: "BrijRama Palace",    type: "Luxury",    rating: 4.8, price: "₹12,000–₹35,000/night", desc: "Heritage 18th-century palace on the Ganges ghats", img: "🏰" },
      { name: "Hotel Surya",        type: "Mid-range", rating: 4.3, price: "₹2,500–₹5,000/night",   desc: "Clean rooms with rooftop Ganga views",             img: "🏨" },
      { name: "Rashmi Guest House", type: "Budget",    rating: 4.2, price: "₹500–₹1,500/night",     desc: "Popular backpacker spot near Assi Ghat",           img: "🏠" },
      { name: "Brijdham Hostel",    type: "Hostel",    rating: 4.0, price: "₹300–₹600/dorm",        desc: "Solo traveler-friendly, great social vibe",        img: "🛏️" },
    ],
    food: [
      { name: "Kashi Chat Bhandar", spec: "Tamatar chaat, aloo tikki",  area: "Vishwanath Gali", budget: "₹30–₹80",    veg: true  },
      { name: "Deena Chat Bhandar", spec: "Malaiyo, Banarasi paan",     area: "Godowlia",        budget: "₹20–₹60",    veg: true  },
      { name: "Shree Cafe",         spec: "South Indian, Israeli food", area: "Assi Ghat",       budget: "₹100–₹250",  veg: false },
      { name: "Brown Bread Bakery", spec: "Organic food, herbal teas",  area: "Shivala Ghat",    budget: "₹150–₹400",  veg: true  },
    ],
    services: {
      hospitals:  ["Sir Sundar Lal Hospital (BHU)", "Heritage Hospital (3 km)", "Mission Hospital (2.5 km)"],
      atm:        ["SBI ATM – Godowlia", "HDFC ATM – Lanka Chowk", "PNB ATM – Assi Ghat"],
      pharmacy:   ["Apollo Pharmacy – Sigra", "MedPlus – Lanka", "Local Medical Stores – Godowlia"],
      petrol:     ["HP Petrol Bunk – Rathyatra", "Indian Oil – Lanka", "BPCL – Sigra"],
      shopping:   ["Vishwanath Gali (silk sarees)", "Thatheri Bazaar (brassware)", "Lahurabir Market"],
    },
    timeline: [
      { day: 1, events: ["Arrive at Varanasi (Lal Bahadur Shastri Airport / Varanasi Junction)", "Check into hotel near Assi Ghat", "Evening Ganga Aarti at Dashashwamedh Ghat 🙏", "Dinner at Kashi Chat Bhandar"] },
      { day: 2, events: ["5 AM Sunrise boat ride on the Ganges 🚣", "Visit Kashi Vishwanath Temple", "Explore narrow lanes & Vishwanath Gali", "Lunch at local dhaba", "Visit Sarnath (12 km) – Buddhist heritage site", "Shopping for silk sarees & brassware"] },
      { day: 3, events: ["Morning yoga on the ghats", "Visit Ramnagar Fort (14 km)", "Final aarti darshan", "Departure from Varanasi"] },
    ],
    tips: ["Hire a local guide for the old city — the lanes are a maze!", "Avoid drinking tap water; carry bottled water always.", "Respect temple dress codes; carry a stole/scarf.", "The evening aarti (6–7 PM) is the highlight — arrive 30 min early."],
  },
  2: {
    trains: [
      { from: "Chennai (MAS)",    no: "12637", name: "Pandian Express",      dur: "8h 30m",  cls: "Sleeper / 3AC / 2AC", price: "₹350 – ₹2,200" },
      { from: "Bangalore (SBC)", no: "16731", name: "Mysuru–Tuticorin Exp",  dur: "10h",     cls: "Sleeper / 3AC",       price: "₹400 – ₹2,000" },
      { from: "Hyderabad (SC)",  no: "17651", name: "Kacheguda–Madurai Exp", dur: "15h 30m", cls: "Sleeper / 3AC",       price: "₹500 – ₹2,500" },
    ],
    flights: [
      { from: "Chennai (MAA)",    airline: "IndiGo / Air India",  dur: "1h 10m", freq: "6–8 daily",  price: "₹2,200 – ₹5,500" },
      { from: "Mumbai (BOM)",     airline: "IndiGo / SpiceJet",   dur: "2h 15m", freq: "4–5 daily",  price: "₹3,500 – ₹8,000" },
      { from: "Bangalore (BLR)", airline: "IndiGo / Vistara",    dur: "1h 05m", freq: "5–6 daily",  price: "₹1,800 – ₹4,500" },
    ],
    buses: [
      { from: "Chennai",    op: "SETC / TNSTC",   dur: "8–9h",  type: "AC Sleeper", fare: "₹400–₹900" },
      { from: "Bangalore", op: "KSRTC / Private", dur: "9–10h", type: "AC Sleeper", fare: "₹500–₹1,000" },
      { from: "Coimbatore", op: "TNSTC",          dur: "3h",    type: "Non-AC",     fare: "₹100–₹200" },
    ],
    local: ["Auto-rickshaw (₹30–₹100)", "City bus (₹10–₹30)", "Taxi / Ola (₹100–₹400)", "Cycle rickshaw (₹30–₹80)"],
    nearby: ["Thiruparankundram (8 km)", "Alagar Kovil (22 km)", "Rameswaram (180 km)", "Kodaikanal (120 km)"],
    hotels: [
      { name: "Heritage Madurai", type: "Luxury",    rating: 4.7, price: "₹8,000–₹20,000/night", desc: "Colonial bungalow boutique hotel", img: "🏰" },
      { name: "Hotel Park Plaza", type: "Mid-range", rating: 4.2, price: "₹2,000–₹4,000/night",  desc: "Central location, clean rooms",    img: "🏨" },
      { name: "TT Residency",     type: "Budget",    rating: 3.9, price: "₹600–₹1,200/night",    desc: "Near temple, basic amenities",     img: "🏠" },
    ],
    food: [
      { name: "Murugan Idli Shop", spec: "Idli, sambar, filter coffee", area: "Town Hall Road", budget: "₹50–₹150",  veg: true  },
      { name: "Amma Mess",         spec: "Tamil meals, Chettinad food", area: "Bypass Road",    budget: "₹80–₹200",  veg: true  },
      { name: "Indo Ceylon",       spec: "Multi-cuisine rooftop",       area: "West Masi St",   budget: "₹150–₹350", veg: false },
    ],
    services: {
      hospitals: ["Government Rajaji Hospital", "Meenakshi Mission Hospital (2 km)", "Apollo Madurai (4 km)"],
      atm:       ["SBI ATM – Town Hall Road", "HDFC ATM – Bypass Road", "Axis Bank – Near Temple"],
      pharmacy:  ["Apollo Pharmacy – West Masi St", "MedPlus – Town Hall Road"],
      petrol:    ["HP Bunk – Bypass Road", "Indian Oil – Mattuthavani"],
      shopping:  ["Puthu Mandapam (handicrafts)", "Bypass Road (silk)", "Madurai Central Mall"],
    },
    timeline: [
      { day: 1, events: ["Arrive at Madurai Airport / Railway Station", "Check into hotel near temple", "Evening visit to Meenakshi Amman Temple 🛕", "Experience the evening pooja ceremony"] },
      { day: 2, events: ["Early morning temple darshan (7 AM)", "Explore Golden Lotus Tank", "Visit Temple Art Museum", "Lunch at Murugan Idli Shop", "Shopping at Puthu Mandapam", "Alagar Kovil excursion (22 km)"] },
    ],
    tips: ["Dress modestly – the temple enforces strict dress codes.", "Photography inside the sanctum is prohibited.", "Visit during Chithirai Festival (April–May) for a spectacular experience.", "Hire a guide to fully understand the 4,500 sculptures on the gopurams."],
  },
};

/* ─── Fallback generic travel data ──────────────────────────────────────── */
const genericData = (dest) => ({
  trains: [{ from: "Nearest major city", no: "Check IRCTC", name: "Multiple trains available", dur: "Varies", cls: "Sleeper / AC classes", price: "₹200 – ₹3,000" }],
  flights: [{ from: "Nearest airport", airline: "Multiple airlines", dur: "Varies", freq: "Daily", price: "₹2,000 – ₹8,000" }],
  buses: [{ from: "Nearby cities", op: "State/Private operators", dur: "Varies", type: "AC / Non-AC", fare: "₹100 – ₹1,500" }],
  local: ["Auto-rickshaw", "Local taxi / Ola / Uber", "Public bus", "Rental bike"],
  nearby: ["Check local tourism board for nearby attractions"],
  hotels: [
    { name: "Luxury Hotel", type: "Luxury",    rating: 4.5, price: "₹5,000+/night",   desc: "Premium stay with full amenities",  img: "🏰" },
    { name: "Budget Inn",   type: "Budget",    rating: 4.0, price: "₹800–₹2,000/night",desc: "Clean and affordable accommodation",img: "🏠" },
    { name: "Backpackers",  type: "Hostel",    rating: 3.8, price: "₹300–₹600/dorm",   desc: "Great for solo travelers",          img: "🛏️" },
  ],
  food: [
    { name: "Local Restaurant", spec: "Regional cuisine", area: "Town Centre", budget: "₹100–₹300", veg: true },
    { name: "Street Food Stalls", spec: "Local snacks & chai", area: "Market Area", budget: "₹30–₹100", veg: true },
  ],
  services: {
    hospitals: ["Government District Hospital", "Nearest Private Hospital"],
    atm:       ["SBI ATM – Town Centre", "HDFC / ICICI ATM nearby"],
    pharmacy:  ["Apollo Pharmacy", "Local medical stores"],
    petrol:    ["HP / Indian Oil petrol bunk nearby"],
    shopping:  ["Local market", "Handicraft shops"],
  },
  timeline: [
    { day: 1, events: ["Arrive at destination", "Check into hotel", "Explore local market", "Evening dinner at local restaurant"] },
    { day: 2, events: ["Visit main attractions", "Local sightseeing", "Try regional cuisine", "Shopping for souvenirs"] },
    { day: 3, events: ["Visit nearby attractions", "Final exploration", "Departure"] },
  ],
  tips: ["Research local customs before visiting.", "Carry sufficient cash as card acceptance may be limited.", "Book accommodation in advance during peak season.", "Stay hydrated and carry a first-aid kit."],
});

/* ─── Helper ─────────────────────────────────────────────────────────────── */
const categoryEmoji = { TEMPLES: "🛕", HILLS: "⛰️", FORESTS: "🌿", BEACHES: "🏖️", temples: "🛕", hills: "⛰️", forests: "🌿", beaches: "🏖️" };

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 bg-saffron-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
      <div>
        <h2 className="font-display text-xl font-bold text-earth-900">{title}</h2>
        {subtitle && <p className="text-earth-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function InfoBadge({ label, value, icon }) {
  return (
    <div className="bg-earth-50 border border-earth-100 rounded-xl p-3 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-earth-800 font-semibold text-sm leading-tight">{value}</div>
      <div className="text-earth-400 text-xs mt-0.5">{label}</div>
    </div>
  );
}

export default function TripDetailsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBookingById(bookingId);
      setBooking(res.data);
    } catch {
      setError("Could not load booking details.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await updateBookingStatus(bookingId, "CANCELLED");
      setBooking(prev => ({ ...prev, status: "CANCELLED" }));
    } catch {
      alert("Could not cancel. Please try again.");
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  const handleDownload = () => {
    if (!booking) return;
    const d = booking.destination || {};
    const td = travel;
    const content = `VTRAVEL COMPLETE TRIP PLAN
==============================
Booking Ref: #${booking.id}
Status: ${booking.status}

DESTINATION: ${d.name || "N/A"}
Location: ${d.location || "N/A"}
Category: ${d.category || "N/A"}
Rating: ★ ${d.rating || "N/A"}

TRIP DETAILS
Travel Date: ${booking.travelDate}
Duration: ${booking.duration || d.duration || "N/A"}
From: ${booking.currentLocation || "N/A"}
Budget: ${booking.budget || d.budget || "N/A"}

${d.description || ""}

TRAVEL OPTIONS
--------------
TRAINS:
${td.trains?.map(t => `• ${t.from} → ${t.name} (${t.no}) | ${t.dur} | ${t.price}`).join("\n") || "N/A"}

FLIGHTS:
${td.flights?.map(f => `• ${f.from} → ${f.airline} | ${f.dur} | ${f.price}`).join("\n") || "N/A"}

BUSES:
${td.buses?.map(b => `• ${b.from} → ${b.op} | ${b.dur} | ${b.fare}`).join("\n") || "N/A"}

NEARBY PLACES
${td.nearby?.join("\n• ") || "N/A"}

TRAVEL TIPS
${td.tips?.map(t => `• ${t}`).join("\n") || "N/A"}

Generated by V_Travel — Your Solo Travel Companion`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `V_Travel_TripPlan_${d.name?.replace(/\s+/g, "_")}_${bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── Find destination in static data (for enrichment) ─── */
  let destStatic = null;
  let catId = null;
  if (booking?.destination?.id) {
    for (const [cId, dests] of Object.entries(destinations)) {
      const found = dests.find(d => d.id === booking.destination.id);
      if (found) { destStatic = found; catId = cId; break; }
    }
  }
  const category = categories.find(c => c.id === catId);
  const dest = booking?.destination || {};
  const destId = dest.id;
  const travel = travelData[destId] || genericData(dest);

  const navSections = [
    { id: "overview",   label: "Overview",   icon: "🏔️" },
    { id: "transport",  label: "Transport",  icon: "🚂" },
    { id: "hotels",     label: "Hotels",     icon: "🏨" },
    { id: "food",       label: "Food",       icon: "🍽️" },
    { id: "services",   label: "Services",   icon: "🏥" },
    { id: "timeline",   label: "Timeline",   icon: "📅" },
  ];

  const statusBadge = {
    PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-50 pt-24 flex items-center justify-center">
        <div className="text-center text-earth-400">
          <div className="text-4xl animate-pulse mb-3">✦</div>
          <p className="text-sm">Loading trip details…</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-earth-50 pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">😞</div>
          <h2 className="font-display text-2xl text-earth-800 mb-3">Booking Not Found</h2>
          <p className="text-earth-500 mb-5 text-sm">{error || "This booking does not exist or has been removed."}</p>
          <Link to="/bookings" className="bg-saffron-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-saffron-500 transition-all">
            ← Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {(dest.imageUrl || destStatic?.image) ? (
          <img
            src={dest.imageUrl || destStatic?.image}
            alt={dest.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-earth-800 via-earth-900 to-earth-800 flex items-center justify-center text-8xl">
            {categoryEmoji[dest.category] || "🗺️"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/90 via-earth-900/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-20 left-0 right-0 px-4">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-white/60 text-xs">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/bookings" className="hover:text-white transition-colors">My Bookings</Link>
            <span>/</span>
            <span className="text-white">{dest.name || "Trip Details"}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-saffron-600 text-white text-xs px-2.5 py-1 rounded-full">
                {categoryEmoji[dest.category]} {dest.category}
              </span>
              {dest.rating && (
                <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">★ {dest.rating}</span>
              )}
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadge[booking.status] || statusBadge.PENDING}`}>
                {booking.status}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{dest.name || "Your Trip"}</h1>
            <p className="text-white/70 text-sm mt-1">📍 {dest.location} · Ref #<strong className="text-white">{booking.id}</strong></p>
          </div>
        </div>
      </div>

      {/* ─── Sticky Action Bar ─────────────────────────────────────── */}
      <div className="bg-white border-b border-earth-200 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between gap-2 py-2 overflow-x-auto">
            {/* Section nav */}
            <div className="flex gap-1 flex-shrink-0">
              {navSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeSection === s.id ? "bg-earth-900 text-white" : "text-earth-600 hover:bg-earth-50"
                  }`}
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={handleDownload} className="text-earth-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-earth-200 hover:bg-earth-50 transition-all whitespace-nowrap">
                ⬇ Download
              </button>
              {booking.status !== "CANCELLED" && (
                <button onClick={() => setShowCancelModal(true)} className="text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-all whitespace-nowrap">
                  ✗ Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ══ SECTION 1: Destination Overview ════════════════════════ */}
        <div id="section-overview" className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
          <SectionHeader icon="🏔️" title="Destination Overview" subtitle="Everything you need to know about your destination" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <InfoBadge icon="📅" label="Travel Date"   value={booking.travelDate || "—"} />
            <InfoBadge icon="⏱️" label="Duration"      value={booking.duration || dest.duration || destStatic?.duration || "—"} />
            <InfoBadge icon="💰" label="Budget/Day"    value={booking.budget || dest.budget?.split(/[–-]/)[0] || "—"} />
            <InfoBadge icon="📍" label="Departing From" value={booking.currentLocation || "—"} />
          </div>

          {(dest.description || destStatic?.description) && (
            <div className="mb-5">
              <h3 className="font-semibold text-earth-800 text-sm mb-2">About This Destination</h3>
              <p className="text-earth-600 text-sm leading-relaxed">{dest.description || destStatic?.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🌤️", label: "Best Time to Visit", val: dest.bestTime || destStatic?.bestTime || "Year-round" },
              { icon: "🧗", label: "Difficulty Level",   val: dest.difficulty || destStatic?.difficulty || "Easy" },
              { icon: "⭐", label: "Overall Rating",     val: dest.rating ? `${dest.rating} / 5` : "Highly Rated" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 bg-earth-50 rounded-xl p-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-earth-500 text-xs">{item.label}</p>
                  <p className="text-earth-800 text-sm font-semibold">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          {(destStatic?.highlights || []).length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold text-earth-800 text-sm mb-3">Must-Do Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {destStatic.highlights.map(h => (
                  <div key={h} className="flex items-start gap-2 text-sm text-earth-700">
                    <span className="w-4 h-4 bg-saffron-100 text-saffron-700 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solo Tip */}
          {(destStatic?.soloTips) && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm font-semibold flex items-center gap-2 mb-1"><span>🎒</span> Solo Traveller's Tip</p>
              <p className="text-amber-700 text-sm leading-relaxed">{destStatic.soloTips}</p>
            </div>
          )}
        </div>

        {/* ══ SECTION 2 + 3: Journey & Transport ═════════════════════ */}
        <div id="section-transport" className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
          <SectionHeader icon="🚂" title="Transport Options" subtitle={`How to reach ${dest.name || "your destination"} from ${booking.currentLocation || "your location"}`} />

          {/* Journey Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "📍", label: "Starting Point", val: booking.currentLocation || "Your location" },
              { icon: "🗺️", label: "Destination",    val: dest.location || dest.name || "—" },
              { icon: "📆", label: "Travel Days",     val: booking.duration || dest.duration || "2–3 days" },
            ].map(i => (
              <div key={i.label} className="bg-earth-50 rounded-xl p-3 text-center">
                <div className="text-lg">{i.icon}</div>
                <div className="text-earth-800 font-semibold text-xs mt-1 leading-tight">{i.val}</div>
                <div className="text-earth-400 text-xs mt-0.5">{i.label}</div>
              </div>
            ))}
          </div>

          {/* Trains */}
          <div className="mb-6">
            <h3 className="font-semibold text-earth-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">🚆</span>
              Train Options
            </h3>
            <div className="space-y-2">
              {travel.trains.map((t, i) => (
                <div key={i} className="border border-earth-100 rounded-xl p-3 hover:border-saffron-200 transition-colors">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-earth-800 text-sm font-medium">{t.name} <span className="text-earth-400 text-xs">({t.no})</span></p>
                      <p className="text-earth-500 text-xs mt-0.5">From: {t.from}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-saffron-700 text-sm font-semibold">{t.price || "Check IRCTC"}</p>
                      <p className="text-earth-500 text-xs">{t.dur}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t.cls}</span>
                    {t.freq && <span className="bg-earth-50 text-earth-600 text-xs px-2 py-0.5 rounded-full">{t.freq}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flights */}
          <div className="mb-6">
            <h3 className="font-semibold text-earth-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-xs">✈️</span>
              Flight Options
            </h3>
            <div className="space-y-2">
              {travel.flights.map((f, i) => (
                <div key={i} className="border border-earth-100 rounded-xl p-3 hover:border-saffron-200 transition-colors">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-earth-800 text-sm font-medium">{f.airline}</p>
                      <p className="text-earth-500 text-xs mt-0.5">From: {f.from} · {f.freq}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-saffron-700 text-sm font-semibold">{f.price || "Check airlines"}</p>
                      <p className="text-earth-500 text-xs">{f.dur}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buses */}
          <div className="mb-6">
            <h3 className="font-semibold text-earth-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs">🚌</span>
              Bus Options
            </h3>
            <div className="space-y-2">
              {travel.buses.map((b, i) => (
                <div key={i} className="border border-earth-100 rounded-xl p-3 hover:border-saffron-200 transition-colors">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-earth-800 text-sm font-medium">{b.op}</p>
                      <p className="text-earth-500 text-xs mt-0.5">From: {b.from} · {b.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-saffron-700 text-sm font-semibold">{b.fare}</p>
                      <p className="text-earth-500 text-xs">{b.dur}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Transport */}
          <div>
            <h3 className="font-semibold text-earth-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs">🛺</span>
              Local Transport at Destination
            </h3>
            <div className="flex flex-wrap gap-2">
              {travel.local.map((l, i) => (
                <span key={i} className="bg-earth-50 border border-earth-100 text-earth-700 text-xs px-3 py-1.5 rounded-full">{l}</span>
              ))}
            </div>
          </div>

          {/* Nearby attractions */}
          {travel.nearby?.length > 0 && (
            <div className="mt-5 border-t border-earth-100 pt-5">
              <h3 className="font-semibold text-earth-800 text-sm mb-3">📌 Nearby Attractions</h3>
              <div className="flex flex-wrap gap-2">
                {travel.nearby.map((n, i) => (
                  <span key={i} className="bg-saffron-50 border border-saffron-100 text-saffron-700 text-xs px-3 py-1.5 rounded-full">{n}</span>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps link */}
          {dest.location && (
            <div className="mt-5 border-t border-earth-100 pt-5">
              <h3 className="font-semibold text-earth-800 text-sm mb-3">🗺️ Route Map</h3>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-earth-900 hover:bg-earth-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all w-fit"
              >
                <span>🗺️</span> Open Route in Google Maps →
              </a>
              <p className="text-earth-400 text-xs mt-2">Opens directions to {dest.location} in Google Maps</p>
            </div>
          )}
        </div>

        {/* ══ SECTION 4: Hotels ═══════════════════════════════════════ */}
        <div id="section-hotels" className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
          <SectionHeader icon="🏨" title="Hotels & Stay" subtitle="Where to rest your head" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {travel.hotels.map((h, i) => (
              <div key={i} className="border border-earth-100 rounded-xl p-4 hover:border-saffron-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-earth-800 font-semibold text-sm">{h.img} {h.name}</p>
                    <p className="text-earth-500 text-xs mt-0.5">{h.desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    h.type === "Luxury" ? "bg-amber-50 text-amber-700" :
                    h.type === "Mid-range" ? "bg-blue-50 text-blue-700" :
                    h.type === "Hostel" ? "bg-purple-50 text-purple-700" :
                    "bg-green-50 text-green-700"
                  }`}>{h.type}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <span className="text-saffron-500 text-xs">★</span>
                    <span className="text-earth-700 text-xs font-medium">{h.rating}</span>
                  </div>
                  <span className="text-saffron-700 text-xs font-semibold">{h.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 5: Food ═════════════════════════════════════════ */}
        <div id="section-food" className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
          <SectionHeader icon="🍽️" title="Food & Restaurants" subtitle="Best places to eat at your destination" />
          <div className="space-y-3">
            {travel.food.map((f, i) => (
              <div key={i} className="flex items-start gap-3 border border-earth-100 rounded-xl p-3 hover:border-saffron-200 transition-colors">
                <span className="text-2xl mt-0.5">{f.veg ? "🥗" : "🍖"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-earth-800 font-semibold text-sm">{f.name}</p>
                    <div className="flex items-center gap-2">
                      {f.veg && <span className="bg-green-50 text-green-700 text-xs px-1.5 py-0.5 rounded border border-green-200">Veg</span>}
                      <span className="text-saffron-700 text-xs font-semibold">{f.budget}</span>
                    </div>
                  </div>
                  <p className="text-earth-500 text-xs mt-0.5">{f.spec}</p>
                  <p className="text-earth-400 text-xs mt-0.5">📍 {f.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 6: Nearby Services ══════════════════════════════ */}
        <div id="section-services" className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
          <SectionHeader icon="🏥" title="Nearby Services" subtitle="Essential services at your destination" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🏥", label: "Hospitals",        items: travel.services?.hospitals || [] },
              { icon: "🏧", label: "ATM Centers",      items: travel.services?.atm || [] },
              { icon: "💊", label: "Medical Shops",    items: travel.services?.pharmacy || [] },
              { icon: "⛽", label: "Petrol Bunks",     items: travel.services?.petrol || [] },
              { icon: "🛍️", label: "Shopping Places", items: travel.services?.shopping || [] },
              { icon: "🚨", label: "Emergency Contacts", items: ["Police: 100", "Ambulance: 108", "Fire: 101", "Tourist Helpline: 1800-111-363"] },
            ].map(cat => (
              <div key={cat.label} className="bg-earth-50 rounded-xl p-4">
                <h4 className="font-semibold text-earth-800 text-sm mb-3 flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.label}
                </h4>
                <ul className="space-y-1.5">
                  {cat.items.map((item, i) => (
                    <li key={i} className="text-earth-600 text-xs flex items-start gap-1.5">
                      <span className="text-earth-300 mt-0.5">›</span> {item}
                    </li>
                  ))}
                  {cat.items.length === 0 && (
                    <li className="text-earth-400 text-xs">Check locally on arrival</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 7: Travel Timeline ══════════════════════════════ */}
        <div id="section-timeline" className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
          <SectionHeader icon="📅" title="Day-by-Day Timeline" subtitle="Your suggested travel itinerary" />
          <div className="space-y-6">
            {travel.timeline.map((day, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-saffron-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {day.day}
                  </div>
                  {i < travel.timeline.length - 1 && (
                    <div className="w-0.5 bg-saffron-200 flex-1 mt-2 min-h-6" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h3 className="font-semibold text-earth-800 text-sm mb-3">Day {day.day}</h3>
                  <ul className="space-y-2">
                    {day.events.map((event, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-earth-700">
                        <span className="w-1.5 h-1.5 bg-saffron-400 rounded-full mt-2 flex-shrink-0" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 8: Travel Tips ══════════════════════════════════ */}
        {travel.tips?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <span>💡</span> Travel Tips & Advice
            </h2>
            <ul className="space-y-3">
              {travel.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
                  <span className="w-5 h-5 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ══ Bottom Actions ═══════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Booking Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-earth-900 hover:bg-earth-800 text-white py-3 rounded-xl text-sm font-medium transition-all"
            >
              <span>⬇</span> Download PDF Itinerary
            </button>
            <Link
              to={`/travel-info/${destId}`}
              className="flex items-center justify-center gap-2 border border-earth-200 text-earth-700 hover:bg-earth-50 py-3 rounded-xl text-sm font-medium transition-all"
            >
              <span>🗺️</span> Full Travel Guide
            </Link>
            <Link
              to="/bookings"
              className="flex items-center justify-center gap-2 border border-saffron-200 text-saffron-700 hover:bg-saffron-50 py-3 rounded-xl text-sm font-medium transition-all"
            >
              <span>←</span> Back to My Bookings
            </Link>
          </div>

          {booking.status !== "CANCELLED" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="mt-3 w-full sm:w-auto text-red-500 hover:text-red-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-50 border border-red-100 transition-all"
            >
              ✗ Cancel This Trip
            </button>
          )}

          {booking.status === "CANCELLED" && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              ✗ This trip has been cancelled. <Link to="/" className="underline font-medium">Plan a new trip →</Link>
            </div>
          )}
        </div>

      </div>

      {/* ─── Cancel Modal ──────────────────────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-display text-xl font-bold text-earth-900 mb-2">Cancel This Trip?</h3>
              <p className="text-earth-600 text-sm">
                Are you sure you want to cancel your trip to <strong>{dest.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border border-earth-200 text-earth-700 py-2.5 rounded-xl text-sm font-medium hover:bg-earth-50 transition-all"
              >
                Keep Trip
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                {cancelling ? "Cancelling…" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
