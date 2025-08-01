package com.trailsync.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trailsync.model.PushNotification;

@Repository
public interface PushNotificationRepository extends JpaRepository<PushNotification, Long> {
    // Custom queries, if needed, can be added here
}
