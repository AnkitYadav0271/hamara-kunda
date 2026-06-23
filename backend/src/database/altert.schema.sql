CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    alert_type VARCHAR(50) DEFAULT 'news',

    alert_status VARCHAR(20) DEFAULT 'pending',

    is_urgent BOOLEAN DEFAULT FALSE,

    approved_by INT REFERENCES users(id),

    approved_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        alert_type IN (
            'news',
            'alert',
            'announcement',
            'emergency'
        )
    ),

    CHECK (
        alert_status IN (
            'pending',
            'approved',
            'rejected'
        )
    )
);


CREATE TABLE alert_media (
    id SERIAL PRIMARY KEY,

    alert_id INT REFERENCES alerts(id) ON DELETE CASCADE,

    media_url TEXT NOT NULL,

    media_type VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alert_likes (
    id SERIAL PRIMARY KEY,

    alert_id INT REFERENCES alerts(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(alert_id, user_id)
);

