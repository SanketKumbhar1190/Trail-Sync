package com.trailsync.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trailsync.exception.ResourceNotFoundException;
import com.trailsync.model.Event;
import com.trailsync.model.Location;
import com.trailsync.model.User;
import com.trailsync.repository.EventRepository;
import com.trailsync.repository.LocationRepository;
import com.trailsync.repository.PaymentRepository;
import com.trailsync.repository.UserRepository;
import com.trailsync.service.EventService;

@Service
public class EventServiceImpl implements EventService {
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private LocationRepository lrepo;
    
    @Autowired
    private UserRepository urepo;

    @Transactional
    @Override
    public Event createEvent(Event event) {
        // Fetch the location using the provided location ID from the event
        Location location= lrepo.findById(event.getLocation().getId())
                                  .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        // Fetch the user using the provided user ID from the event
        User user = urepo.findById(event.getUser().getId())
                         .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Set the fetched location and user to the event
        event.setLocation(location);
        event.setUser(user);

        // Save the event with the fetched location and user
        return eventRepository.save(event);
    }


    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

//    @Override
//    public void deleteEvent(Long id) {
//        Event event = getEventById(id);
//        eventRepository.delete(event);
//    }
    
    @Transactional
    @Override
    public void deleteEvent(Long id) {
        // Fetch the event by ID and check if it exists
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        // Delete related payments (if any)
        paymentRepository.deleteByEventId(id); // Add this line if paymentRepository exists and has a deleteByEventId method

        // Now delete the event
        eventRepository.delete(event);
    }

    
    
    
    // Method to add a user to an event
    @Override
    public Event addUserToEvent(Long eventId, Long userId) {
        // Fetch the event using the eventId
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        // Fetch the user using the userId
        User user = urepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Add the user to the event's participants list
        event.getParticipants().add(user);

        // Save the event with the updated participants list
        return eventRepository.save(event);
    }
    
    @Transactional
    @Override
    public Event updateEvent(Long id, Event updatedEvent) {
        // Fetch the existing event from the database
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        // Update the fields (note: you can customize this according to your requirements)
        if (updatedEvent.getTitle() != null) {
            event.setTitle(updatedEvent.getTitle());
        }
        if (updatedEvent.getDescription() != null) {
            event.setDescription(updatedEvent.getDescription());
        }
        if (updatedEvent.getDate() != null) {
            event.setDate(updatedEvent.getDate());
        }

        // Fetch and update the location if necessary
        if (updatedEvent.getLocation() != null && updatedEvent.getLocation().getId() != null) {
            com.trailsync.model.Location location = lrepo.findById(updatedEvent.getLocation().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + updatedEvent.getLocation().getId()));
            event.setLocation(location);
        }

        // Optionally, update the user if necessary (typically won't change)
        if (updatedEvent.getUser() != null) {
            User user = urepo.findById(updatedEvent.getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + updatedEvent.getUser().getId()));
            event.setUser(user);
        }

        // Save and return the updated event
        return eventRepository.save(event);
    }
    
    
    @Transactional
    @Override
    public List<User> getParticipantsByEvent(Long eventId) {
        // Fetch the event using the eventId
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        // Return the participants list from the event
        return event.getParticipants();  // Correct method to fetch participants
    }


    public List<Event> getEnrolledEvents(Long userId) {
        return eventRepository.findByParticipantsId(userId);
    }
    
    
    
    
    
}


