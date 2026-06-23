

CREATE TABLE businesses (
    id INT SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    business_name VARCHAR(255) UNIQUE NOT NULL,

    category_id INT REFERENCES business_categories(id),

    business_description TEXT,

    business_address TEXT,

    website VARCHAR(255),

    contact_number VARCHAR(40),

    email VARCHAR(100)

);

CREATE TABLE business_followers(
    id SERIAL PRIMARY KEY,

    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(business_id,user_id)
);


CREATE TABLE business_likes (
    id SERIAL PRIMARY KEY,

    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(business_id,user_id),
);


CREATE TABLE business_ratings (
    id SERIAL PRIMARY KEY,

    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    rating INT CHECK(rating >= 1 AND rating <= 5),

    review TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(business_id, user_id)
);



CREATE TABLE business_categories (
    id SERIAL PRIMARY KEY,

    category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE business_media(
    id SERIAL PRIMARY KEY,

    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,

    media_url TEXT NOT NULL,

    media_type VARCHAR(50),

    business_media_status VARCHAR(50) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK(business_media_status IN ('active','hidden','deleted'))
);
