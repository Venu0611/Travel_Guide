import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../api/travelApi";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export default function LoginPage() {
  const [tab,     setTab]     = useState("login");
  const [form,    setForm]    = useState({ fullName:"", email:"", phone:"", password:"", confirm:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || "/";

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser(form.email, form.password);
      login(data);  // stores user + token
      navigate(data.role === "ADMIN" ? "/admin" : from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6)       { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { data } = await registerUser({
        fullName: form.fullName,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      });
      login(data);  // backend returns token on register too
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-saffron-400 focus:bg-white/15 transition-all";

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-forest-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-saffron-400 text-3xl">✦</span>
            <span className="font-display text-2xl font-bold text-white tracking-wide">V_Travel</span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">India's Premier Solo Travel Guide</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex bg-white/10 rounded-2xl p-1 mb-7">
            {[["login","Sign In"],["register","Create Account"]].map(([id,label]) => (
              <button key={id} onClick={() => { setTab(id); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === id ? "bg-saffron-600 text-white shadow" : "text-gray-400 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">⚠️ {error}</div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
                <input type="email" required value={form.email} onChange={e => up("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
                <input type="password" required value={form.password} onChange={e => up("password", e.target.value)} placeholder="Your password" className={inputCls} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-saffron-600 hover:bg-saffron-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-1">
                {loading ? "Signing in…" : "Sign In →"}
              </button>
              <p className="text-center text-xs text-gray-500 pt-1">
                Demo admin: <span className="text-saffron-400">admin@vtravel.in / admin123</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {[["fullName","Full Name","text","Arjun Sharma"],["email","Email Address","email","you@example.com"],["phone","Phone Number","tel","+91 98765 43210"]].map(([k,label,type,ph]) => (
                <div key={k}>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">{label}</label>
                  <input type={type} required={k !== "phone"} value={form[k]} onChange={e => up(k, e.target.value)} placeholder={ph} className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
                <input type="password" required minLength={6} value={form.password} onChange={e => up("password", e.target.value)} placeholder="Min. 6 characters" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Confirm Password</label>
                <input type="password" required value={form.confirm} onChange={e => up("confirm", e.target.value)} placeholder="Repeat password" className={inputCls} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-saffron-600 hover:bg-saffron-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-1">
                {loading ? "Creating account…" : "Create Account →"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link to="/" className="text-saffron-400 hover:text-saffron-300 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
