import com.technologyinnovation.controller.*;
import com.technologyinnovation.model.User;
import com.technologyinnovation.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    @Test
    void testSignUp() {
        // Create a sample user
        User user = new User();
        user.setId(1L);
        user.setUsername("user@example.com");
        user.setPassword("password");
        user.setName("John Doe");

        UserService userService = mock(UserService.class);
        when(userService.signUp(any(User.class))).thenReturn(user);

        UserController userController = new UserController(userService);

        ResponseEntity<User> response = userController.signUp(user);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    void testLoginSuccess() {
        // Create a sample user
        User user = new User();
        user.setId(1L);
        user.setUsername("user@example.com");
        user.setPassword("password");
        user.setName("John Doe");

        UserService userService = mock(UserService.class);
        when(userService.login(any(User.class))).thenReturn(user);

        UserController userController = new UserController(userService);

        ResponseEntity<User> response = userController.login(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    void testLoginFailure() {
        User user = new User();
        user.setId(1L);
        user.setUsername("user@example.com");
        user.setPassword("password");
        user.setName("John Doe");

        UserService userService = mock(UserService.class);
        when(userService.login(any(User.class))).thenReturn(null);

        UserController userController = new UserController(userService);

        ResponseEntity<User> response = userController.login(user);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(null, response.getBody());
    }
}
