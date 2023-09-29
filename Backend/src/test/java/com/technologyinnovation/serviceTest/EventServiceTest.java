import com.technologyinnovation.model.Event;
import com.technologyinnovation.service.EventService;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class EventServiceTest {

    @Test
    void testCreateEvent() {
        Event event = new Event();
        event.setId(1L);
        event.setStartDateTime(LocalDateTime.now());
        event.setEndDateTime(LocalDateTime.now().plusHours(2));
        event.setApproved(false);

        EventService eventService = mock(EventService.class);
        when(eventService.createEvent(any(Event.class))).thenReturn(event);

        Event createdEvent = eventService.createEvent(event);

        assertEquals(1L, createdEvent.getId());
        assertEquals(event.getStartDateTime(), createdEvent.getStartDateTime());
        assertEquals(event.getEndDateTime(), createdEvent.getEndDateTime());
        assertEquals(event.isApproved(), createdEvent.isApproved());
    }

    @Test
    void testGetAllEvents() {
        List<Event> events = new ArrayList<>();
        Event event1 = new Event();
        event1.setId(1L);
        event1.setStartDateTime(LocalDateTime.now());
        event1.setEndDateTime(LocalDateTime.now().plusHours(2));
        event1.setApproved(false);
        events.add(event1);

        Event event2 = new Event();
        event2.setId(2L);
        event2.setStartDateTime(LocalDateTime.now().plusDays(1));
        event2.setEndDateTime(LocalDateTime.now().plusDays(1).plusHours(2));
        event2.setApproved(true);
        events.add(event2);

        EventService eventService = mock(EventService.class);
        when(eventService.getAllEvents()).thenReturn(events);

        List<Event> fetchedEvents = eventService.getAllEvents();

        assertEquals(2, fetchedEvents.size());
        assertEquals(event1.getId(), fetchedEvents.get(0).getId());
        assertEquals(event2.getId(), fetchedEvents.get(1).getId());
    }

    @Test
    void testUpdateEvent() {
        Event event = new Event();
        event.setId(1L);
        event.setStartDateTime(LocalDateTime.now());
        event.setEndDateTime(LocalDateTime.now().plusHours(2));
        event.setApproved(false);

        EventService eventService = mock(EventService.class);
        when(eventService.updateEvent(any(Event.class))).thenReturn(event);

        Event updatedEvent = eventService.updateEvent(event);

        assertEquals(1L, updatedEvent.getId());
        assertEquals(event.getStartDateTime(), updatedEvent.getStartDateTime());
        assertEquals(event.getEndDateTime(), updatedEvent.getEndDateTime());
        assertEquals(event.isApproved(), updatedEvent.isApproved());
    }

    @Test
    void testGetEventById() {
        Event event = new Event();
        event.setId(1L);
        event.setStartDateTime(LocalDateTime.now());
        event.setEndDateTime(LocalDateTime.now().plusHours(2));
        event.setApproved(false);

        EventService eventService = mock(EventService.class);
        when(eventService.getEventById(1L)).thenReturn(event);

        Event fetchedEvent = eventService.getEventById(1L);

        assertEquals(1L, fetchedEvent.getId());
        assertEquals(event.getStartDateTime(), fetchedEvent.getStartDateTime());
        assertEquals(event.getEndDateTime(), fetchedEvent.getEndDateTime());
        assertEquals(event.isApproved(), fetchedEvent.isApproved());
    }
}
