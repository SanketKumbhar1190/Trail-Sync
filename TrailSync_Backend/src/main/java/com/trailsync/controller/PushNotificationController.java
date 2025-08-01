package com.trailsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.trailsync.service.PushNotificationService;

@RestController
@RequestMapping("/api/notifications")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;

    @Autowired
    public PushNotificationController(PushNotificationService pushNotificationService) {
        this.pushNotificationService = pushNotificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(
            @RequestParam String token, 
            @RequestParam String title, 
            @RequestParam String body) throws Exception {
        String messageId = pushNotificationService.sendNotification(token, title, body);
        return ResponseEntity.ok("Notification sent successfully with message ID: " + messageId);
    }
}
