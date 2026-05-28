import React from "react";
import { Link } from "react-router-dom";

const difficultyColor = {
  Easy: "bg-green-100 text-green-800",
  Moderate: "bg-yellow-100 text-yellow-800",
  Challenging: "bg-red-100 text-red-800",
};

const DestinationCard = ({ destination }) => {
  const { id, name, location, image, rating, duration, bestTime, difficulty, description, tags, budget } = destination;

  return (
    <Link to={`/destination/${id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md card-hover border border-earth-200">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-earth-800 font-semibold text-sm">{rating}</span>
          </div>

          {/* Difficulty */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColor[difficulty]}`}>
            {difficulty}
          </div>

          {/* Location */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            <span className="text-white/80 text-xs">📍</span>
            <span className="text-white text-xs font-medium">{location}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-earth-900 mb-1 group-hover:text-saffron-600 transition-colors leading-tight">
            {name}
          </h3>
          <p className="text-earth-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-earth-500 mb-3">
            <span className="flex items-center gap-1">
              <span>🕐</span> {duration}
            </span>
            <span className="flex items-center gap-1">
              <span>📅</span> {bestTime}
            </span>
            <span className="flex items-center gap-1">
              <span>💰</span> {budget.split(/[–-]/)[0].trim()}+
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-saffron-50 text-saffron-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-4 pb-4">
          <div className="border-t border-earth-100 pt-3 flex items-center justify-between">
            <span className="text-saffron-600 text-sm font-semibold">{budget}</span>
            <span className="text-saffron-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
