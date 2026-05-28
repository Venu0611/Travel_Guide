package com.vtravel.repository;

import com.vtravel.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /** All bookings for a user, newest first */
    List<Booking> findByEmailOrderByCreatedAtDesc(String email);

    /** Upcoming (travel date >= today, not cancelled) */
    @Query("SELECT b FROM Booking b WHERE b.email = :email AND b.status <> 'CANCELLED' AND b.travelDate >= :today ORDER BY b.travelDate ASC")
    List<Booking> findUpcomingByEmail(@Param("email") String email, @Param("today") LocalDate today);

    /** Completed (travel date < today, not cancelled) */
    @Query("SELECT b FROM Booking b WHERE b.email = :email AND b.status <> 'CANCELLED' AND b.travelDate < :today ORDER BY b.travelDate DESC")
    List<Booking> findCompletedByEmail(@Param("email") String email, @Param("today") LocalDate today);

    /** Cancelled bookings */
    List<Booking> findByEmailAndStatusOrderByCreatedAtDesc(String email, Booking.BookingStatus status);

    /** Count by status */
    long countByStatus(Booking.BookingStatus status);

    /** Admin: find by status */
    List<Booking> findByStatusOrderByCreatedAtDesc(Booking.BookingStatus status);
}
