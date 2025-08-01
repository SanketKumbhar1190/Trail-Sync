package com.trailsync.service;

import java.util.List;

import com.trailsync.model.Event;
import com.trailsync.model.User;

public interface EventService {
    Event createEvent(Event event);
    Event getEventById(Long id);
    List<Event> getAllEvents();
    void deleteEvent(Long id);
    Event addUserToEvent(Long eventId, Long userId);
    Event updateEvent(Long id, Event updatedEvent);
    List<User> getParticipantsByEvent(Long eventId);
    List<Event> getEnrolledEvents(Long userId);

}