package com.technologyinnovation.serviceTest;

import com.technologyinnovation.model.User;
import com.technologyinnovation.model.UserRole;
import com.technologyinnovation.service.UserService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

public class UserServiceTest {

    @Test
    void testSignUp() {
        // Create a sample user for signing up
        User signUpUser = new User();
        signUpUser.setUsername("user@example.com");
        signUpUser.setPassword("password");
        signUpUser.setName("Alex");
        signUpUser.setOrganizationNumber("123456789");
        signUpUser.setUserRole(UserRole.EMPLOYEE);

        // Create the UserService mock
        UserService userService = mock(UserService.class);

        // Set up the mock behavior for signUp
        when(userService.signUp(any(User.class))).thenReturn(signUpUser);

        User signedUpUser = userService.signUp(signUpUser);

        // Verify the result
        assertEquals("Alex", signedUpUser.getName());
        assertEquals(UserRole.EMPLOYEE, signedUpUser.getUserRole());
     

    }
@Test
    void testLogin() {

        User user = new User();
        user.setId(1L);
        user.setUsername("user@example.com");
        user.setPassword("password");
        user.setName("Alex");
        user.setOrganizationNumber("123456789");
        user.setUserRole(UserRole.EMPLOYEE);
        user.setLoggedInUserId(2L);

        UserService userService = mock(UserService.class);

        when(userService.login(any(User.class))).thenReturn(user);

        User loggedInUser = userService.login(user);

        assertEquals("Alex", loggedInUser.getName());
        assertEquals(UserRole.EMPLOYEE, loggedInUser.getUserRole());
    }

    @Test
    void testGetLoggedInUser() {

        User loggedInUser = new User();
        loggedInUser.setId(1L);
        loggedInUser.setUsername("user@example.com");
        loggedInUser.setPassword("password");
        loggedInUser.setName("Alex");
        loggedInUser.setOrganizationNumber("123456789");
        loggedInUser.setUserRole(UserRole.EMPLOYEE);
        loggedInUser.setLoggedInUserId(2L);

        UserService userService = mock(UserService.class);

        when(userService.getLoggedInUser()).thenReturn(loggedInUser);

        User fetchedLoggedInUser = userService.getLoggedInUser();

        assertEquals("Alex", fetchedLoggedInUser.getName());
        assertEquals(UserRole.EMPLOYEE, fetchedLoggedInUser.getUserRole());
    
    }
}
