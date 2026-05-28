import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { destinations as localDests, categories } from "../data/destinations";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const authFetch = (url, opts = {}) => {
  const token = localStorage.getItem("ws_token");
  return fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
};

const allDests = Object.entries(localDests).flatMap(([catId, arr]) => arr.map(d => ({ ...d, category: catId })));

const statusCls = {
  PENDING:   "bg-yellow-100 text-yellow-800 border border-yellow-200",
  CONFIRMED: "bg-green-100  text-green-800  border border-green-200",
  CANCELLED: "bg-red-100    text-red-700    border border-red-200",
};

const demoBookings = [];

/* ─── Stat card ─────────────────────────────────────────────────────────── */
const Stat = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${color}`}>
    <span className="text-3xl">{icon}</span>
    <div><div className="text-2xl font-bold text-earth-900">{value}</div><div className="text-earth-500 text-sm">{label}</div></div>
  </div>
);

/* ─── Bookings tab ──────────────────────────────────────────────────────── */
function BookingsTab({ bookings: propBookings, onStatusChange, onDelete }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = propBookings.filter(b => {
    if (filter !== "ALL" && b.status !== filter) return false;
    const q = search.toLowerCase();
    return !q || `${b.customerName}${b.email}${b.destination?.name}${b.currentLocation}`.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, destination, location…"
          className="flex-1 min-w-48 bg-earth-50 border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" />
        <div className="flex gap-2 flex-wrap">
          {["ALL","PENDING","CONFIRMED","CANCELLED"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filter===f ? "bg-earth-900 text-white" : "bg-white border border-earth-200 text-earth-600 hover:border-earth-400"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(b => (
          <div key={b.id} className="bg-white rounded-2xl border border-earth-100 shadow-sm p-5">
            <div className="flex flex-wrap gap-4 items-start">
              {b.destination?.imageUrl && (
                <img src={b.destination.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="font-semibold text-earth-900">{b.customerName}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCls[b.status]}`}>{b.status}</span>
                  <span className="text-earth-400 text-xs">#{b.id}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm text-earth-600">
                  <div>📧 {b.email}</div>
                  <div>📱 {b.phone || "—"}</div>
                  <div>📍 {b.destination?.name || "—"}</div>
                  <div>📅 {b.travelDate}</div>
                  <div>⏱ {b.duration || "—"}</div>
                  <div>💰 {b.budget || "—"}</div>
                </div>
                {b.currentLocation && <div className="text-xs text-earth-400 mt-1">🏠 Travelling from: <strong>{b.currentLocation}</strong></div>}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <select value={b.status} onChange={e => onStatusChange(b.id, e.target.value)}
                  className="bg-earth-50 border border-earth-200 text-earth-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-saffron-400 cursor-pointer">
                  <option>PENDING</option><option>CONFIRMED</option><option>CANCELLED</option>
                </select>
                <button onClick={() => { if(window.confirm("Delete booking #"+b.id+"?")) onDelete(b.id); }}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-2 rounded-lg transition-colors">
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-earth-400"><div className="text-4xl mb-3">📭</div><p>No bookings match your filter.</p></div>
        )}
      </div>
    </div>
  );
}

