package com.trailsync.service;

import java.util.List;
import java.util.Map;

import com.razorpay.Order;
import com.trailsync.model.Payment;

public interface PaymentService {
    Payment processPayment(Payment payment);
    List<Payment> getPaymentsByUserId(Long userId);
    List<Payment> getPaymentsByEventId(Long eventId);
    Order createRazorpayOrder(int amount) throws Exception;
    boolean verifyPayment( String paymentId, String razorpaySignature);
    Payment getPaymentDetails(Long userId, Long eventId);
    
    List<Payment> getAllPayments();
    boolean processRefund(Long paymentId);

}
