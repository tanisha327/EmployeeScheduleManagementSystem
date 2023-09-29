package com.technologyinnovation.controller;

import com.technologyinnovation.model.Event;
import com.technologyinnovation.model.User;
import com.technologyinnovation.model.UserRole;
import com.technologyinnovation.service.EventService;
import com.technologyinnovation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/events")
public class EventController {
    private EventService eventService;
    private UserService userService;

    @Autowired
    public EventController(EventService eventService, UserService userService)
    {
        this.eventService = eventService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event createdEvent = eventService.createEvent(event);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping("/approve")
    public ResponseEntity<Event> approveEvent(@RequestBody Event event){

        User loggedInUser = userService.getLoggedInUser();
        if(loggedInUser != null && loggedInUser.getUserRole() == UserRole.MANAGER) //only manager can approve events
        {
            //fetch the event from db
            Event existingEvent =  eventService.getEventById(event.getId());
            if(existingEvent == null)
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            existingEvent.setApproved(true);
            Event approveEvent = eventService.updateEvent(existingEvent);
            return new ResponseEntity<>(approveEvent, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/update/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        User loggedInUser = userService.getLoggedInUser();
        if (loggedInUser == null || loggedInUser.getUserRole() != UserRole.MANAGER) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Event existingEvent = eventService.getEventById(eventId);
        if (existingEvent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Updating the necessary fields
        existingEvent.setStartDateTime(updatedEvent.getStartDateTime());
        existingEvent.setEndDateTime(updatedEvent.getEndDateTime());

        Event updatedEventEntity = eventService.updateEvent(existingEvent);
        return new ResponseEntity<>(updatedEventEntity, HttpStatus.OK);
    }
}
