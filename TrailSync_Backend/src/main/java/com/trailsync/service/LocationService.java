package com.trailsync.service;

import java.util.List;
import java.util.Optional;

import com.trailsync.model.Location;

public interface LocationService {
    // Fetch all locations
    List<Location> getAllLocations();

    // Fetch a single location by ID
    Optional<Location> getLocationById(Long id);

    // Create or update a location
    Location saveLocation(Location location);

    // Delete a location by ID
    void deleteLocation(Long id);
}
