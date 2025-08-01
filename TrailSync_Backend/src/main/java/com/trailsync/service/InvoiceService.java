package com.trailsync.service;

import com.trailsync.model.Invoice;

public interface InvoiceService {
    void generateInvoice(String filename, String content);
    Invoice getInvoiceById(Long invoiceId); 
}
