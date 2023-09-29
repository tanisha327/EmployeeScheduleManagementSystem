package com.technologyinnovation.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals; 

public class UserRoleTest {

    @Test
    public void testEnumValues() {
        assertEquals(2, UserRole.values().length);
        assertEquals(UserRole.MANAGER, UserRole.valueOf("MANAGER"));
        assertEquals(UserRole.EMPLOYEE, UserRole.valueOf("EMPLOYEE"));
    }
}

