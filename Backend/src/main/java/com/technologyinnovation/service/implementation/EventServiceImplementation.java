package com.technologyinnovation.service.implementation;

import com.technologyinnovation.model.Event;
import com.technologyinnovation.model.User;
import com.technologyinnovation.repository.EventRepository;
import com.technologyinnovation.service.EventService;
import com.technologyinnovation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImplementation implements EventService {
    private EventRepository eventRepository;
    private final UserService userService;

    @Autowired
    public EventServiceImplementation(EventRepository eventRepository, UserService userService) {
        this.eventRepository = eventRepository;
        this.userService = userService;
    }

    @Override
    public Event createEvent(Event event) {
        User loggedInUser = userService.getLoggedInUser();
        event.setUser(loggedInUser);
        Event createdEvent = eventRepository.save(event);

        return createdEvent;
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }
}
