package com.trailsync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "push_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String body;
    private String token;
    private String status;  // "sent" or "failed"
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // Associate with a user (optional)
    private User user;
}
