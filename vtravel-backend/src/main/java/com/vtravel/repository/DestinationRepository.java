package com.vtravel.repository;

import com.vtravel.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    List<Destination> findByCategory(Destination.Category category);

    List<Destination> findByCategoryOrderByRatingDesc(Destination.Category category);

    @Query("SELECT d FROM Destination d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Destination> searchByKeyword(@Param("keyword") String keyword);

    List<Destination> findTop8ByOrderByRatingDesc();

    List<Destination> findByDifficulty(String difficulty);

    /** Used by BookingService — exact name match */
    Optional<Destination> findByName(String name);

    /** Case-insensitive name match (preferred) */
    Optional<Destination> findByNameIgnoreCase(String name);
}
