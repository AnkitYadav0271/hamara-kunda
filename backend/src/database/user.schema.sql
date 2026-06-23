CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(30),

    user_name VARCHAR(100) UNIQUE NOT NULL,

    mobile_no VARCHAR(12) UNIQUE,

    email VARCHAR(70) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    date_of_birth DATE,

    role VARCHAR(20) DEFAULT 'user',

    profile_image VARCHAR(250),

    bio TEXT,

    is_verified DATE DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE otp_verifications (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    otp_code VARCHAR(10) NOT NULL,

    purpose VARCHAR(20),

    expires_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);