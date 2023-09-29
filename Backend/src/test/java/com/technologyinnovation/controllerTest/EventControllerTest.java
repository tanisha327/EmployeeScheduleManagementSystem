import com.technologyinnovation.controller.*;
import com.technologyinnovation.model.Event;
import com.technologyinnovation.model.User;
import com.technologyinnovation.model.UserRole;
import com.technologyinnovation.service.EventService;
import com.technologyinnovation.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EventControllerTest {

    @Test
    void testCreateEvent() {
        // Create a sample event
        Event event = new Event();
        event.setId(1L);
        event.setStartDateTime(java.time.LocalDateTime.now());
        event.setEndDateTime(java.time.LocalDateTime.now().plusHours(1));
        event.setApproved(false);

        // Create the EventService mock
        EventService eventService = mock(EventService.class);
        when(eventService.createEvent(any(Event.class))).thenReturn(event);

        // Create the EventController
        EventController eventController = new EventController(eventService, null);

        // Call the createEvent() method of the controller
        ResponseEntity<Event> response = eventController.createEvent(event);

        // Verify the result
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(event, response.getBody());
    }

    @Test
    void testGetAllEvents() {
        // Create a list of sample events
        List<Event> events = new ArrayList<>();
        Event event1 = new Event();
        event1.setId(1L);
        event1.setStartDateTime(java.time.LocalDateTime.now());
        event1.setEndDateTime(java.time.LocalDateTime.now().plusHours(1));
        event1.setApproved(true);
        events.add(event1);

        Event event2 = new Event();
        event2.setId(2L);
        event2.setStartDateTime(java.time.LocalDateTime.now().plusDays(1));
        event2.setEndDateTime(java.time.LocalDateTime.now().plusDays(1).plusHours(2));
        event2.setApproved(false);
        events.add(event2);

        EventService eventService = mock(EventService.class);
        when(eventService.getAllEvents()).thenReturn(events);

        EventController eventController = new EventController(eventService, null);

        ResponseEntity<List<Event>> response = eventController.getAllEvents();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(events, response.getBody());
    }

    @Test
    void testApproveEventAsManager() {
        Event event = new Event();
        event.setId(1L);
        event.setStartDateTime(java.time.LocalDateTime.now());
        event.setEndDateTime(java.time.LocalDateTime.now().plusHours(1));
        event.setApproved(false);

        User managerUser = new User();
        managerUser.setUserRole(UserRole.MANAGER);

        EventService eventService = mock(EventService.class);
        when(eventService.getEventById(event.getId())).thenReturn(event);
        when(eventService.updateEvent(any(Event.class))).thenReturn(event);

        UserService userService = mock(UserService.class);
        when(userService.getLoggedInUser()).thenReturn(managerUser);

        EventController eventController = new EventController(eventService, userService);

        ResponseEntity<Event> response = eventController.approveEvent(event);

        // Verify the result
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isApproved());
    }

    @Test
    void testApproveEventAsEmployee() {
        // Create a sample event
        Event event = new Event();
        event.setId(1L);
        event.setStartDateTime(java.time.LocalDateTime.now());
        event.setEndDateTime(java.time.LocalDateTime.now().plusHours(1));
        event.setApproved(false);

        User employeeUser = new User();
        employeeUser.setUserRole(UserRole.EMPLOYEE);

        EventService eventService = mock(EventService.class);

        UserService userService = mock(UserService.class);
        when(userService.getLoggedInUser()).thenReturn(employeeUser);

        EventController eventController = new EventController(eventService, userService);

        ResponseEntity<Event> response = eventController.approveEvent(event);

        // Verify the result
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }
}
