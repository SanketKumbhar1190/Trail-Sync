package com.trailsync.serviceimpl;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.trailsync.model.PushNotification;
import com.trailsync.repository.PushNotificationRepository;
import com.trailsync.service.PushNotificationService;

import org.springframework.stereotype.Service;

@Service
public class PushNotificationServiceImpl implements PushNotificationService {

    private final PushNotificationRepository pushNotificationRepository;

    // Constructor for Dependency Injection
    public PushNotificationServiceImpl(PushNotificationRepository pushNotificationRepository) {
        this.pushNotificationRepository = pushNotificationRepository;
    }

    @Override
    public String sendNotification(String token, String title, String body) throws Exception {
        // Create notification using Firebase
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
            .setToken(token)
            .setNotification(notification)
            .build();

        // Send the message and get the response
        String messageId = FirebaseMessaging.getInstance().send(message);

        // Log the sent notification to DB
        PushNotification pushNotification = new PushNotification();
        pushNotification.setToken(token);
        pushNotification.setTitle(title);
        pushNotification.setBody(body);
        pushNotification.setStatus("sent");  // Could be "sent" or "failed"
        // You can also associate the notification with a user if needed
        pushNotificationRepository.save(pushNotification);

        return messageId;  // Return message ID as confirmation
    }
}
