import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-earth-900 text-gray-300 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-saffron-400 text-2xl">✦</span>
            <span className="font-display text-xl font-bold text-white">V_Travel</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            India's premier solo travel guide. Discover sacred temples, misty hills,
            primal forests, and pristine shores — your journey, your pace.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-saffron-600 rounded-full flex items-center justify-center text-sm transition-all" aria-label="Instagram">📸</a>
            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-saffron-600 rounded-full flex items-center justify-center text-sm transition-all" aria-label="Twitter">🐦</a>
            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-saffron-600 rounded-full flex items-center justify-center text-sm transition-all" aria-label="YouTube">▶️</a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "🛕 Famous Temples", path: "/category/temples" },
              { label: "⛰️ Hill Stations",  path: "/category/hills" },
              { label: "🌿 Forests & Waterfalls", path: "/category/forests" },
              { label: "🏖️ Beaches",         path: "/category/beaches" },
              { label: "🔍 Search All",      path: "/search" },
            ].map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="hover:text-saffron-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Plan & Info */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Plan & Info</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Plan My Trip",    path: "/plan" },
              { label: "My Bookings",     path: "/bookings" },
              { label: "About V_Travel", path: "/about" },
              { label: "Solo Travel Tips", path: "/about#tips" },
              { label: "Safety Guide",    path: "/about#faq" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="hover:text-saffron-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📧</span>
              <a href="mailto:hello@vtravel.in" className="hover:text-saffron-400 transition-colors break-all">
                gollapallyvenu254@org.in
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📞</span>
              <span>+91 63042-59432</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>Hyderabad, Telangana, India</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">🕐</span>
              <span>Mon–Sat, 9am – 6pm IST</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-earth-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          © 2024 V_Travel Agency. All rights reserved. Made with ❤️ for Solo Travellers across India.
        </p>
        <div className="flex gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
