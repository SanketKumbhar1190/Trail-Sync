package com.trailsync.service;
import java.util.List;
import java.util.Optional;

import com.trailsync.model.User;

// User Service Interface
public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();
    void deleteUser(Long id);
    
    
    
    boolean existsByEmail(String email);
    User updateEmail(Long userId, String newEmail);
    void updatePassword(Long userId, String currentPassword, String newPassword);
    void saveUser(User user);
    boolean checkPassword(User user, String rawPassword);

}