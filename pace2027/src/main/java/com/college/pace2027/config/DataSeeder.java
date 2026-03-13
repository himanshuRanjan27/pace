package com.college.pace2027.config;

import com.college.pace2027.entity.Sport;
import com.college.pace2027.enums.SportCategory;
import com.college.pace2027.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final SportRepository sportRepository;

    @Override
    public void run(String... args) {
        if (sportRepository.count() > 0) {
            log.info("Sports already seeded. Skipping.");
            return;
        }

        List<Sport> sports = List.of(
            Sport.builder().name("Chess").category(SportCategory.INDOOR)
                .prizePool("1st: ₹3000 | 2nd: ₹2000 | 3rd: ₹1000")
                .registrationFee(new BigDecimal("100"))
                .rulebookUrl("https://drive.google.com/chess-rulebook")
                .eventHeadContact("9876500001").imageUrl("/images/sports/chess.jpg").build(),

            Sport.builder().name("Table Tennis").category(SportCategory.INDOOR)
                .prizePool("1st: ₹4000 | 2nd: ₹2500 | 3rd: ₹1500")
                .registrationFee(new BigDecimal("200"))
                .rulebookUrl("https://drive.google.com/tt-rulebook")
                .eventHeadContact("9876500002").imageUrl("/images/sports/table-tennis.jpg").build(),

            Sport.builder().name("Badminton").category(SportCategory.INDOOR)
                .prizePool("1st: ₹5000 | 2nd: ₹3000 | 3rd: ₹2000")
                .registrationFee(new BigDecimal("200"))
                .rulebookUrl("https://drive.google.com/badminton-rulebook")
                .eventHeadContact("9876500003").imageUrl("/images/sports/badminton.jpg").build(),

            Sport.builder().name("Squash").category(SportCategory.INDOOR)
                .prizePool("1st: ₹4000 | 2nd: ₹2500 | 3rd: ₹1500")
                .registrationFee(new BigDecimal("200"))
                .rulebookUrl("https://drive.google.com/squash-rulebook")
                .eventHeadContact("9876500004").imageUrl("/images/sports/squash.jpg").build(),

            Sport.builder().name("Football").category(SportCategory.OUTDOOR)
                .prizePool("1st: ₹10000 | 2nd: ₹6000 | 3rd: ₹3000")
                .registrationFee(new BigDecimal("500"))
                .rulebookUrl("https://drive.google.com/football-rulebook")
                .eventHeadContact("9876500005").imageUrl("/images/sports/football.jpg").build(),

            Sport.builder().name("Lawn Tennis").category(SportCategory.OUTDOOR)
                .prizePool("1st: ₹5000 | 2nd: ₹3000 | 3rd: ₹2000")
                .registrationFee(new BigDecimal("300"))
                .rulebookUrl("https://drive.google.com/tennis-rulebook")
                .eventHeadContact("9876500006").imageUrl("/images/sports/lawn-tennis.jpg").build(),

            Sport.builder().name("Kabaddi").category(SportCategory.OUTDOOR)
                .prizePool("1st: ₹8000 | 2nd: ₹5000 | 3rd: ₹2500")
                .registrationFee(new BigDecimal("400"))
                .rulebookUrl("https://drive.google.com/kabaddi-rulebook")
                .eventHeadContact("9876500007").imageUrl("/images/sports/kabaddi.jpg").build(),

            Sport.builder().name("Basketball").category(SportCategory.OUTDOOR)
                .prizePool("1st: ₹8000 | 2nd: ₹5000 | 3rd: ₹2500")
                .registrationFee(new BigDecimal("500"))
                .rulebookUrl("https://drive.google.com/basketball-rulebook")
                .eventHeadContact("9876500008").imageUrl("/images/sports/basketball.jpg").build(),

            Sport.builder().name("Volleyball").category(SportCategory.OUTDOOR)
                .prizePool("1st: ₹7000 | 2nd: ₹4000 | 3rd: ₹2000")
                .registrationFee(new BigDecimal("400"))
                .rulebookUrl("https://drive.google.com/volleyball-rulebook")
                .eventHeadContact("9876500009").imageUrl("/images/sports/volleyball.jpg").build(),

            Sport.builder().name("Cricket").category(SportCategory.OUTDOOR)
                .prizePool("1st: ₹15000 | 2nd: ₹8000 | 3rd: ₹4000")
                .registrationFee(new BigDecimal("600"))
                .rulebookUrl("https://drive.google.com/cricket-rulebook")
                .eventHeadContact("9876500010").imageUrl("/images/sports/cricket.jpg").build()
        );

        sportRepository.saveAll(sports);
        log.info("✅ Seeded {} sports into the database.", sports.size());
    }
}
