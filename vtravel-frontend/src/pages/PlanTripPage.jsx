import React, { useState } from "react";
import { Link } from "react-router-dom";
import { categories, destinations } from "../data/destinations";
import { createBooking } from "../api/travelApi";
import { useAuth } from "../context/AuthContext";

const steps = ["Preferences", "Destinations", "Details", "Confirm"];

const PlanTripPage = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    category: "",
    destination: "",
    travelDate: "",
    duration: "",
    budget: "",
    accommodation: "",
    specialRequirements: "",
    currentLocation: "",
  });

  // Keep form in sync if user changes (e.g., login redirect back)
  React.useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name:  f.name  || user.name  || "",
        email: f.email || user.email || "",
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user]);

  const update = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const categoryDests = form.category ? destinations[form.category] || [] : [];

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // In production: call createBooking() from travelApi.js
  //   console.log("Trip plan submitted:", form);
  //   setSubmitted(true);
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const destinationName = form.destination;
    // Backend Booking model uses `customerName`, not `name`
    const payload = {
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      travelDate: form.travelDate,
      duration: form.duration,
      budget: form.budget,
      currentLocation: form.currentLocation,
      specialRequirements: form.specialRequirements,
    };
    const response = await createBooking(payload, destinationName);
    console.log("Booking saved:", response.data);
    setSubmitted(true);
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Something went wrong saving your trip. Please try again!");
  }
};


  if (submitted) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-earth-100">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-3xl font-bold text-earth-900 mb-3">You're All Set!</h2>
          <p className="text-earth-600 mb-2">
            Hi <strong>{form.name}</strong>, your trip plan request has been received.
          </p>
          <p className="text-earth-500 text-sm mb-8">
            We'll send a personalised solo travel itinerary to <strong>{form.email}</strong> within 24 hours.
          </p>
          <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-4 text-left mb-8">
            <h4 className="font-semibold text-saffron-800 mb-2 text-sm">Your Plan Summary</h4>
            <ul className="space-y-1 text-sm text-saffron-700">
              <li>📍 {form.destination || "Destination TBD"}</li>
              <li>📅 {form.travelDate || "Date TBD"} · {form.duration}</li>
              <li>💰 Budget: {form.budget}</li>
              <li>🏨 Stay: {form.accommodation}</li>
            </ul>
          </div>
          <Link
            to="/bookings"
            className="block w-full bg-saffron-600 hover:bg-saffron-500 text-white font-semibold py-3 rounded-xl transition-all text-center mb-3"
          >
            View My Bookings 🎫
          </Link>
          <Link
            to="/"
            className="block w-full border border-earth-200 text-earth-700 hover:bg-earth-50 font-semibold py-3 rounded-xl transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero */}
      <div className="hero-gradient pt-24 pb-14 px-4 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
          Plan Your Solo Journey
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Tell us your dream, we'll craft the perfect solo itinerary for you.
        </p>
      </div>

      {/* Stepper */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-earth-200 z-0" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-saffron-500 z-0 transition-all duration-500"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((label, i) => (
            <div key={label} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${i < step ? "bg-saffron-600 text-white" : i === step ? "bg-saffron-600 text-white ring-4 ring-saffron-200" : "bg-white border-2 border-earth-300 text-earth-400"}`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`mt-2 text-xs font-medium ${i <= step ? "text-saffron-700" : "text-earth-400"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-7">
          {/* Step 0: Preferences */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-earth-900 mb-6">
                What kind of journey calls to you?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => update("category", cat.id)}
                    className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 border-2
                      ${form.category === cat.id
                        ? "border-saffron-500 bg-saffron-50"
                        : "border-earth-200 bg-earth-50 hover:border-saffron-300"}`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="font-semibold text-earth-800 text-sm leading-tight">{cat.label}</div>
                    <div className="text-earth-500 text-xs mt-0.5">{cat.tagline}</div>
                    {form.category === cat.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-saffron-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Destination */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-earth-900 mb-2">
                Pick your destination
              </h2>
              <p className="text-earth-500 text-sm mb-6">
                Showing {categoryDests.length} options in{" "}
                <span className="text-saffron-600 font-medium">
                  {categories.find((c) => c.id === form.category)?.label}
                </span>
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {categoryDests.map((dest) => (
                  <label
                    key={dest.id}
                    className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${form.destination === dest.name
                        ? "border-saffron-500 bg-saffron-50"
                        : "border-earth-200 hover:border-saffron-300"}`}
                  >
                    <input
                      type="radio"
                      name="destination"
                      value={dest.name}
                      checked={form.destination === dest.name}
                      onChange={() => update("destination", dest.name)}
                      className="accent-saffron-600"
                    />
                    <img src={dest.image} alt={dest.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-earth-800 text-sm">{dest.name}</div>
                      <div className="text-earth-500 text-xs flex items-center gap-2 mt-0.5">
                        <span>📍 {dest.location}</span>
                        <span>★ {dest.rating}</span>
                        <span>🕐 {dest.duration}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Trip Details */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-earth-900 mb-6">Trip Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">Travel Date *</label>
                    <input
                      type="date"
                      required
                      value={form.travelDate}
                      onChange={(e) => update("travelDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">Duration *</label>
                    <select
                      value={form.duration}
                      onChange={(e) => update("duration", e.target.value)}
                      className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white"
                    >
                      <option value="">Select</option>
                      {["1-2 Days", "3-4 Days", "5-7 Days", "8-10 Days", "10+ Days"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Daily Budget</label>
                  <div className="flex flex-wrap gap-2">
                    {["Under ₹2,000", "₹2,000-₹5,000", "₹5,000-₹10,000", "Above ₹10,000"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => update("budget", b)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                          form.budget === b
                            ? "bg-saffron-600 text-white border-saffron-600"
                            : "border-earth-200 text-earth-700 hover:border-saffron-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Accommodation Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {["Budget Hostel", "Guesthouse", "Homestay", "Mid-range Hotel", "Luxury Resort"].map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => update("accommodation", a)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                          form.accommodation === a
                            ? "bg-saffron-600 text-white border-saffron-600"
                            : "border-earth-200 text-earth-700 hover:border-saffron-400"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Special Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Dietary needs, physical limitations, must-see spots, anything else..."
                    value={form.specialRequirements}
                    onChange={(e) => update("specialRequirements", e.target.value)}
                    className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-400 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact + Confirm */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="font-display text-2xl font-bold text-earth-900 mb-6">Almost there!</h2>

              {/* Summary */}
              <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-4 mb-6 text-sm space-y-1">
                <div className="font-semibold text-saffron-800 mb-2">Your Plan Summary</div>
                <div className="text-saffron-700 grid grid-cols-2 gap-y-1">
                  <span>Category:</span><span className="font-medium">{categories.find(c=>c.id===form.category)?.label}</span>
                  <span>Destination:</span><span className="font-medium">{form.destination}</span>
                  <span>Date:</span><span className="font-medium">{form.travelDate}</span>
                  <span>Duration:</span><span className="font-medium">{form.duration}</span>
                  <span>Budget/day:</span><span className="font-medium">{form.budget}</span>
                  <span>Stay:</span><span className="font-medium">{form.accommodation}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Full Name *</label>
                  <input
                    required type="text" placeholder="Your full name"
                    value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Email *</label>
                  <input
                    required type="email" placeholder="you@example.com"
                    value={form.email} onChange={(e) => update("email", e.target.value)}
                    className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Phone (optional)</label>
                  <input
                    type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Current Location / City *</label>
                  <input
                    required type="text" placeholder="e.g. Hyderabad, Bangalore, Delhi"
                    value={form.currentLocation} onChange={(e) => update("currentLocation", e.target.value)}
                    className="w-full border border-earth-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-saffron-600 hover:bg-saffron-500 text-white font-semibold py-3.5 rounded-xl transition-all text-base"
              >
                Submit My Trip Plan ✈️
              </button>
            </form>
          )}

          {/* Navigation buttons */}
          {step < 3 && (
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-5 py-2.5 border border-earth-200 rounded-xl text-earth-700 hover:bg-earth-50 text-sm font-medium transition-all"
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={
                  (step === 0 && !form.category) ||
                  (step === 1 && !form.destination) ||
                  (step === 2 && (!form.travelDate || !form.duration))
                }
                className="px-6 py-2.5 bg-saffron-600 hover:bg-saffron-500 disabled:bg-earth-200 disabled:text-earth-400 text-white rounded-xl text-sm font-medium transition-all"
              >
                Continue →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

export default PlanTripPage;
