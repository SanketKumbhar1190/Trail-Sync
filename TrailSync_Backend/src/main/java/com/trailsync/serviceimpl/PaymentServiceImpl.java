package com.trailsync.serviceimpl;

import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.trailsync.model.Event;
import com.trailsync.model.Payment;
import com.trailsync.model.User;
import com.trailsync.repository.PaymentRepository;
@Service
public class PaymentServiceImpl{

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RazorpayClient client;

    @Value("${razorpay.secret.key}")
    private String razorpaySecret;

    @Transactional
    public Payment createOrder(Payment order) throws RazorpayException {
        if (order.getUser() == null || order.getEvent() == null) {
            throw new IllegalArgumentException("User and Module cannot be null.");
        }

        System.out.println("Creating order for User: " + order.getUser().getId() + " and Module: " + order.getEvent().getId());
        System.out.println("Amount: " + order.getAmount());

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(order.getAmount() * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

            System.out.println("Calling Razorpay API...");
            Order razorpayOrder = client.orders.create(orderRequest);
            System.out.println("Razorpay response: " + razorpayOrder.toString());
            System.out.println("Order ID: " + razorpayOrder.get("id"));

            order.setRazorpayOrderId(razorpayOrder.get("id"));
            order.setOrderStatus("CREATED");

            Payment savedOrder = paymentRepository.save(order);
            System.out.println("Saved to DB: " + savedOrder.getId());

            return savedOrder;

        } catch (RazorpayException e) {
            System.out.println("RAZORPAY ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            System.out.println("GENERAL ERROR: " + e.getMessage());
            e.printStackTrace();
            throw new RazorpayException(e.getMessage());
        }
    }

    @Transactional
    public void updateOrder(Map<String, String> payload) {
        String razorpayOrderId = payload.get("razorpay_order_id");
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        String razorpaySignature = payload.get("razorpay_signature");

        Payment order = paymentRepository.findByRazorpayOrderId(razorpayOrderId);

        if (order == null) {
            throw new IllegalArgumentException("Order not found.");
        }

        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("razorpay_order_id", razorpayOrderId);
            jsonObject.put("razorpay_payment_id", razorpayPaymentId);
            jsonObject.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(jsonObject, razorpaySecret);
            if (!isValid) {
                throw new SecurityException("Payment signature verification failed.");
            }
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new SecurityException("Payment signature verification failed.");
        }

        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setOrderStatus("PAYMENT_COMPLETED");
        paymentRepository.save(order);
    }

    public boolean hasUserPurchasedModule(User user, Event event) {
        return paymentRepository.existsByUserAndEventAndOrderStatus(user, event, "PAYMENT_COMPLETED");
    }
    
    public Payment getPaymentDetails(Long userId, Long eventId) {
         Payment orElse = paymentRepository.findByUserIdAndEventId(userId, eventId)
                .orElse(null);
         System.out.println("okokok " +orElse);
         return orElse;
    }
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    
    @Transactional
    public boolean processRefund(Long paymentId) throws RazorpayException {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found."));

        if (!"PAYMENT_COMPLETED".equals(payment.getOrderStatus())) {
            return false; // Only completed payments can be refunded
        }

        if (payment.getRazorpayPaymentId() == null || payment.getRazorpayPaymentId().isEmpty()) {
            throw new IllegalArgumentException("Razorpay payment ID not found for this payment.");
        }

        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", (int)(payment.getAmount() * 100));
        client.payments.refund(payment.getRazorpayPaymentId(), refundRequest);

        payment.setOrderStatus("REFUNDED");
        paymentRepository.save(payment);
        return true;
    }

}
