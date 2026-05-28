import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/destinations";

const team = [
  { name: "Priya Nair", role: "Founder & Solo Travel Expert", trips: "47 destinations", emoji: "👩‍💼", from: "Kerala" },
  { name: "Rahul Verma", role: "Content & Photography Lead", trips: "38 destinations", emoji: "📸", from: "Delhi" },
  { name: "Ananya Iyer", role: "Itinerary Specialist", trips: "29 destinations", emoji: "🗺️", from: "Chennai" },
];

const faqs = [
  { q: "Is solo travel in India safe?", a: "Yes, absolutely — with proper preparation. India is generally very welcoming to solo travellers. Stick to well-reviewed accommodations, share your itinerary with someone back home, keep emergency numbers handy, and trust your instincts. Our destination guides include specific safety tips." },
  { q: "How do I use V_Travel to plan my trip?", a: 'Browse by category or use the search to find your destination. Each page has curated highlights, solo travel tips, best time to visit, and a budget estimate. Use the "Plan My Trip" form and our team will send you a personalised itinerary within 24 hours.' },
  { q: "Do you offer guided solo tours?", a: "We specialise in helping you travel independently, but we can connect you with vetted local guides for specific activities like trekking, safaris, or temple tours. Contact us for details." },
  { q: "What is the best season to visit India?", a: "It depends on the region! Generally Oct–Mar is best for most of India. Himalayan destinations are best May–Sep. Monsoon (Jun–Sep) is magical for waterfalls and forests but can disrupt travel. Each destination page lists the ideal window." },
];

const AboutPage = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <div className="hero-gradient pt-28 pb-20 px-4 text-center">
      <span className="text-saffron-400 text-3xl">✦</span>
      <h1 className="font-display text-5xl font-bold text-white mt-4 mb-4">Our Story</h1>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
        V_Travel was born on a solo train journey from Chennai to Varanasi. We believe
        the most transformative travel is done alone — and we exist to make it easier, safer,
        and more magical for every solo adventurer in India.
      </p>
    </div>

    {/* Mission */}
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🛕", title: "Curated with Love", desc: "Every destination is personally visited and vetted by our solo travellers — no generic lists." },
            { icon: "🎒", title: "Built for Solo", desc: "All guides are designed specifically for one. Safety tips, solo-friendly stays, and honest budgets." },
            { icon: "🌏", title: "Deeply Indian", desc: "We focus exclusively on India's incredible diversity — 4 worlds, 24+ destinations, infinite stories." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-6">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-display text-xl font-bold text-earth-900 mb-2">{title}</h3>
              <p className="text-earth-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Categories covered */}
    <section className="py-16 px-4 bg-earth-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-earth-900 text-center mb-10">What We Cover</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`bg-gradient-to-br ${cat.gradient} rounded-2xl p-5 text-center group card-hover`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-white text-sm">{cat.label}</div>
              <div className="text-white/60 text-xs mt-1 group-hover:text-white/80 transition-colors">
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-earth-900 text-center mb-10">The V_Travel Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map(({ name, role, trips, emoji, from }) => (
            <div key={name} className="bg-earth-50 rounded-2xl p-6 text-center border border-earth-100">
              <div className="text-5xl mb-3">{emoji}</div>
              <h3 className="font-semibold text-earth-900">{name}</h3>
              <p className="text-earth-500 text-sm">{role}</p>
              <div className="mt-3 flex justify-center gap-3 text-xs">
                <span className="bg-saffron-100 text-saffron-800 px-2 py-1 rounded-full">{trips}</span>
                <span className="bg-earth-200 text-earth-700 px-2 py-1 rounded-full">From {from}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-16 px-4 bg-earth-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-earth-900 text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <details key={q} className="bg-white rounded-2xl border border-earth-100 group">
              <summary className="px-5 py-4 font-semibold text-earth-800 cursor-pointer flex justify-between items-center text-sm list-none">
                {q}
                <span className="text-saffron-500 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <div className="px-5 pb-4 text-earth-600 text-sm leading-relaxed border-t border-earth-100 pt-3">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-4 bg-earth-900 text-center">
      <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Wander?</h2>
      <p className="text-gray-400 mb-7">Start planning your solo India adventure today.</p>
      <Link
        to="/plan"
        className="inline-block bg-saffron-600 hover:bg-saffron-500 text-white font-semibold px-8 py-3.5 rounded-full transition-all text-base"
      >
        Plan My Trip →
      </Link>
    </section>
  </div>
);

export default AboutPage;
