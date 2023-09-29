package com.technologyinnovation.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class EventTest {

    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setId(201L);
        event.setStartDateTime(java.time.LocalDateTime.now());
        event.setEndDateTime(java.time.LocalDateTime.now().plusHours(2));
        event.setApproved(false);
    }

    @Test
    void testGettersAndSetters() {
        // Assert.assertTrue(201L, event.getId());
        assertFalse(event.isApproved());
    }

    @Test
    void testUserAssociation() {
        User user = new User();
        user.setId(301L);
        user.setName("John Doe");

        event.setUser(user);

        assertEquals(user, event.getUser());
        assertEquals("John Doe", event.getUser().getName());
    }
}