/* ─── Destinations tab ──────────────────────────────────────────────────── */
function DestinationsTab() {
  const [dests,    setDests]    = useState(allDests);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [search,   setSearch]   = useState("");
  const [catFilt,  setCatFilt]  = useState("all");
  const [saved,    setSaved]    = useState(false);
  const blank = { name:"", location:"", category:"temples", image:"", description:"", budget:"", duration:"", difficulty:"Easy", bestTime:"", rating:4.5 };
  const [form, setForm] = useState(blank);
  const up = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const openAdd  = () => { setEditId(null); setForm(blank); setShowForm(true); };
  const openEdit = (d) => { setEditId(d.id); setForm({ name:d.name, location:d.location, category:d.category||"temples", image:d.image||"", description:d.description||"", budget:d.budget||"", duration:d.duration||"", difficulty:d.difficulty||"Easy", bestTime:d.bestTime||"", rating:d.rating||4.5 }); setShowForm(true); };

  const handleSave = async () => {
    if (editId) {
      setDests(p => p.map(d => d.id === editId ? { ...d, ...form } : d));
      authFetch(`${API}/admin/destinations/${editId}`, { method:"PUT", body: JSON.stringify(form) }).catch(() => {});
    } else {
      const nd = { ...form, id:Date.now(), rating:parseFloat(form.rating) };
      setDests(p => [...p, nd]);
      authFetch(`${API}/admin/destinations`, { method:"POST", body: JSON.stringify(nd) }).catch(() => {});
    }
    setSaved(true); setTimeout(() => { setSaved(false); setShowForm(false); setEditId(null); }, 1000);
  };

  const handleDel = (id) => {
    if (!window.confirm("Delete this destination?")) return;
    setDests(p => p.filter(d => d.id !== id));
    authFetch(`${API}/admin/destinations/${id}`, { method:"DELETE" }).catch(() => {});
  };

  const filtered = dests.filter(d => {
    if (catFilt !== "all" && d.category !== catFilt) return false;
    return !search || d.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations…"
          className="flex-1 min-w-40 bg-earth-50 border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" />
        <select value={catFilt} onChange={e => setCatFilt(e.target.value)}
          className="bg-earth-50 border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <button onClick={openAdd} className="bg-saffron-600 hover:bg-saffron-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
          + Add Destination
        </button>
      </div>

      {showForm && (
        <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-earth-900 mb-4">{editId ? "Edit Destination" : "Add New Destination"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["name","Destination Name","text"],["location","Location (City, State)","text"],["image","Image URL","url"],["budget","Budget Range","text"],["duration","Duration","text"],["bestTime","Best Time to Visit","text"]].map(([k,label,type]) => (
              <div key={k}>
                <label className="block text-earth-700 text-xs font-medium mb-1">{label}</label>
                <input type={type} value={form[k]} onChange={e => up(k, e.target.value)}
                  className="w-full bg-white border border-earth-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400" />
              </div>
            ))}
            <div>
              <label className="block text-earth-700 text-xs font-medium mb-1">Category</label>
              <select value={form.category} onChange={e => up("category", e.target.value)}
                className="w-full bg-white border border-earth-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400">
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-earth-700 text-xs font-medium mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={e => up("difficulty", e.target.value)}
                className="w-full bg-white border border-earth-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400">
                {["Easy","Moderate","Hard"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-earth-700 text-xs font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={e => up("description", e.target.value)} rows={3}
                className="w-full bg-white border border-earth-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-green-600 text-white" : "bg-saffron-600 hover:bg-saffron-500 text-white"}`}>
              {saved ? "✓ Saved!" : "Save"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-5 py-2.5 bg-white border border-earth-200 text-earth-700 rounded-xl text-sm hover:border-earth-400 transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(d => (
          <div key={d.id} className="bg-white rounded-2xl border border-earth-100 shadow-sm overflow-hidden group">
            <div className="relative h-36 overflow-hidden">
              <img src={d.image || "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400"} alt={d.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-2 right-2 bg-white/90 text-earth-700 text-xs px-2 py-1 rounded-full">
                {categories.find(c => c.id === d.category)?.icon} {d.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-earth-900 text-sm truncate">{d.name}</h3>
              <p className="text-earth-500 text-xs mt-0.5 mb-3">📍 {d.location}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(d)} className="flex-1 bg-earth-50 hover:bg-earth-100 text-earth-700 text-xs font-medium py-2 rounded-lg transition-colors">✏️ Edit</button>
                <button onClick={() => handleDel(d.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium py-2 rounded-lg transition-colors">🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Users tab ─────────────────────────────────────────────────────────── */
function UsersTab() {
  const [users, setUsers] = useState([
    { id:1, fullName:"Arjun Sharma",   email:"arjun@example.com",      phone:"9876543210", role:"USER",  createdAt:"2025-10-01", bookings:3 },
    { id:2, fullName:"Priya Nair",      email:"priya@example.com",      phone:"9823456781", role:"USER",  createdAt:"2025-10-05", bookings:1 },
    { id:3, fullName:"Rohit Verma",     email:"rohit@example.com",      phone:"9812345678", role:"USER",  createdAt:"2025-10-10", bookings:2 },
    { id:4, fullName:"Admin",           email:"admin@vtravel.in",    phone:"9999999999", role:"ADMIN", createdAt:"2025-01-01", bookings:0 },
  ]);

  useEffect(() => {
    authFetch(`${API}/admin/users`).then(r => r.ok ? r.json() : null).then(d => { if (d?.length) setUsers(d); }).catch(() => {});
  }, []);

  return (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u.id} className="bg-white rounded-2xl border border-earth-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center font-bold text-saffron-700 flex-shrink-0">{(u.fullName||u.name||"U")[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-earth-900">{u.fullName || u.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${u.role==="ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{u.role}</span>
            </div>
            <div className="text-earth-500 text-sm">{u.email} {u.phone && `· ${u.phone}`}</div>
          </div>
          <div className="text-right text-sm flex-shrink-0">
            <div className="font-semibold text-earth-900">{u.bookings ?? "—"} bookings</div>
            <div className="text-earth-400 text-xs">Joined {u.createdAt?.split("T")[0]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Settings tab ──────────────────────────────────────────────────────── */
function SettingsTab() {
  const [cfg, setCfg] = useState({ siteName:"V_Travel", tagline:"India's Premier Solo Travel Guide", supportEmail:"support@vtravel.in", phone:"+91 98765 00000", currency:"INR (₹)" });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="max-w-xl space-y-6">
      <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-earth-900">Site Configuration</h3>
        {Object.entries(cfg).map(([k,v]) => (
          <div key={k}>
            <label className="block text-earth-700 text-sm font-medium mb-1 capitalize">{k.replace(/([A-Z])/g," $1")}</label>
            <input value={v} onChange={e => setCfg(c => ({ ...c, [k]:e.target.value }))}
              className="w-full bg-earth-50 border border-earth-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" />
          </div>
        ))}
        <button onClick={save}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-green-600 text-white" : "bg-saffron-600 hover:bg-saffron-500 text-white"}`}>
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-6">
        <h3 className="font-semibold text-earth-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Link to="/" target="_blank" className="flex items-center gap-2 px-4 py-3 bg-earth-50 hover:bg-earth-100 rounded-xl text-sm text-earth-700 transition-colors">🌐 View Main Website</Link>
          <Link to="/category/temples" target="_blank" className="flex items-center gap-2 px-4 py-3 bg-earth-50 hover:bg-earth-100 rounded-xl text-sm text-earth-700 transition-colors">🛕 View Temples Category</Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main AdminDashboard ───────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab,      setTab]      = useState("overview");
  const [sidebar,  setSidebar]  = useState(true);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);

  // Fetch all bookings once for the whole dashboard
  useEffect(() => {
    if (!isAdmin) return;
    authFetch(`${API}/admin/bookings`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setBookings(Array.isArray(d) ? d : []))
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [isAdmin]);

  const handleStatusChange = (id, status) => {
    authFetch(`${API}/admin/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDelete = (id) => {
    authFetch(`${API}/admin/bookings/${id}`, { method: "DELETE" }).catch(() => {});
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const tabs = [
    { id:"overview",     label:"Overview",      icon:"📊" },
    { id:"bookings",     label:"Bookings",       icon:"🎫" },
    { id:"destinations", label:"Destinations",   icon:"📍" },
    { id:"users",        label:"Users",          icon:"👥" },
    { id:"settings",     label:"Settings",       icon:"⚙️" },
  ];

  const stats = [
    { icon:"🎫", label:"Total Bookings", value: bookingsLoading ? "…" : bookings.length,                                       color:"border-blue-100"   },
    { icon:"✅", label:"Confirmed",       value: bookingsLoading ? "…" : bookings.filter(b=>b.status==="CONFIRMED").length,    color:"border-green-100"  },
    { icon:"⏳", label:"Pending",         value: bookingsLoading ? "…" : bookings.filter(b=>b.status==="PENDING").length,     color:"border-yellow-100" },
    { icon:"📍", label:"Destinations",    value: allDests.length,                                                               color:"border-saffron-100"},
  ];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-earth-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebar ? "w-56" : "w-16"} flex-shrink-0 bg-earth-900 flex flex-col transition-all duration-300 min-h-screen`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <span className="text-saffron-400 text-xl flex-shrink-0">✦</span>
          {sidebar && <span className="font-display text-white font-bold text-sm">V_Travel</span>}
          <button onClick={() => setSidebar(!sidebar)} className="ml-auto text-white/30 hover:text-white text-xs transition-colors">{sidebar ? "◀" : "▶"}</button>
        </div>
        {sidebar && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Logged in as</div>
            <div className="text-white text-sm font-medium truncate">{user?.name}</div>
            <div className="text-saffron-400 text-xs">Administrator</div>
          </div>
        )}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} title={!sidebar ? t.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab===t.id ? "bg-saffron-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
              <span className="text-base flex-shrink-0">{t.icon}</span>{sidebar && t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-xs transition-all" title={!sidebar?"Main Site":undefined}>
            <span>🌐</span>{sidebar && "Main Site"}
          </Link>
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 text-xs transition-all" title={!sidebar?"Logout":undefined}>
            <span>🚪</span>{sidebar && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-earth-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-display text-xl font-bold text-earth-900">
            {tabs.find(t=>t.id===tab)?.icon} {tabs.find(t=>t.id===tab)?.label}
          </h1>
          <span className="text-earth-400 text-sm hidden sm:block">{new Date().toLocaleDateString("en-IN",{dateStyle:"long"})}</span>
        </header>

        <main className="p-6">
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(s => <Stat key={s.label} {...s} />)}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-5">
                  <h3 className="font-semibold text-earth-900 mb-4">Recent Bookings</h3>
                  {bookingsLoading ? (
                    <div className="text-center py-8 text-earth-400 animate-pulse">Loading…</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-earth-400 text-sm">No bookings yet.</div>
                  ) : (
                  <div className="space-y-3">
                    {bookings.slice(0,5).map(b => (
                      <div key={b.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 text-sm font-bold flex-shrink-0">{(b.customerName||"?")[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-earth-900 text-sm font-medium truncate">{b.customerName}</div>
                          <div className="text-earth-500 text-xs truncate">{b.destination?.name} · from {b.currentLocation}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusCls[b.status]}`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                  )}
                  <button onClick={() => setTab("bookings")} className="mt-4 text-saffron-600 text-sm hover:underline">View all bookings →</button>
                </div>
                <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-5">
                  <h3 className="font-semibold text-earth-900 mb-4">Destinations by Category</h3>
                  <div className="space-y-3">
                    {categories.map((c,i) => {
                      const count = Object.values(localDests)[i]?.length || 0;
                      const pct   = Math.round((count / allDests.length) * 100);
                      return (
                        <div key={c.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-earth-700">{c.icon} {c.label}</span>
                            <span className="text-earth-500">{count}</span>
                          </div>
                          <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
                            <div className="h-full bg-saffron-500 rounded-full" style={{ width:`${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setTab("destinations")} className="mt-4 text-saffron-600 text-sm hover:underline">Manage destinations →</button>
                </div>
              </div>
            </div>
          )}
          {tab === "bookings"     && <BookingsTab bookings={bookings} onStatusChange={handleStatusChange} onDelete={handleDelete} />}
          {tab === "destinations" && <DestinationsTab />}
          {tab === "users"        && <UsersTab />}
          {tab === "settings"     && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
