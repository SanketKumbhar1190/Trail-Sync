package com.trailsync.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.trailsync.repository.UserRepository;




@Configuration
public class MyConfig {

	@Autowired
    private UserRepository userRepository;

    

    @Bean
    public UserDetailsService userDetailsService() {
    	return username -> userRepository.findByEmail(username).map(user -> {
    		return User.builder().username(user.getEmail()).password(user.getPassword())
    				.authorities(user.getRole().getName())
    				
    				.build();
    	}).orElseThrow(()-> new UsernameNotFoundException("User Not Found with username = "+ username));
	
    	
    	
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager customAuthenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    
   
}
