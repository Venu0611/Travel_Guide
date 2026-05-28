package com.vtravel.controller;

import com.vtravel.model.Destination;
import com.vtravel.model.Review;
import com.vtravel.repository.DestinationRepository;
import com.vtravel.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final DestinationRepository destinationRepository;

    public ReviewController(ReviewRepository reviewRepository, DestinationRepository destinationRepository) {
        this.reviewRepository = reviewRepository;
        this.destinationRepository = destinationRepository;
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long destinationId) {
        return ResponseEntity.ok(
            reviewRepository.findByDestinationIdOrderByCreatedAtDesc(destinationId)
        );
    }

    @PostMapping
    public ResponseEntity<?> submitReview(
            @RequestBody Review review,
            @RequestParam Long destinationId) {
        Destination dest = destinationRepository.findById(destinationId)
            .orElseThrow(() -> new RuntimeException("Destination not found"));
        review.setDestination(dest);
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping("/{destinationId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long destinationId) {
        Double avg = reviewRepository.findAverageRating(destinationId);
        return ResponseEntity.ok(Map.of(
            "destinationId", destinationId,
            "averageRating", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0
        ));
    }
}
