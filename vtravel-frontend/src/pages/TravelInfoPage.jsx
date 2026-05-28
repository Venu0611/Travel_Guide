import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { destinations, categories } from "../data/destinations";

/* ── per-destination travel data ─────────────────────────────────────────── */
const travelData = {
  1: { // Varanasi
    trains:[
      { from:"Delhi (NDLS)",    no:"12559", name:"Shiv Ganga Express",  dur:"12h 30m", cls:"Sleeper / 3AC / 2AC", freq:"Daily" },
      { from:"Mumbai (CSMT)",   no:"11093", name:"Mahanagari Express",  dur:"24h 45m", cls:"Sleeper / 3AC / 2AC", freq:"Daily" },
      { from:"Kolkata (HWH)",   no:"13005", name:"Amritsar Mail",       dur:"14h 20m", cls:"Sleeper / 3AC",       freq:"Daily" },
      { from:"Hyderabad (SC)",  no:"12591", name:"Gorakhpur Express",   dur:"20h 10m", cls:"Sleeper / 3AC / 2AC", freq:"Daily" },
    ],
    flights:[
      { from:"Delhi (DEL)",     airline:"IndiGo / Air India",   dur:"1h 20m", freq:"8–10 daily" },
      { from:"Mumbai (BOM)",    airline:"Air India / Vistara",  dur:"2h 05m", freq:"5–6 daily" },
      { from:"Hyderabad (HYD)", airline:"IndiGo / SpiceJet",    dur:"1h 50m", freq:"3–4 daily" },
      { from:"Bangalore (BLR)", airline:"IndiGo / Air India",   dur:"2h 15m", freq:"2–3 daily" },
    ],
    buses:[
      { from:"Delhi",      op:"UPSRTC / Shrinath", dur:"10–12h", type:"AC Sleeper",  fare:"₹500–₹1,200" },
      { from:"Lucknow",    op:"UPSRTC",            dur:"3–4h",   type:"AC Chair",    fare:"₹150–₹350" },
      { from:"Prayagraj",  op:"Multiple",          dur:"1.5h",   type:"Non-AC",      fare:"₹80–₹120" },
    ],
    local:["Auto-rickshaw (₹20–₹80)","Cycle rickshaw (₹30–₹100)","Boat ride on Ganges (₹50–₹500)","E-rickshaw (₹10–₹30)"],
    dist:{ Delhi:800, Mumbai:1500, Hyderabad:1350, Kolkata:670, Bangalore:1800, Chennai:2100 },
    stays:[
      { name:"BrijRama Palace",     type:"Luxury",    rating:4.8, price:"₹12,000–₹35,000/night", desc:"Heritage 18th-century palace on the Ganges ghats" },
      { name:"Hotel Surya",         type:"Mid-range", rating:4.3, price:"₹2,500–₹5,000/night",   desc:"Clean rooms with rooftop Ganga views" },
      { name:"Rashmi Guest House",  type:"Budget",    rating:4.2, price:"₹500–₹1,500/night",      desc:"Popular backpacker spot near Assi Ghat" },
      { name:"Brijdham Hostel",     type:"Hostel",    rating:4.0, price:"₹300–₹600/dorm",         desc:"Solo traveler-friendly, great social vibe" },
    ],
    food:[
      { name:"Kashi Chat Bhandar",  spec:"Tamatar chaat, aloo tikki",    area:"Vishwanath Gali", budget:"₹30–₹80" },
      { name:"Deena Chat Bhandar",  spec:"Malaiyo, Banarasi paan",       area:"Godowlia",        budget:"₹20–₹60" },
      { name:"Shree Cafe",          spec:"South Indian, Israeli food",   area:"Assi Ghat",       budget:"₹100–₹250" },
      { name:"Brown Bread Bakery",  spec:"Organic food, herbal teas",    area:"Shivala Ghat",    budget:"₹150–₹400" },
    ],
    nearby:["Sarnath (12 km)","Ramnagar Fort (14 km)","Chunar Fort (42 km)","Vindhyachal (72 km)"],
  },
  2: { // Meenakshi
    trains:[
      { from:"Chennai (MAS)",    no:"12637", name:"Pandian Express",      dur:"8h 30m",  cls:"Sleeper / 3AC / 2AC", freq:"Daily" },
      { from:"Bangalore (SBC)", no:"16731", name:"Mysuru–Tuticorin Exp",  dur:"10h",     cls:"Sleeper / 3AC",       freq:"Daily" },
      { from:"Hyderabad (SC)",  no:"17651", name:"Kacheguda–Madurai Exp", dur:"15h 30m", cls:"Sleeper / 3AC",       freq:"Daily" },
    ],
    flights:[
      { from:"Chennai (MAA)",    airline:"IndiGo / Air India", dur:"1h 10m", freq:"6–8 daily" },
      { from:"Mumbai (BOM)",     airline:"IndiGo / SpiceJet",  dur:"2h 15m", freq:"4–5 daily" },
      { from:"Bangalore (BLR)", airline:"IndiGo / Vistara",   dur:"1h 05m", freq:"5–6 daily" },
    ],
    buses:[
      { from:"Chennai",    op:"SETC / TNSTC",    dur:"8–9h",  type:"AC Sleeper", fare:"₹400–₹900" },
      { from:"Bangalore", op:"KSRTC / Private",  dur:"9–10h", type:"AC Sleeper", fare:"₹500–₹1,000" },
      { from:"Coimbatore", op:"TNSTC",           dur:"3h",    type:"Non-AC",     fare:"₹100–₹200" },
    ],
    local:["Auto-rickshaw (₹30–₹100)","City bus (₹10–₹30)","Taxi / Ola (₹100–₹400)","Cycle rickshaw (₹30–₹80)"],
    dist:{ Chennai:460, Bangalore:450, Mumbai:1440, Hyderabad:1200, Delhi:2200, Kolkata:2100 },
    stays:[
      { name:"Heritage Madurai",    type:"Luxury",    rating:4.7, price:"₹8,000–₹20,000/night", desc:"Colonial bungalow boutique hotel" },
      { name:"Hotel Park Plaza",    type:"Mid-range", rating:4.2, price:"₹2,000–₹4,000/night",  desc:"Central location, clean rooms" },
      { name:"TT Residency",        type:"Budget",    rating:3.9, price:"₹600–₹1,200/night",     desc:"Near temple, basic amenities" },
    ],
    food:[
      { name:"Murugan Idli Shop",   spec:"Idli, sambar, filter coffee", area:"Town Hall Road", budget:"₹50–₹150" },
      { name:"Amma Mess",           spec:"Tamil meals, Chettinad food", area:"Bypass Road",    budget:"₹80–₹200" },
      { name:"Indo Ceylon",         spec:"Multi-cuisine rooftop",       area:"West Masi St",   budget:"₹150–₹350" },
    ],
    nearby:["Thiruparankundram (8 km)","Alagar Kovil (22 km)","Rameswaram (180 km)","Kodaikanal (120 km)"],
  },
  5: { // Munnar
    trains:[
      { from:"Kochi (ERN)",       no:"—", name:"Nearest stn → taxi to Munnar", dur:"3.5h road", cls:"Taxi/Bus after train", freq:"Daily" },
      { from:"Coimbatore (CBE)", no:"—", name:"Coimbatore → bus to Munnar",    dur:"4h bus",    cls:"Direct bus",          freq:"Daily" },
    ],
    flights:[
      { from:"Kochi (COK)",       airline:"Fly to Kochi → 3h road", dur:"4h total", freq:"Multiple daily" },
      { from:"Coimbatore (CJB)", airline:"Nearest alt. airport",     dur:"4.5h road",freq:"Daily" },
    ],
    buses:[
      { from:"Kochi/Ernakulam", op:"KSRTC / Private", dur:"4–5h", type:"Semi-AC",  fare:"₹200–₹600" },
      { from:"Coimbatore",      op:"TNSTC / Private", dur:"4h",   type:"Non-AC",   fare:"₹120–₹300" },
      { from:"Madurai",         op:"SETC",            dur:"6h",   type:"Non-AC",   fare:"₹180–₹400" },
    ],
    local:["Auto (₹50–₹200)","Taxi / cab (₹800–₹2,000/day)","Two-wheeler rental (₹400–₹600/day)","KSRTC local bus (₹10–₹50)"],
    dist:{ Kochi:130, Coimbatore:100, Bangalore:460, Chennai:490, Mumbai:1600, Delhi:2700 },
    stays:[
      { name:"Windermere Estate",    type:"Luxury",    rating:4.9, price:"₹8,000–₹20,000/night", desc:"Colonial plantation bungalow" },
      { name:"Tea Valley Resort",    type:"Mid-range", rating:4.4, price:"₹3,000–₹6,000/night",  desc:"Panoramic tea-estate views" },
      { name:"Govt. Guest House",    type:"Budget",    rating:3.8, price:"₹600–₹1,200/night",    desc:"Basic but clean, great location" },
      { name:"Zostel Munnar",        type:"Hostel",    rating:4.3, price:"₹400–₹700/dorm",       desc:"Best for solo backpackers" },
    ],
    food:[
      { name:"Saravana Bhavan",   spec:"South Indian thali, dosas",  area:"Munnar Town",  budget:"₹80–₹200" },
      { name:"Rapsy Restaurant",  spec:"Kerala fish curry, appam",   area:"Market Road",  budget:"₹150–₹350" },
      { name:"The Tall Trees",    spec:"Organic food, tea tastings", area:"Bison Valley", budget:"₹200–₹500" },
    ],
    nearby:["Eravikulam NP (15 km)","Mattupetty Dam (13 km)","Kundala Lake (20 km)","Pallivasal Falls (8 km)"],
  },
};

