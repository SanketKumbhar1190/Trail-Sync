package com.trailsync.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.razorpay.RazorpayException;
import com.trailsync.exception.ResourceNotFoundException;
import com.trailsync.model.Event;
import com.trailsync.model.Payment;
import com.trailsync.model.User;
import com.trailsync.repository.EventRepository;
import com.trailsync.repository.UserRepository;
import com.trailsync.serviceimpl.PaymentServiceImpl;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentServiceImpl paymentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            System.out.println("Received Order Request: " + orderData);

            // Extract userId, eventId, amount, and phone number
            Long userId = orderData.containsKey("userId") ? Long.parseLong(orderData.get("userId").toString()) : null;
            Long eventId = orderData.containsKey("eventId") ? Long.parseLong(orderData.get("eventId").toString()) : null;
            Double amount = orderData.containsKey("amount") ? Double.parseDouble(orderData.get("amount").toString()) : 0.0;
            String phoneNumber = orderData.containsKey("phno") ? orderData.get("phno").toString() : "";

            // Validate userId and eventId
            if (userId == null || eventId == null) {
                return ResponseEntity.badRequest().body("Missing userId or eventId in request!");
            }

            // Fetch user and event from DB
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

            // Create payment order
            Payment payment = new Payment();
            payment.setUser(user);
            payment.setEvent(event);
            payment.setAmount(amount);
            payment.setPhno(phoneNumber);

            Payment createdOrder = paymentService.createOrder(payment);
            return ResponseEntity.ok(createdOrder);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("❌ Invalid number format in request data!");
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/handle-payment-callback")
    public ResponseEntity<String> handlePaymentCallback(@RequestBody Map<String, String> payload) {
        try {
        	System.out.println("Payload "+payload);
            paymentService.updateOrder(payload);
            return ResponseEntity.ok("Payment updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ " + e.getMessage());
        }
    }

    @GetMapping("/verify-payment")
    public ResponseEntity<Boolean> verifyPurchase(@RequestParam("userId") Long userId,
                                                  @RequestParam("eventId") Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        boolean hasAccess = paymentService.hasUserPurchasedModule(user, event);
        return ResponseEntity.ok(hasAccess);
    }
    
    
    @GetMapping("/details")
    public ResponseEntity<?> getPaymentDetails(@RequestParam("userId") Long userId,
                                               @RequestParam("eventId") Long eventId) {
    	System.out.println("in details");
        try {
        	 System.out.println("in details111111111111");
            Payment payment = paymentService.getPaymentDetails(userId, eventId);
           
            System.out.println("Details : "+ payment);
            if (payment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Payment details not found for the given user and event.");
            }

            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching payment details: " + e.getMessage());
        }
    }
    
    
    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        try {
            return ResponseEntity.ok(paymentService.getAllPayments());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching payments: " + e.getMessage());
        }
    }
    
    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<?> refundPayment(@PathVariable Long paymentId) {
        try {
            boolean isRefunded = paymentService.processRefund(paymentId);

            if (isRefunded) {
                return ResponseEntity.ok("Refund processed successfully.");
            } else {
                return ResponseEntity.badRequest().body("Refund failed or not applicable.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing refund: " + e.getMessage());
        }
    }

 
}
