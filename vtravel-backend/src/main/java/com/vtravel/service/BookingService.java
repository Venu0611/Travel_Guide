package com.vtravel.service;

import com.vtravel.model.Booking;
import com.vtravel.model.Destination;
import com.vtravel.repository.BookingRepository;
import com.vtravel.repository.DestinationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final DestinationRepository destinationRepo;

    public BookingService(BookingRepository bookingRepo, DestinationRepository destinationRepo) {
        this.bookingRepo = bookingRepo;
        this.destinationRepo = destinationRepo;
    }

    public Booking createBooking(Booking booking, String destinationName) {
        Destination dest = destinationRepo.findByNameIgnoreCase(destinationName)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Destination not found: " + destinationName));
        booking.setDestination(dest);
        booking.setStatus(Booking.BookingStatus.PENDING);
        return bookingRepo.save(booking);
    }

    public Optional<Booking> getById(Long id) {
        return bookingRepo.findById(id);
    }

    public List<Booking> getByEmail(String email) {
        return bookingRepo.findByEmailOrderByCreatedAtDesc(email);
    }

    public Booking updateStatus(Long id, Booking.BookingStatus status) {
        Booking booking = bookingRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id));
        booking.setStatus(status);
        return bookingRepo.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public void deleteBooking(Long id) {
        if (!bookingRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id);
        }
        bookingRepo.deleteById(id);
    }
}
