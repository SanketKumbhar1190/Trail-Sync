package com.trailsync.controller;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trailsync.model.User;
import com.trailsync.security.JwtHelper;
import com.trailsync.security.JwtRequest;
import com.trailsync.security.JwtResponse;
import com.trailsync.service.UserService;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private JwtHelper jwtHelper;
	
	 @Autowired
	    private PasswordEncoder passwordEncoder;

	@Autowired
	private UserService userService; //  UserService that handles user operations

	@PostMapping("/login")
	public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest jwtRequest) {
		// Authenticate using email (not username)
		System.out.println(jwtRequest.getEmail()+" password "+ jwtRequest.getPassword());
		authenticate(jwtRequest.getEmail(), jwtRequest.getPassword());

		// Load user details by email, since email is used for authentication
		UserDetails userDetails = userDetailsService.loadUserByUsername(jwtRequest.getEmail()); // Corrected to use
																								// email

		// Generate JWT token for the authenticated user
		String token = jwtHelper.generateToken(userDetails);

		// Fetch the User entity from the database
		Optional<User> user = userService.getUserByEmail(jwtRequest.getEmail()); // Assuming this method exists in
																					// UserService

		if (user == null) {
			throw new BadCredentialsException("User not found");
		}

		// Get userId from User entity
		User user2 = user.get();
		Long userId = user2.getId();

		// Get role (assuming first authority is the role)
		String role = userDetails.getAuthorities().toArray()[0].toString(); // Assuming first authority is the role

		// Return response with token, role, and userId
		return ResponseEntity.ok(new JwtResponse(token, userDetails.getUsername(), role, userId));
	}

	private void authenticate(String email, String password) {
		try {
			// Authenticate using the email for username
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
		} catch (BadCredentialsException e) {
			throw new BadCredentialsException("Invalid credentials");
		}
		
		
		
	}
	@PutMapping("/user/update-email")
	public ResponseEntity<?> updateEmail(@RequestBody Map<String, String> request, Principal principal) {
	    Optional<User> optionalUser = userService.getUserByEmail(principal.getName());
	    if (!optionalUser.isPresent()) {
	        return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("User not found");
	    }

	    User user = optionalUser.get(); // Unwrap Optional
	    String newEmail = request.get("email");

	    if (userService.existsByEmail(newEmail)) {
	        return ResponseEntity.status(HttpStatus.SC_BAD_REQUEST).body("Email already in use");
	    }

	    user.setEmail(newEmail);
	    userService.saveUser(user);
	    return ResponseEntity.ok("Email updated successfully");
	}

	@PutMapping("/user/update-password")
	public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request, Principal principal) {
	    Optional<User> optionalUser = userService.getUserByEmail(principal.getName());
	    if (!optionalUser.isPresent()) {
	        return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("User not found");
	    }

	    User user = optionalUser.get(); // Unwrap Optional
	    String currentPassword = request.get("currentPassword");
	    String newPassword = request.get("newPassword");

	    try {
	        userService.updatePassword(user.getId(), currentPassword, newPassword);
	        return ResponseEntity.ok("Password updated successfully");
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.SC_BAD_REQUEST).body(e.getMessage());
	    }
	}



}
