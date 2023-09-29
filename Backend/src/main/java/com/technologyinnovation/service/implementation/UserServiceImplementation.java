package com.technologyinnovation.service.implementation;

import com.technologyinnovation.model.User;
import com.technologyinnovation.repository.UserRepository;
import com.technologyinnovation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private Long loggedInUserId;

    @Autowired
    public UserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User signUp(User user) {
        return userRepository.save(user);
    }

    @Override
    public User login(User user) {
        User storedUser = userRepository.findByUsername(user.getUsername());
        if (storedUser != null && storedUser.getPassword().equals(user.getPassword())) {
            loggedInUserId = storedUser.getId();
            return storedUser; // Return the whole user object
        }
        return null; // Return null if login fails
    }

    @Override
    public User getLoggedInUser() {
        if (loggedInUserId != null) {
            return userRepository.findById(loggedInUserId).orElse(null);
        }
        return null;
    }
}
