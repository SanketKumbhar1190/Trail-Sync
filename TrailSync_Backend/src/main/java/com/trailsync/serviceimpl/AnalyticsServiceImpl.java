package com.trailsync.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trailsync.repository.EventRepository;
import com.trailsync.repository.PaymentRepository;
import com.trailsync.repository.UserRepository;
import com.trailsync.service.AnalyticsService;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public Map<String, Object> getPlatformAnalytics() {
        Map<String, Object> data = new HashMap<>();

        data.put("totalUsers", userRepository.getTotalUsers()); // Total users
        data.put("totalEvents", eventRepository.count()); // Total events
        data.put("totalPayments", paymentRepository.getTotalRevenue("Completed")); // Pass status explicitly

        data.put("eventTrends", eventRepository.getEventTrends()); // Event trends

        return data;
    }
}
