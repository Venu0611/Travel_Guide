package com.vtravel.service;

import com.vtravel.model.Destination;
import com.vtravel.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public List<Destination> getByCategory(String categoryStr) {
        Destination.Category category = Destination.Category.valueOf(categoryStr.toUpperCase());
        return destinationRepository.findByCategoryOrderByRatingDesc(category);
    }

    public Optional<Destination> getById(Long id) {
        return destinationRepository.findById(id);
    }

    public List<Destination> searchDestinations(String keyword) {
        return destinationRepository.searchByKeyword(keyword);
    }

    public List<Destination> getTopRated() {
        return destinationRepository.findTop8ByOrderByRatingDesc();
    }

    public Destination save(Destination destination) {
        return destinationRepository.save(destination);
    }

    public void delete(Long id) {
        destinationRepository.deleteById(id);
    }
}
