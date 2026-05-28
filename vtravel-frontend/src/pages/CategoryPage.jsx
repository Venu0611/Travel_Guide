import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categories, destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const category = categories.find((c) => c.id === categoryId);
  const allDests = destinations[categoryId] || [];

  const tags = ["All", ...new Set(allDests.flatMap((d) => d.tags))];

  const filtered = allDests
    .filter((d) => filter === "All" || d.tags.includes(filter))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-earth-800 mb-3">Category not found</h2>
          <Link to="/" className="text-saffron-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ─── Hero Banner ────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-br ${category.gradient} pt-24 pb-16 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{category.label}</span>
          </div>
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="font-display text-5xl font-bold text-white mb-3">
            {category.label}
          </h1>
          <p className="text-white/70 text-xl max-w-xl">{category.tagline}</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80 text-sm">
            <span>✦</span>
            <span>{allDests.length} curated destinations for solo travellers</span>
          </div>
        </div>
      </div>

      {/* ─── Filters ────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-earth-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  filter === tag
                    ? "bg-saffron-600 text-white shadow-sm"
                    : "bg-earth-100 text-earth-700 hover:bg-earth-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-earth-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-earth-200 rounded-lg px-3 py-1.5 text-sm text-earth-700 bg-white focus:outline-none focus:border-saffron-400"
            >
              <option value="rating">Highest Rated</option>
              <option value="name">A – Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Destinations Grid ──────────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-earth-500 text-lg">No destinations match this filter.</p>
              <button onClick={() => setFilter("All")} className="mt-3 text-saffron-600 hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
