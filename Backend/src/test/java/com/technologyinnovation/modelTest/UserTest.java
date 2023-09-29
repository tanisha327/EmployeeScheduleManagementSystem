package com.technologyinnovation.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("user@example.com");
        user.setPassword("password");
        user.setName("John Doe");
        user.setOrganizationNumber("123456789");
        user.setUserRole(UserRole.EMPLOYEE);
        user.setLoggedInUserId(2L);
    }

    @Test
    void testGettersAndSetters() {
      //  Assert.assertTrue(1L, user.getId());
        assertEquals("user@example.com", user.getUsername());
        assertEquals("password", user.getPassword());
        assertEquals("John Doe", user.getName());
        assertEquals("123456789", user.getOrganizationNumber());
        assertEquals(UserRole.EMPLOYEE, user.getUserRole());
    
    }

    @Test
    void testEventsList() {
        Event event1 = new Event();
        event1.setId(101L);
        event1.setStartDateTime(java.time.LocalDateTime.now());
        event1.setEndDateTime(java.time.LocalDateTime.now().plusHours(1));
        event1.setApproved(true);

        Event event2 = new Event();
        event2.setId(102L);
        event2.setStartDateTime(java.time.LocalDateTime.now().plusDays(1));
        event2.setEndDateTime(java.time.LocalDateTime.now().plusDays(1).plusHours(2));
        event2.setApproved(false);

        List<Event> events = new ArrayList<>();
        events.add(event1);
        events.add(event2);

        user.setEvents(events);

        assertEquals(events, user.getEvents());
        assertEquals(2, user.getEvents().size());
      //   Assert.assertTrue(101L, user.getEvents().get(0).getId());

    }
}
