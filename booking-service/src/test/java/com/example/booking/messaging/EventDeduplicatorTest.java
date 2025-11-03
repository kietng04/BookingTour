package com.example.booking.messaging;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EventDeduplicatorTest {

    private EventDeduplicator deduplicator;

    @BeforeEach
    void setUp() {
        deduplicator = new EventDeduplicator();
    }

    @Test
    void returnsFalseForFirstEvent() {
        boolean duplicate = deduplicator.isDuplicate("abc");
        assertThat(duplicate).isFalse();
    }

    @Test
    void returnsTrueForDuplicateEvent() {
        deduplicator.isDuplicate("abc");
        boolean duplicate = deduplicator.isDuplicate("abc");
        assertThat(duplicate).isTrue();
    }
}
