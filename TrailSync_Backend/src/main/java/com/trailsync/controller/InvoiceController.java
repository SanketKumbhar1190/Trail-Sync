package com.trailsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.trailsync.model.Event;
import com.trailsync.model.Invoice;
import com.trailsync.repository.EventRepository;
import com.trailsync.service.InvoiceService;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final EventRepository eventRepository;

    @Autowired
    public InvoiceController(InvoiceService invoiceService, EventRepository eventRepository) {
        this.invoiceService = invoiceService;
        this.eventRepository = eventRepository;
    }

    // Generate an invoice for the given event
    @PostMapping("/generate/{eventId}")
    public ResponseEntity<String> generateInvoice(@PathVariable Long eventId, @RequestBody String content) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Event not found"));
        
        // Construct a filename for the invoice based on event or time
        String filename = "invoice_" + event.getTitle() + "_" + System.currentTimeMillis() + ".pdf";

        // Call the service method to generate the invoice
        invoiceService.generateInvoice(filename, content);

        // Create invoice record in DB
        Invoice invoice = new Invoice();
        invoice.setFilename(filename);
        invoice.setContent(content);
        invoice.setStatus("generated");
        invoice.setEvent(event);  // Link the invoice to the event
        event.addInvoice(invoice);  // Assuming Event has method to add invoices
        eventRepository.save(event);

        return ResponseEntity.ok("Invoice generated and saved successfully: " + filename);
    }

    // Get all invoices for a specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Invoice>> getInvoicesForEvent(@PathVariable Long eventId) {
        List<Invoice> invoices = eventRepository.findById(eventId)
                                                 .orElseThrow(() -> new IllegalArgumentException("Event not found"))
                                                 .getInvoices();  // Assuming Event has invoices list
        return ResponseEntity.ok(invoices);
    }

    // Get the details of an invoice by its ID
    @GetMapping("/{invoiceId}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long invoiceId) {
        Invoice invoice = invoiceService.getInvoiceById(invoiceId);  // Optional method in InvoiceService
        return ResponseEntity.ok(invoice);
    }
}
