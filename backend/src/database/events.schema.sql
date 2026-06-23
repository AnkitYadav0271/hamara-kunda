
CREATE TABLE events (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    event_title TEXT NOT NULL,

    event_description TEXT,

    event_address TEXT,

    event_type_id INT REFERENCES event_types(id),

    is_public BOOLEAN DEFAULT TRUE,

    is_paid BOOLEAN DEFAULT FALSE,

    ticket_price INT,

    start_at TIMESTAMP,

    end_at TIMESTAMP,

    event_status VARCHAR(20) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        event_status IN (
            'draft',
            'active',
            'cancelled',
            'completed'
        )
    ),

    CHECK (
        (is_paid = FALSE AND ticket_price IS NULL)
        OR
        (is_paid = TRUE AND ticket_price >= 0)
    ),

    CHECK (end_at >= start_at)
);


CREATE TABLE event_media (
    id SERIAL PRIMARY KEY,

    event_id INT REFERENCES events(id) ON DELETE CASCADE,

    media_url TEXT NOT NULL,

    media_type VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    media_status VARCHAR(20) DEFAULT 'active',

    CHECK (
        media_status IN (
            'active',
            'hidden',
            'deleted'
        )
    )
);

CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);