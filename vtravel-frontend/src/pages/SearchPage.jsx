import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { destinations, categories } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";

// Pre-compute once outside the component to avoid recreation on every render
const allDestinations = Object.entries(destinations).flatMap(([catId, dests]) =>
  dests.map((d) => ({ ...d, categoryId: catId }))
);

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = allDestinations.filter(
      (d) =>
        d.name.toLowerCase().includes(lower) ||
        d.location.toLowerCase().includes(lower) ||
        d.description.toLowerCase().includes(lower) ||
        d.tags.some((t) => t.toLowerCase().includes(lower))
    );
    setResults(filtered);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query });
  };

  const filtered =
    activeCategory === "all"
      ? results
      : results.filter((d) => d.categoryId === activeCategory);

  const q = searchParams.get("q");

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Header */}
      <div className="bg-earth-900 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-white mb-6 text-center">
            {q ? `Results for "${q}"` : "Search Destinations"}
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search temples, hills, forests, beaches..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-saffron-400 transition-all"
            />
            <button
              type="submit"
              className="bg-saffron-600 hover:bg-saffron-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {!q ? (
          /* No query yet — show popular tags */
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="font-display text-2xl text-earth-800 mb-3">What are you looking for?</h2>
            <p className="text-earth-500 mb-8">Try searching for a destination, state, or activity</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Goa", "Kerala", "Himalaya", "Temple", "Waterfall", "Beach", "Safari", "Trek"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); setSearchParams({ q: tag }); }}
                  className="bg-white border border-earth-200 hover:border-saffron-400 hover:text-saffron-700 text-earth-700 px-4 py-2 rounded-full text-sm transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="font-display text-2xl text-earth-800 mb-2">No results found</h2>
            <p className="text-earth-500 mb-6">Try different keywords or browse by category</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="bg-white border border-earth-200 hover:border-saffron-400 text-earth-700 px-4 py-2 rounded-full text-sm transition-all flex items-center gap-1.5"
                >
                  <span>{cat.icon}</span> {cat.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "bg-saffron-600 text-white" : "bg-white border border-earth-200 text-earth-700 hover:border-saffron-400"}`}
              >
                All ({results.length})
              </button>
              {categories.map((cat) => {
                const count = results.filter((d) => d.categoryId === cat.id).length;
                if (!count) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-saffron-600 text-white" : "bg-white border border-earth-200 text-earth-700 hover:border-saffron-400"}`}
                  >
                    {cat.icon} {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            <p className="text-earth-500 text-sm mb-6">
              {filtered.length} destination{filtered.length !== 1 ? "s" : ""} found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