function genericData(dest) {
  return {
    trains:[
      { from:"Nearest major city",   no:"Various", name:"Check IRCTC (irctc.co.in)", dur:"Varies", cls:"Sleeper / 3AC / 2AC", freq:"Daily" },
      { from:"Second nearest city",  no:"Various", name:"Multiple options available", dur:"Varies", cls:"Sleeper / 3AC",       freq:"Daily" },
    ],
    flights:[
      { from:"Nearest metro airport", airline:"IndiGo / Air India / SpiceJet", dur:"1–3h", freq:"Multiple daily" },
    ],
    buses:[
      { from:"Nearest city", op:"State Transport / Private", dur:"Varies", type:"AC / Non-AC", fare:"₹100–₹800" },
    ],
    local:["Auto-rickshaw","Taxi / Cab","Local bus","Shared jeep"],
    dist:{ Delhi:900, Mumbai:1200, Bangalore:800, Hyderabad:700, Chennai:600, Kolkata:1100 },
    stays:[
      { name:"Premium Hotel",      type:"Luxury",    rating:4.5, price:"₹5,000–₹15,000/night", desc:"Best-rated property near main attractions" },
      { name:"Comfort Inn",        type:"Mid-range", rating:4.0, price:"₹1,500–₹4,000/night",  desc:"Good amenities, central location" },
      { name:"Budget Guest House", type:"Budget",    rating:3.8, price:"₹400–₹1,200/night",    desc:"Clean, affordable, solo-friendly" },
    ],
    food:[
      { name:"Local Dhaba",      spec:"Regional cuisine, thali",  area:"Town Center",  budget:"₹50–₹150" },
      { name:"Restaurant Row",   spec:"Multi-cuisine options",    area:"Market Area",  budget:"₹150–₹400" },
    ],
    nearby: dest.highlights ? dest.highlights.slice(0,4) : ["Explore the surroundings"],
  };
}

