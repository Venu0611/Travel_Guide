package com.vtravel;

import com.vtravel.model.Destination;
import com.vtravel.model.Destination.Category;
import com.vtravel.model.User;
import com.vtravel.repository.DestinationRepository;
import com.vtravel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.logging.Logger;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = Logger.getLogger(DataLoader.class.getName());
    private final DestinationRepository repo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(DestinationRepository repo,
                      UserRepository userRepo,
                      PasswordEncoder passwordEncoder) {
        this.repo            = repo;
        this.userRepo        = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        if (repo.count() > 0) {
            log.info("Database already seeded — skipping DataLoader.");
            return;
        }
        log.info("Seeding V_Travel database...");
        seedTemples();
        seedHills();
        seedForests();
        seedBeaches();
        log.info("Seeded " + repo.count() + " destinations successfully.");
    }

    private void seedAdminUser() {
        if (!userRepo.existsByEmail("admin@vtravel.in")) {
            User admin = new User();
            admin.setFullName("V_Travel Admin");
            admin.setEmail("admin@vtravel.in");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepo.save(admin);
            log.info("Admin user created: admin@vtravel.in");
        }
    }

    private void seedTemples() {
        repo.saveAll(List.of(
            dest("Varanasi Kashi Vishwanath", "Varanasi, Uttar Pradesh",
                "One of the world's oldest living cities and the spiritual heartbeat of India.",
                "https://images.unsplash.com/photo-1561361058-c24e01b9b8d4?w=600",
                Category.TEMPLES, 4.9, "2-3 Days", "Oct - Mar", "Easy", "Rs.2,000 - Rs.5,000 / day",
                "Book a guesthouse near Assi Ghat. The early morning aarti is magical when experienced alone.",
                List.of("Ganga Aarti at Dashashwamedh Ghat","Sunrise boat ride","Kashi Vishwanath Temple","Ancient narrow lanes"),
                List.of("Spiritual","UNESCO Heritage","Photography")),

            dest("Meenakshi Amman Temple", "Madurai, Tamil Nadu",
                "A masterpiece of Dravidian architecture with towering gopurams adorned with thousands of sculpted figures.",
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600",
                Category.TEMPLES, 4.8, "1-2 Days", "Nov - Feb", "Easy", "Rs.1,500 - Rs.3,500 / day",
                "Visit during the evening ceremony. The Temple Art Museum is often skipped - take your time there.",
                List.of("14 towering gopurams","Golden Lotus Tank","Evening pooja ritual","Temple Museum"),
                List.of("Architecture","Culture","Dravidian Art")),

            dest("Brihadeeswarar Temple", "Thanjavur, Tamil Nadu",
                "The magnificent 1000-year-old Chola masterpiece whose 66-meter vimana casts no shadow at noon.",
                "https://images.unsplash.com/photo-1592395051246-64b5bdd2e494?w=600",
                Category.TEMPLES, 4.9, "1 Day", "Oct - Mar", "Easy", "Rs.1,500 - Rs.3,000 / day",
                "Arrive at noon to witness the famous no-shadow phenomenon.",
                List.of("66m Vimana tower","No-shadow phenomenon","Chola-era frescoes","Nandi sculpture"),
                List.of("UNESCO","Architecture","History")),

            dest("Kedarnath Temple", "Rudraprayag, Uttarakhand",
                "A sacred Shiva shrine at 3,583m in the Himalayas, accessible only by a 16km trek.",
                "https://images.unsplash.com/photo-1612438214708-f428a707dd4e?w=600",
                Category.TEMPLES, 5.0, "3-4 Days", "May - Jun, Sep - Oct", "Challenging", "Rs.3,000 - Rs.8,000 / day",
                "Start your trek at 4am to avoid crowds and catch sunrise over the snow peaks.",
                List.of("16km Himalayan trek","Ancient stone temple","Vasuki Tal lake","Helicopter option"),
                List.of("Trekking","Himalayan","Spiritual","Adventure")),

            dest("Hampi Virupaksha Temple", "Hampi, Karnataka",
                "A living temple amidst a UNESCO World Heritage Site of boulder-strewn ruins.",
                "https://images.unsplash.com/photo-1600100397608-4de6c5db9979?w=600",
                Category.TEMPLES, 4.7, "2-3 Days", "Oct - Feb", "Easy", "Rs.1,500 - Rs.3,000 / day",
                "Rent a bicycle to explore the vast ruins. Sunrise from Matanga Hill is unforgettable.",
                List.of("Virupaksha Temple","Matanga Hill sunrise","Vittala Temple chariot","Tungabhadra river"),
                List.of("UNESCO","Ruins","History","Cycling")),

            dest("Golden Temple", "Amritsar, Punjab",
                "The holiest Sikh shrine — a golden sanctuary floating serenely in the sacred Amrit Sarovar.",
                "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
                Category.TEMPLES, 5.0, "1-2 Days", "Oct - Mar", "Easy", "Rs.1,500 - Rs.3,000 / day",
                "The langar (free community kitchen) serves 100,000 people daily. Volunteer to help serve.",
                List.of("Harmandir Sahib darshan","Langar experience","Jallianwala Bagh","Wagah Border ceremony"),
                List.of("Sikhism","Spiritual","Free Entry","Community")),

            dest("Somnath Temple", "Gir Somnath, Gujarat",
                "The first of twelve Jyotirlinga shrines, rebuilt seven times, standing eternal on the Arabian Sea coast.",
                "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600",
                Category.TEMPLES, 4.8, "1-2 Days", "Oct - Mar", "Easy", "Rs.1,500 - Rs.3,500 / day",
                "The Sound and Light show in the evening beautifully narrates the temple's history.",
                List.of("Jyotirlinga shrine","Sound & Light show","Bhalka Tirth","Somnath beach"),
                List.of("Jyotirlinga","Coastal","History","Spiritual"))
        ));
    }

    private void seedHills() {
        repo.saveAll(List.of(
            dest("Munnar Tea Hills", "Munnar, Kerala",
                "Rolling emerald hills carpeted in tea estates, with cool mist and the fragrance of cardamom.",
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600",
                Category.HILLS, 4.7, "2-3 Days", "Sep - Mar", "Easy", "Rs.2,000 - Rs.5,000 / day",
                "Rent a scooter and explore the tea estates on your own. The Top Station viewpoint is worth the climb.",
                List.of("Tea estate walks","Eravikulam National Park","Top Station viewpoint","Attukal Waterfalls"),
                List.of("Tea Gardens","Nature","Photography","Misty")),

            dest("Coorg Coffee Country", "Kodagu, Karnataka",
                "The Scotland of India — misty hills, coffee plantations, and cascading waterfalls.",
                "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=600",
                Category.HILLS, 4.8, "2-3 Days", "Oct - Mar", "Easy", "Rs.2,500 - Rs.6,000 / day",
                "Stay at a homestay inside a coffee plantation. Most offer free estate tours with meals.",
                List.of("Abbey Falls","Dubare Elephant Camp","Raja's Seat","Coffee estate stay"),
                List.of("Coffee","Waterfalls","Plantation","Relaxing")),

            dest("Spiti Valley", "Lahaul & Spiti, Himachal Pradesh",
                "A cold desert mountain valley — one of the highest inhabited places on Earth.",
                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
                Category.HILLS, 4.9, "7-10 Days", "Jun - Sep", "Challenging", "Rs.3,000 - Rs.7,000 / day",
                "Acclimatize at Shimla or Manali for 2 days before entering. Carry cash — no ATMs in the valley.",
                List.of("Key Monastery","Chandratal Lake","Dhankar Gompa","Kibber village"),
                List.of("High Altitude","Monastery","Adventure","Remote")),

            dest("Ooty Nilgiris", "Ooty, Tamil Nadu",
                "The Queen of Hill Stations — colonial charm, rose gardens, and the iconic toy train.",
                "https://images.unsplash.com/photo-1580974928064-f0aeef70895a?w=600",
                Category.HILLS, 4.5, "2-3 Days", "Apr - Jun, Sep - Nov", "Easy", "Rs.1,500 - Rs.4,000 / day",
                "Take the Nilgiri Mountain Railway — a UNESCO heritage train. Book tickets in advance.",
                List.of("Nilgiri Mountain Railway","Botanical Garden","Doddabetta Peak","Pykara Lake"),
                List.of("Colonial","Train","Gardens","Scenic")),

            dest("Mcleod Ganj", "Dharamsala, Himachal Pradesh",
                "Little Lhasa in India — home of the Dalai Lama and a vibrant Tibetan community.",
                "https://images.unsplash.com/photo-1609781588698-bc1b13ce74fe?w=600",
                Category.HILLS, 4.8, "3-4 Days", "Mar - Jun, Sep - Nov", "Easy", "Rs.1,500 - Rs.4,000 / day",
                "Attend a teaching or meditation retreat at one of the monasteries. Many are free for solo travelers.",
                List.of("Dalai Lama Temple","Bhagsu Waterfall","Triund Trek","Tibetan cuisine"),
                List.of("Tibetan Culture","Spiritual","Trekking","Meditation")),

            dest("Chikmangalur", "Chikkamagaluru, Karnataka",
                "The birthplace of Indian coffee — misty peaks, dense forests, and pristine waterfalls.",
                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
                Category.HILLS, 4.6, "2-3 Days", "Oct - Feb", "Moderate", "Rs.2,000 - Rs.5,000 / day",
                "Mullayanagiri is Karnataka's highest peak — a short but steep trek with panoramic views.",
                List.of("Mullayanagiri Peak","Baba Budangiri","Hebbe Falls","Coffee plantation trails"),
                List.of("Coffee","Trekking","Waterfalls","Scenic"))
        ));
    }

    private void seedForests() {
        repo.saveAll(List.of(
            dest("Jim Corbett National Park", "Nainital, Uttarakhand",
                "India's oldest national park and the birthplace of Project Tiger. Home to 260+ Bengal Tigers.",
                "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600",
                Category.FORESTS, 4.8, "2-3 Days", "Nov - Jun", "Easy", "Rs.3,000 - Rs.8,000 / day",
                "Book a canter safari (cheaper than jeep) for zone Dhikala — the best tiger sighting zone.",
                List.of("Tiger safari","Elephant safaris","Ramganga River","Bird watching — 600+ species"),
                List.of("Wildlife","Tiger","Safari","Bird Watching")),

            dest("Sundarbans Delta", "South 24 Parganas, West Bengal",
                "The largest mangrove forest on Earth — a UNESCO World Heritage site where Royal Bengal Tigers swim.",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
                Category.FORESTS, 4.7, "2-3 Days", "Oct - Mar", "Moderate", "Rs.3,000 - Rs.7,000 / day",
                "Book a government-approved tour from Kolkata. Solo entry is not permitted — all visitors need guides.",
                List.of("Mangrove boat tour","Swimming tigers","Sajnekhali Bird Sanctuary","Dobanki canopy walk"),
                List.of("Mangroves","UNESCO","Tiger","Unique")),

            dest("Coorg Forests & Iruppu Falls", "Kodagu, Karnataka",
                "Ancient forests where elephants roam free, waterfalls plunge into emerald pools.",
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
                Category.FORESTS, 4.8, "2-3 Days", "Oct - Feb", "Moderate", "Rs.2,000 - Rs.5,000 / day",
                "Nagarhole National Park is nearby — combine both in a single trip for incredible wildlife.",
                List.of("Iruppu Falls","Nagarhole Safari","Dubare Elephant Camp","Coffee forest trails"),
                List.of("Waterfalls","Elephant","Safari","Forest")),

            dest("Kaziranga National Park", "Golaghat, Assam",
                "Home to two-thirds of the world's one-horned rhinoceroses, with UNESCO World Heritage status.",
                "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600",
                Category.FORESTS, 4.9, "2-3 Days", "Nov - Apr", "Easy", "Rs.3,000 - Rs.8,000 / day",
                "The elephant safari at dawn gives the best rhino sightings. Book through the forest department.",
                List.of("One-horned rhino","Elephant safari","Tiger & elephant sightings","Brahmaputra river views"),
                List.of("Rhino","UNESCO","Wildlife","Assam")),

            dest("Wayanad Wildlife Sanctuary", "Wayanad, Kerala",
                "Kerala's green heart — ancient tribal lands, bamboo forests, and roaming elephants.",
                "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600",
                Category.FORESTS, 4.7, "2-3 Days", "Oct - May", "Easy", "Rs.2,000 - Rs.5,000 / day",
                "Stay in a treehouse resort inside the forest for an immersive solo experience.",
                List.of("Chembra Peak Trek","Edakkal Caves","Soochipara Falls","Elephant sightings"),
                List.of("Elephant","Tribal Culture","Trekking","Treehouse")),

            dest("Dzukou Valley", "Kohima, Nagaland",
                "A hidden Himalayan valley of seasonal lilies and rolling meadows — the paradise of northeast India.",
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
                Category.FORESTS, 4.9, "3-4 Days", "Jun - Sep", "Challenging", "Rs.2,000 - Rs.5,000 / day",
                "Camp overnight in the valley — sunrise over the lily fields is one of India's most magical sights.",
                List.of("Dzukou Lily fields","Camping in the valley","Japfu Peak","Naga village culture"),
                List.of("Northeast India","Camping","Flowers","Remote"))
        ));
    }

    private void seedBeaches() {
        repo.saveAll(List.of(
            dest("Gokarna Beach", "Gokarna, Karnataka",
                "A sacred temple town with pristine beaches — the perfect solo escape from Goa's crowds.",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
                Category.BEACHES, 4.7, "2-3 Days", "Oct - Mar", "Easy", "Rs.1,500 - Rs.3,500 / day",
                "Om Beach is shaped like the Om symbol — best appreciated from the hilltop viewpoint at sunrise.",
                List.of("Om Beach","Half Moon Beach trek","Mahabaleshwar Temple","Cliff camping"),
                List.of("Spiritual","Hidden Gem","Backpacker","Scenic")),

            dest("Radhanagar Beach", "Havelock Island, Andaman",
                "Ranked Asia's best beach — white powder sand, turquoise water, and a dramatic crimson sunset.",
                "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600",
                Category.BEACHES, 5.0, "4-5 Days", "Nov - Apr", "Easy", "Rs.3,000 - Rs.8,000 / day",
                "Take the early government ferry from Port Blair — much cheaper than private speedboats.",
                List.of("Beach No.7 sunset","Elephant Beach snorkeling","Scuba diving","Sea turtle nesting"),
                List.of("Tropical","Island","Snorkeling","Award-winning")),

            dest("Varkala Cliff Beach", "Varkala, Kerala",
                "A dramatic laterite cliff overlooking the Arabian Sea, with a sacred spring and yoga retreats.",
                "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600",
                Category.BEACHES, 4.7, "2-3 Days", "Oct - Mar", "Easy", "Rs.2,000 - Rs.5,000 / day",
                "The north cliff has calmer vibes and better value guesthouses. Avoid south beach on weekends.",
                List.of("Cliff walk at sunset","Papanasam Beach","Janardanaswami Temple","Ayurvedic treatments"),
                List.of("Cliff","Yoga","Ayurveda","Spiritual")),

            dest("Tarkarli Beach", "Sindhudurg, Maharashtra",
                "Maharashtra's best-kept secret — crystal clear backwaters and white sand beach.",
                "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600",
                Category.BEACHES, 4.6, "2-3 Days", "Oct - Mar", "Easy", "Rs.2,000 - Rs.4,000 / day",
                "Book a houseboat stay on the backwaters for the most unique experience.",
                List.of("Scuba Diving","Kayaking backwaters","Sindhudurg Fort","Malvan cuisine"),
                List.of("Scuba Diving","Backwaters","Hidden Gem")),

            dest("Rushikonda Beach", "Visakhapatnam, Andhra Pradesh",
                "The jewel of the East Coast — turquoise waters where the Eastern Ghats meet the Bay of Bengal.",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
                Category.BEACHES, 4.5, "2-3 Days", "Oct - Mar", "Easy", "Rs.1,500 - Rs.3,500 / day",
                "Very safe and well-maintained. Combine with a trip to Borra Caves in Araku Valley.",
                List.of("Surfing & windsurfing","INS Kursura Submarine Museum","Kailasagiri Park","Borra Caves nearby"),
                List.of("Water Sports","East Coast","Scenic"))
        ));
    }

    private Destination dest(String name, String location, String description, String imageUrl,
                              Category category, double rating, String duration, String bestTime,
                              String difficulty, String budget, String soloTips,
                              List<String> highlights, List<String> tags) {
        return Destination.builder()
            .name(name).location(location).description(description).imageUrl(imageUrl)
            .category(category).rating(rating).duration(duration).bestTime(bestTime)
            .difficulty(difficulty).budget(budget).soloTips(soloTips)
            .highlights(highlights).tags(tags)
            .build();
    }
}
