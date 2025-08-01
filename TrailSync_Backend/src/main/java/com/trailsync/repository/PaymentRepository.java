package com.trailsync.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trailsync.model.Event;
import com.trailsync.model.Payment;
import com.trailsync.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Payment findByRazorpayOrderId(String orderId);

    // ✅ Fix: Change 'Module' to 'Event'
    boolean existsByUserAndEventAndOrderStatus(User user, Event event, String orderStatus);

    @Transactional
    void deleteByEventId(Long eventId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.orderStatus = :orderStatus")
    Double getTotalRevenue(@Param("orderStatus") String orderStatus);
    
    Optional<Payment> findByUserIdAndEventId(Long userId, Long eventId);
    
    Optional<Payment> findById(Long id);


}
