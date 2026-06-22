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

    bio VARCHAR(250),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);