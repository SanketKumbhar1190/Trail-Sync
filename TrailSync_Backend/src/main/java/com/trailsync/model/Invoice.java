package com.trailsync.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String content;
    private String status;  // Can be "generated", "pending", etc.

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;  // Link this invoice to an event, for easier tracking.

}