const stayIcon = { Luxury:"🏰", "Mid-range":"🏨", Budget:"🏠", Hostel:"🛏️" };
const stayClr  = { Luxury:"bg-purple-100 text-purple-700", "Mid-range":"bg-blue-100 text-blue-700", Budget:"bg-earth-100 text-earth-600", Hostel:"bg-green-100 text-green-700" };

export default function TravelInfoPage() {
  const { id } = useParams();
  const [sec,      setSec]     = useState("transport");
  const [fromCity, setFromCity] = useState("");

  let dest = null; let categoryId = null;
  for (const [cId, dests] of Object.entries(destinations)) {
    const f = dests.find(d => d.id === parseInt(id));
    if (f) { dest = f; categoryId = cId; break; }
  }

  if (!dest) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-2xl text-earth-800 mb-3">Destination not found</h2>
        <Link to="/" className="text-saffron-600 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );

  const td    = travelData[dest.id] || genericData(dest);
  const cities = Object.keys(td.dist);
  if (!fromCity && cities.length) setFromCity(cities[0]);
  const selDist = td.dist[fromCity] || "—";

  const sections = [
    { id:"transport", label:"How to Reach", icon:"🗺️" },
    { id:"stay",      label:"Where to Stay", icon:"🏨" },
    { id:"food",      label:"Food & Dining", icon:"🍽️" },
    { id:"nearby",    label:"Nearby Places", icon:"📍" },
  ];

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero */}
      <div className="relative h-60 overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
              <Link to="/" className="hover:text-white">Home</Link><span>/</span>
              <Link to={`/destination/${dest.id}`} className="hover:text-white truncate max-w-xs">{dest.name}</Link><span>/</span>
              <span className="text-white">Travel Guide</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Travel Guide: {dest.name}</h1>
            <p className="text-gray-300 text-sm mt-1">📍 {dest.location}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Distance card */}
        <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6 mb-8">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-4">📏 Distance from Your City</h2>
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div>
              <label className="text-earth-600 text-xs font-medium block mb-1">Travel from</label>
              <select value={fromCity} onChange={e => setFromCity(e.target.value)}
                className="bg-earth-50 border border-earth-200 text-earth-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 cursor-pointer">
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="text-earth-400 font-bold text-lg">→</div>
            <div>
              <label className="text-earth-600 text-xs font-medium block mb-1">Destination</label>
              <div className="bg-saffron-50 border border-saffron-200 text-saffron-800 rounded-xl px-4 py-2.5 text-sm font-medium">{dest.name}</div>
            </div>
            <div className="ml-auto text-center">
              <div className="text-4xl font-bold text-saffron-600">{selDist}</div>
              <div className="text-earth-500 text-xs">km (approx.)</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cities.map(c => (
              <button key={c} onClick={() => setFromCity(c)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${fromCity === c ? "bg-saffron-600 text-white" : "bg-earth-50 border border-earth-200 text-earth-700 hover:border-saffron-300"}`}>
                <span>{c}</span><span className="font-semibold">{td.dist[c]} km</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {sections.map(s => (
            <button key={s.id} onClick={() => setSec(s.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${sec === s.id ? "bg-earth-900 text-white shadow" : "bg-white border border-earth-200 text-earth-600 hover:border-earth-400"}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Transport */}
        {sec === "transport" && (
          <div className="space-y-6">
            {/* Train */}
            <div className="bg-white rounded-2xl border border-earth-100 shadow-sm overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-100 px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">🚂</span>
                <div><h3 className="font-semibold text-blue-900">By Train</h3><p className="text-blue-600 text-xs">Most economical for long distances</p></div>
              </div>
              {td.trains.map((t,i) => (
                <div key={i} className="px-5 py-4 flex flex-wrap gap-4 items-start border-b border-earth-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-earth-900 text-sm">{t.from}</div>
                    <div className="text-earth-500 text-xs mt-0.5">{t.name} {t.no !== "—" && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs ml-1">{t.no}</span>}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold text-earth-800">⏱ {t.dur}</div>
                    <div className="text-earth-500">{t.cls}</div>
                    <div className="text-green-600">{t.freq}</div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 px-5 py-3 text-xs text-blue-700">💡 Book on <strong>IRCTC</strong> (irctc.co.in) — 60 days in advance for best seats</div>
            </div>

            {/* Flight */}
            <div className="bg-white rounded-2xl border border-earth-100 shadow-sm overflow-hidden">
              <div className="bg-sky-50 border-b border-sky-100 px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">✈️</span>
                <div><h3 className="font-semibold text-sky-900">By Flight</h3><p className="text-sky-600 text-xs">Fastest option</p></div>
              </div>
              {td.flights.map((f,i) => (
                <div key={i} className="px-5 py-4 flex flex-wrap gap-4 items-start border-b border-earth-50 last:border-0">
                  <div className="flex-1"><div className="font-medium text-earth-900 text-sm">{f.from}</div><div className="text-earth-500 text-xs mt-0.5">{f.airline}</div></div>
                  <div className="text-right text-xs"><div className="font-semibold text-earth-800">⏱ {f.dur}</div><div className="text-green-600">{f.freq}</div></div>
                </div>
              ))}
              <div className="bg-sky-50 px-5 py-3 text-xs text-sky-700">💡 Compare fares on <strong>MakeMyTrip</strong>, <strong>EaseMyTrip</strong>, or <strong>Google Flights</strong></div>
            </div>

            {/* Bus */}
            <div className="bg-white rounded-2xl border border-earth-100 shadow-sm overflow-hidden">
              <div className="bg-green-50 border-b border-green-100 px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">🚌</span>
                <div><h3 className="font-semibold text-green-900">By Bus</h3><p className="text-green-600 text-xs">Budget-friendly option</p></div>
              </div>
              {td.buses.map((b,i) => (
                <div key={i} className="px-5 py-4 flex flex-wrap gap-4 items-start border-b border-earth-50 last:border-0">
                  <div className="flex-1"><div className="font-medium text-earth-900 text-sm">{b.from}</div><div className="text-earth-500 text-xs mt-0.5">{b.op} · {b.type}</div></div>
                  <div className="text-right text-xs"><div className="font-semibold text-earth-800">⏱ {b.dur}</div><div className="text-saffron-700 font-medium">{b.fare}</div></div>
                </div>
              ))}
              <div className="bg-green-50 px-5 py-3 text-xs text-green-700">💡 Book on <strong>RedBus</strong> or <strong>AbhiBus</strong> for best deals</div>
            </div>

            {/* Local */}
            <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-5">
              <h3 className="font-semibold text-earth-900 mb-3">🛺 Local Transport at Destination</h3>
              <div className="flex flex-wrap gap-2">
                {td.local.map((l,i) => <span key={i} className="bg-saffron-50 border border-saffron-200 text-saffron-800 text-sm px-4 py-2 rounded-full">{l}</span>)}
              </div>
            </div>
          </div>
        )}

        {/* Stay */}
        {sec === "stay" && (
          <div className="space-y-4">
            <p className="text-earth-500 text-sm">Recommended stays near {dest.name}</p>
            {td.stays.map((s,i) => (
              <div key={i} className="bg-white rounded-2xl border border-earth-100 shadow-sm p-5 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-saffron-50 flex items-center justify-center text-2xl flex-shrink-0">{stayIcon[s.type] || "🏠"}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="font-semibold text-earth-900">{s.name}</h3>
                    <div className="text-right"><div className="text-saffron-700 font-semibold text-sm">{s.price}</div><div className="text-yellow-500 text-xs">★ {s.rating}</div></div>
                  </div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 mb-2 ${stayClr[s.type]}`}>{s.type}</span>
                  <p className="text-earth-600 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-800">
              💡 <strong>Solo tip:</strong> Book 2–3 days in advance during peak season (Oct–Mar). Use <strong>MakeMyTrip</strong> or <strong>Booking.com</strong>.
            </div>
          </div>
        )}

        {/* Food */}
        {sec === "food" && (
          <div className="space-y-4">
            <p className="text-earth-500 text-sm">Must-try food spots near {dest.name}</p>
            {td.food.map((f,i) => (
              <div key={i} className="bg-white rounded-2xl border border-earth-100 shadow-sm p-5 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0">🍽️</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="font-semibold text-earth-900">{f.name}</h3>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">{f.budget}</span>
                  </div>
                  <p className="text-saffron-700 text-sm font-medium mt-1">{f.spec}</p>
                  <p className="text-earth-500 text-xs mt-0.5">📍 {f.area}</p>
                </div>
              </div>
            ))}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-800">
              🌶️ <strong>Food tip:</strong> Try local street food near the main market — most authentic and economical experience.
            </div>
          </div>
        )}

        {/* Nearby */}
        {sec === "nearby" && (
          <div className="space-y-4">
            <p className="text-earth-500 text-sm">Places to explore near {dest.name}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {td.nearby.map((p,i) => (
                <div key={i} className="bg-white rounded-xl border border-earth-100 shadow-sm px-5 py-4 flex items-center gap-3">
                  <span className="text-saffron-500 text-xl">📍</span>
                  <span className="text-earth-800 font-medium">{p}</span>
                </div>
              ))}
            </div>
            <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 text-sm text-forest-800">
              🗺️ <strong>Day-trip tip:</strong> Hire a local guide or join a group tour from town for the best experience.
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-saffron-600 to-saffron-500 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold">Ready to plan your trip?</h3>
            <p className="text-saffron-100 text-sm mt-1">Get a personalised solo itinerary for {dest.name}.</p>
          </div>
          <Link to="/plan" className="flex-shrink-0 bg-white text-saffron-700 font-semibold px-6 py-3 rounded-xl hover:bg-saffron-50 transition-all text-sm whitespace-nowrap">
            Plan My Trip →
          </Link>
        </div>
      </div>
    </div>
  );
}
