package com.trailsync.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.trailsync.model.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUserId(Long userId);

    @Query("SELECT COUNT(e) FROM Event e")
    Long getTotalEvents(); // Total event count

    @Query("SELECT FUNCTION('DATE_FORMAT', e.date, '%Y-%m') AS month, COUNT(e) " +
           "FROM Event e GROUP BY month ORDER BY month ASC")
    List<Object[]> getEventTrends(); // Event trends
    List<Event> findByParticipantsId(Long userId);

    
}
