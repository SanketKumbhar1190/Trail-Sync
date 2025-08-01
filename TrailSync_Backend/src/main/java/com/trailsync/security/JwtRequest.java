package com.trailsync.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtRequest {
   
    private String password;
    private String email;  // Corrected the casing of 'Email' to 'email'
}
