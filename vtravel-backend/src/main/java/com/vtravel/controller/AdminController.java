package com.vtravel.controller;

import com.vtravel.model.Booking;
import com.vtravel.model.Destination;
import com.vtravel.model.User;
import com.vtravel.repository.BookingRepository;
import com.vtravel.repository.DestinationRepository;
import com.vtravel.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only REST controller — all routes under /api/admin/**
 * In production protect with Spring Security role-based auth.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookingRepository     bookingRepo;
    private final DestinationRepository destRepo;
    private final UserRepository        userRepo;

    public AdminController(BookingRepository bookingRepo,
                           DestinationRepository destRepo,
                           UserRepository userRepo) {
        this.bookingRepo = bookingRepo;
        this.destRepo    = destRepo;
        this.userRepo    = userRepo;
    }

    // ── Dashboard stats ────────────────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(Map.of(
            "totalBookings",     bookingRepo.count(),
            "pendingBookings",   bookingRepo.countByStatus(Booking.BookingStatus.PENDING),
            "confirmedBookings", bookingRepo.countByStatus(Booking.BookingStatus.CONFIRMED),
            "cancelledBookings", bookingRepo.countByStatus(Booking.BookingStatus.CANCELLED),
            "totalDestinations", destRepo.count(),
            "totalUsers",        userRepo.count()
        ));
    }

    // ── Bookings ───────────────────────────────────────────────────────────
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> allBookings() {
        return ResponseEntity.ok(bookingRepo.findAll());
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return bookingRepo.findById(id).map(b -> {
            b.setStatus(Booking.BookingStatus.valueOf(body.get("status").toUpperCase()));
            return ResponseEntity.ok(bookingRepo.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (!bookingRepo.existsById(id)) return ResponseEntity.notFound().build();
        bookingRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Destinations ───────────────────────────────────────────────────────
    @GetMapping("/destinations")
    public ResponseEntity<List<Destination>> allDests() {
        return ResponseEntity.ok(destRepo.findAll());
    }

    @PostMapping("/destinations")
    public ResponseEntity<Destination> createDest(@RequestBody Destination d) {
        return ResponseEntity.status(201).body(destRepo.save(d));
    }

    @PutMapping("/destinations/{id}")
    public ResponseEntity<Destination> updateDest(@PathVariable Long id, @RequestBody Destination updated) {
        return destRepo.findById(id).map(d -> {
            d.setName(updated.getName());
            d.setLocation(updated.getLocation());
            d.setDescription(updated.getDescription());
            d.setImageUrl(updated.getImageUrl());
            d.setCategory(updated.getCategory());
            d.setBudget(updated.getBudget());
            d.setDuration(updated.getDuration());
            d.setDifficulty(updated.getDifficulty());
            d.setBestTime(updated.getBestTime());
            d.setRating(updated.getRating());
            d.setSoloTips(updated.getSoloTips());
            if (updated.getHighlights() != null) d.setHighlights(updated.getHighlights());
            if (updated.getTags() != null) d.setTags(updated.getTags());
            return ResponseEntity.ok(destRepo.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<Void> deleteDest(@PathVariable Long id) {
        if (!destRepo.existsById(id)) return ResponseEntity.notFound().build();
        destRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Users ──────────────────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userRepo.findById(id).map(u -> {
            u.setRole(User.Role.valueOf(body.get("role").toUpperCase()));
            userRepo.save(u);
            return ResponseEntity.ok(Map.<String, Object>of("id", u.getId(), "email", u.getEmail(), "role", u.getRole()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepo.existsById(id)) return ResponseEntity.notFound().build();
        userRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
