package com.vtravel.controller;

import com.vtravel.model.Booking;
import com.vtravel.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /** POST /api/bookings?destinationName=... — Create a new booking */
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody Booking booking,
            @RequestParam String destinationName) {
        return ResponseEntity.ok(bookingService.createBooking(booking, destinationName));
    }

    /** GET /api/bookings/{id} — Get booking by ID (for Trip Details page) */
    @GetMapping("/{id:\\d+}")
    @Transactional(readOnly = true)
    public ResponseEntity<Booking> getById(@PathVariable Long id) {
        return bookingService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/bookings?email=... — Get all bookings for a user (My Bookings page) */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Booking>> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(bookingService.getByEmail(email));
    }

    /** PATCH /api/bookings/{id}/status — Update status (confirm / cancel) */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.getOrDefault("status", "").toUpperCase().trim();
        try {
            Booking.BookingStatus status = Booking.BookingStatus.valueOf(statusStr);
            return ResponseEntity.ok(bookingService.updateStatus(id, status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /** GET /api/bookings/all — Admin: all bookings */
    @GetMapping("/all")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /** DELETE /api/bookings/{id} — Admin: delete a booking */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
