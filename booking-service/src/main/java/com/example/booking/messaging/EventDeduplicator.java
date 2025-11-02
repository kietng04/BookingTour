package com.example.booking.messaging;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class EventDeduplicator {

    private static final int MAX_CACHE_SIZE = 2000;
    private static final long TTL_MILLIS = Duration.ofMinutes(15).toMillis();

    private final Map<String, Long> processedEvents = new ConcurrentHashMap<>();

    public boolean isDuplicate(String key) {
        if (key == null || key.isBlank()) {
            return false;
        }
        long now = System.currentTimeMillis();
        Long existing = processedEvents.putIfAbsent(key, now);
        if (existing != null) {
            return true;
        }
        if (processedEvents.size() > MAX_CACHE_SIZE) {
            processedEvents.entrySet().removeIf(entry -> now - entry.getValue() > TTL_MILLIS);
        }
        return false;
    }
}
