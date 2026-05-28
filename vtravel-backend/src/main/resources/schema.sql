-- ─────────────────────────────────────────────────────────────────────────────
-- V_Travel Agency — MySQL Database Schema
-- Run this once to create the database before starting Spring Boot
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS vtravel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vtravel_db;

-- ─── Destinations Table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS destinations (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200)  NOT NULL,
  location    VARCHAR(200)  NOT NULL,
  description TEXT,
  image_url   VARCHAR(500),
  category    ENUM('TEMPLES','HILLS','FORESTS','BEACHES') NOT NULL,
  rating      DECIMAL(3,1),
  duration    VARCHAR(50),
  best_time   VARCHAR(100),
  difficulty  VARCHAR(20),
  budget      VARCHAR(100),
  solo_tips   TEXT
);

-- ─── Destination Highlights (one-to-many) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS destination_highlights (
  destination_id BIGINT NOT NULL,
  highlight      VARCHAR(300),
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- ─── Destination Tags ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS destination_tags (
  destination_id BIGINT NOT NULL,
  tag            VARCHAR(100),
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- ─── Bookings Table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  role       ENUM('USER','ADMIN') DEFAULT 'USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default admin user (password: admin123)
INSERT IGNORE INTO users (full_name, email, password, phone, role)
VALUES ('Admin', 'admin@vtravel.in', 'admin123', '9999999999', 'ADMIN');

CREATE TABLE IF NOT EXISTS bookings (
  id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_name        VARCHAR(100) NOT NULL,
  email                VARCHAR(150) NOT NULL,
  phone                VARCHAR(20),
  current_location     VARCHAR(200),
  destination_id       BIGINT NOT NULL,
  travel_date          DATE NOT NULL,
  duration             VARCHAR(50),
  budget               VARCHAR(100),
  special_requirements TEXT,
  status               ENUM('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

-- ─── Sample Data: Temples ─────────────────────────────────────────────────────
INSERT INTO destinations (name, location, description, image_url, category, rating, duration, best_time, difficulty, budget, solo_tips)
VALUES
('Varanasi Kashi Vishwanath', 'Varanasi, Uttar Pradesh',
 'One of the world''s oldest living cities — the spiritual heartbeat of India.',
 'https://images.unsplash.com/photo-1561361058-c24e01b9b8d4?w=600',
 'TEMPLES', 4.9, '2-3 Days', 'Oct – Mar', 'Easy', '₹2,000 – ₹5,000 / day',
 'Book a guesthouse near Assi Ghat. The early morning aarti is magical when experienced alone.'),

('Meenakshi Amman Temple', 'Madurai, Tamil Nadu',
 'A masterpiece of Dravidian architecture with towering gopurams adorned with thousands of sculpted figures.',
 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600',
 'TEMPLES', 4.8, '1-2 Days', 'Nov – Feb', 'Easy', '₹1,500 – ₹3,500 / day',
 'Visit during the evening ceremony for a transformative experience.');

-- Add highlights for first destination
INSERT INTO destination_highlights (destination_id, highlight) VALUES
(1, 'Ganga Aarti at Dashashwamedh Ghat'),
(1, 'Sunrise boat ride on the Ganges'),
(1, 'Kashi Vishwanath Temple inner sanctum'),
(1, 'Ancient narrow lanes of the old city');

INSERT INTO destination_tags (destination_id, tag) VALUES
(1, 'Spiritual'), (1, 'UNESCO Heritage'), (1, 'Photography');

-- ─── Sample Data: Hill Stations ──────────────────────────────────────────────
INSERT INTO destinations (name, location, description, image_url, category, rating, duration, best_time, difficulty, budget, solo_tips)
VALUES
('Munnar', 'Idukki, Kerala',
 'Rolling emerald tea plantations stretching to the horizon — Kerala''s crown jewel.',
 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600',
 'HILLS', 4.8, '3-4 Days', 'Sep – Mar', 'Easy', '₹2,000 – ₹5,000 / day',
 'Rent a scooter for complete freedom. Stay in a plantation homestay for authentic experience.');

-- ─── Sample Data: Forests & Waterfalls ───────────────────────────────────────
INSERT INTO destinations (name, location, description, image_url, category, rating, duration, best_time, difficulty, budget, solo_tips)
VALUES
('Athirapally Waterfalls', 'Thrissur, Kerala',
 'Kerala''s Niagara — 80-foot cascades thunder through the Sholayar rainforest.',
 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=600',
 'FORESTS', 4.8, '1-2 Days', 'Jun – Jan', 'Easy', '₹2,000 – ₹4,000 / day',
 'Visit on a weekday to avoid crowds. Carry insect repellent.');

-- ─── Sample Data: Beaches ────────────────────────────────────────────────────
INSERT INTO destinations (name, location, description, image_url, category, rating, duration, best_time, difficulty, budget, solo_tips)
VALUES
('Radhanagar Beach', 'Havelock, Andaman Islands',
 'Consistently ranked Asia''s best beach — pristine powder-white sand with impossibly clear water.',
 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=600',
 'BEACHES', 5.0, '5-7 Days', 'Nov – May', 'Easy', '₹3,000 – ₹8,000 / day',
 'Stay at Neil Island for a quieter experience. Scuba dive at Elephant Beach.');

SELECT 'V_Travel DB setup complete!' AS status;
