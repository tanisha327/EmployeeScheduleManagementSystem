package com.technologyinnovation.repository;

import com.technologyinnovation.model.Event;
import com.technologyinnovation.service.EventService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


public class EventRepositoryTest {

   

    @Test
    public void testFindById() {
        long eventId = 1L;
        Event event = new Event();
        event.setId(eventId);
    

        event.setApproved(true);

    EventRepository eventRepository = mock(EventRepository.class);
    when(eventRepository.findById(eventId)).thenReturn(event);

       
    }
}
