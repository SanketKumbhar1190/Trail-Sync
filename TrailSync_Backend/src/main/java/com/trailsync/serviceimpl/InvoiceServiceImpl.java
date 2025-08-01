package com.trailsync.serviceimpl;

import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.trailsync.model.Invoice;
import com.trailsync.repository.InvoiceRepository;
import com.trailsync.service.InvoiceService;

@Service
public class InvoiceServiceImpl implements InvoiceService {


	@Autowired
    private  InvoiceRepository invoiceRepository;

	
    @Override
    public void generateInvoice(String filename, String content) {
        try {
            // Initialize PdfWriter with the output path
            PdfWriter writer = new PdfWriter(new FileOutputStream(filename));

            // Initialize PdfDocument with the writer
            PdfDocument pdfDocument = new PdfDocument(writer);

            // Create a Document object for adding content
            Document document = new Document(pdfDocument);
            document.add(new Paragraph(content));

            // Close the document
            document.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public Invoice getInvoiceById(Long invoiceId) {
        // Fetch the invoice by ID or throw exception if not found
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with ID: " + invoiceId));
    }
}
