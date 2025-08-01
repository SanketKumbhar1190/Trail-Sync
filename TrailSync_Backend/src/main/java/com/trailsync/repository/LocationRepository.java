package com.trailsync.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trailsync.model.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
    // You can define custom query methods if needed
}
