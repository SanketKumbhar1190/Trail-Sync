package com.trailsync.serviceimpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.trailsync.exception.ResourceNotFoundException;
import com.trailsync.model.User;
import com.trailsync.repository.UserRepository;
import com.trailsync.service.UserService;

//User Service Implementation
@Service
public class UserServiceImpl implements UserService {
 @Autowired
 private UserRepository userRepository;
 
 @Autowired
 private PasswordEncoder passwordEncoder;

 @Override
 public User createUser(User user) {

     String encodedPassword = passwordEncoder.encode(user.getPassword());
     user.setPassword(encodedPassword);
     return userRepository.save(user);
 }

 @Override
 public User getUserById(Long id) {
     return userRepository.findById(id)
             .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
 }

 @Override
 public Optional<User> getUserByEmail(String email) {
     return userRepository.findByEmail(email);
 }

 @Override
 public List<User> getAllUsers() {
     return userRepository.findAll();
 }

 @Override
 public void deleteUser(Long id) {
     User user = getUserById(id);
     userRepository.delete(user);
 }
 
 
//✅ Check if email exists
 @Override
 public boolean existsByEmail(String email) {
     return userRepository.findByEmail(email).isPresent();
 }

 // ✅ Update Email
 @Override
 public User updateEmail(Long userId, String newEmail) {
     User user = getUserById(userId);
     
     if (existsByEmail(newEmail)) {
         throw new IllegalArgumentException("Email is already in use.");
     }

     user.setEmail(newEmail);
     return userRepository.save(user);
 }

 // ✅ Update Password
 @Override
 public void updatePassword(Long userId, String currentPassword, String newPassword) {
     User user = getUserById(userId);

     if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
         throw new IllegalArgumentException("Current password is incorrect.");
     }

     user.setPassword(passwordEncoder.encode(newPassword));
     userRepository.save(user);
 }

 // ✅ Save updated user
 @Override
 public void saveUser(User user) {
     userRepository.save(user);
 }
 
 @Override
 public boolean checkPassword(User user, String rawPassword) {
     return passwordEncoder.matches(rawPassword, user.getPassword());
 }

 
}

