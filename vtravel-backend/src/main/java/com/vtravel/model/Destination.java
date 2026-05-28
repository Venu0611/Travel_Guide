package com.vtravel.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    private Double rating;
    private String duration;
    private String bestTime;
    private String difficulty;
    private String budget;

    @Column(length = 2000)
    private String soloTips;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "destination_highlights", joinColumns = @JoinColumn(name = "destination_id"))
    @Column(name = "highlight")
    private List<String> highlights;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "destination_tags", joinColumns = @JoinColumn(name = "destination_id"))
    @Column(name = "tag")
    private List<String> tags;

    public enum Category { TEMPLES, HILLS, FORESTS, BEACHES }

    public Destination() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getBestTime() { return bestTime; }
    public void setBestTime(String bestTime) { this.bestTime = bestTime; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }
    public String getSoloTips() { return soloTips; }
    public void setSoloTips(String soloTips) { this.soloTips = soloTips; }
    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Destination d = new Destination();
        public Builder name(String v) { d.name = v; return this; }
        public Builder location(String v) { d.location = v; return this; }
        public Builder description(String v) { d.description = v; return this; }
        public Builder imageUrl(String v) { d.imageUrl = v; return this; }
        public Builder category(Category v) { d.category = v; return this; }
        public Builder rating(Double v) { d.rating = v; return this; }
        public Builder duration(String v) { d.duration = v; return this; }
        public Builder bestTime(String v) { d.bestTime = v; return this; }
        public Builder difficulty(String v) { d.difficulty = v; return this; }
        public Builder budget(String v) { d.budget = v; return this; }
        public Builder soloTips(String v) { d.soloTips = v; return this; }
        public Builder highlights(List<String> v) { d.highlights = v; return this; }
        public Builder tags(List<String> v) { d.tags = v; return this; }
        public Destination build() { return d; }
    }
}
