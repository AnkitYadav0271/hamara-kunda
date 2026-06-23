CREATE TABLE posts (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    post_description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    post_status VARCHAR(20) DEFAULT 'active'
    CHECK(post_status IN ('active','hidden','deleted'))
);


CREATE TABLE post_media (
    id SERIAL PRIMARY KEY,

    post_id INT REFERENCES posts(id) ON DELETE CASCADE,

    media_url TEXT,

    media_type VARCHAR(20)
);

CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,

    post_id INT REFERENCES posts(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id,post_id)
);


CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,

    post_id INT REFERENCES posts(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    comment TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    comment_status VARCHAR(50) DEFAULT 'active',

    CHECK(comment_status IN ('active','hidden','deleted'))
);


CREATE TABLE comment_likes(
    id SERIAL PRIMARY KEY,

    comment_id INT REFERENCES post_comments(id) ON DELETE CASCADE,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(comment_id,user_id)
);

