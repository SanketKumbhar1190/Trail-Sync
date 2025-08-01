package com.trailsync.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trailsync.model.Event;
import com.trailsync.model.User;
import com.trailsync.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping("/create")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
    
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<User>> getParticipants(@PathVariable Long eventId) {
        List<User> participants = eventService.getParticipantsByEvent(eventId);
        return ResponseEntity.ok(participants);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
    
    @GetMapping("/enrolled/{userId}")
    public ResponseEntity<List<Event>> getEnrolledEvents(@PathVariable Long userId) {
        List<Event> enrolledEvents = eventService.getEnrolledEvents(userId);
        return ResponseEntity.ok(enrolledEvents);
    }


//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
//        eventService.deleteEvent(id);
//        return ResponseEntity.ok("Event deleted successfully");
//    }
    
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("Event deleted successfully");
    }

    
    
    
    
    
    
 // API to add user to an event
    @PostMapping("/{eventId}/join/{userid}")
    public Event joinEvent(@PathVariable Long eventId, @PathVariable Long userid) {
        return eventService.addUserToEvent(eventId, userid);
    }
    
    
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        Event event = eventService.updateEvent(id, updatedEvent);
        return ResponseEntity.ok(event); // Return updated event
    }

    
}
