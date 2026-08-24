-- Seed data for local/dev testing.
-- Run AFTER all five schema files (user, business, posts, events, alert).
-- Safe to re-run: uses explicit ids + ON CONFLICT (id) DO NOTHING, so
-- running it twice won't error or duplicate rows.
--
-- Order matters here for the same reason it mattered for the schema files:
-- each INSERT below can only reference ids from tables already populated
-- above it (users before businesses, businesses before posts, etc).

-- 1. business_categories (no dependencies)
INSERT INTO business_categories (id, category_name) VALUES
  (1, 'Food & Beverage'),
  (2, 'Retail'),
  (3, 'Services')
ON CONFLICT (id) DO NOTHING;

-- 2. event_types (no dependencies)
INSERT INTO event_types (id, category_name) VALUES
  (1, 'Community'),
  (2, 'Cultural'),
  (3, 'Business')
ON CONFLICT (id) DO NOTHING;

-- 3. users
-- password for every seeded user is: Password123!
-- (real bcrypt hash below, so you can actually log in and get a JWT to test
--  auth-gated routes, not just read endpoints)
INSERT INTO users
  (id, full_name, user_name, email, password_hash, role, email_verified_at)
VALUES
  (1, 'Alice Sharma', 'alice_sharma', 'alice@example.com',
   '$2b$10$FomFli2b3F.j8mtRP8hjQ.VdLmzfRoNhPi7VdaPtmV9ZRGSg/SPlG',
   'user', CURRENT_DATE),
  (2, 'Ravi Kumar', 'ravi_kumar', 'ravi@example.com',
   '$2b$10$FomFli2b3F.j8mtRP8hjQ.VdLmzfRoNhPi7VdaPtmV9ZRGSg/SPlG',
   'user', CURRENT_DATE),
  (3, 'Priya Singh', 'priya_singh', 'priya@example.com',
   '$2b$10$FomFli2b3F.j8mtRP8hjQ.VdLmzfRoNhPi7VdaPtmV9ZRGSg/SPlG',
   'user', NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. businesses (each owned by a user, each in a category)
INSERT INTO businesses
  (id, user_id, business_name, category_id, business_description, business_address, contact_number, email)
VALUES
  (1, 1, 'Sharma Sweets', 1, 'Traditional Indian sweets and snacks', 'MG Road, Piacenza', '+39 123456789', 'contact@sharmasweets.com'),
  (2, 2, 'Kumar Electronics', 2, 'Mobile phones and accessories', 'Station Road, Piacenza', '+39 987654321', 'info@kumarelectronics.com')
ON CONFLICT (id) DO NOTHING;

-- 5. posts (mix of plain user posts and business posts)
INSERT INTO posts (id, user_id, business_id, post_title, post_description, post_type) VALUES
  (1, 1, NULL, 'Community cleanup this weekend', 'Join us for a neighborhood cleanup drive on Saturday morning.', 'user'),
  (2, 1, 1,    'New sweets for the festival season', 'Sharma Sweets is now taking orders for festival gift boxes.', 'business'),
  (3, 2, 2,    'Diwali sale on all electronics', 'Flat 20% off on all mobile accessories this week.', 'business'),
  (4, 3, NULL, 'Looking for a good plumber recommendation', 'Anyone know a reliable plumber in the area?', 'user')
ON CONFLICT (id) DO NOTHING;

-- 6. events (mix of free/paid, tied to a business + event type)
INSERT INTO events
  (id, user_id, business_id, event_title, event_description, event_type_id, is_paid, ticket_price, start_at, end_at)
VALUES
  (1, 1, NULL, 'Neighborhood Cleanup Drive', 'Community event, all welcome, bring gloves.', 1, FALSE, NULL,
   '2026-09-05 09:00:00', '2026-09-05 12:00:00'),
  (2, 2, 2, 'Electronics Expo', 'Live demos of the newest gadgets, entry ticketed.', 3, TRUE, 10,
   '2026-09-12 10:00:00', '2026-09-12 18:00:00')
ON CONFLICT (id) DO NOTHING;

-- 7. alerts
INSERT INTO alerts (id, user_id, title, description, alert_type, alert_status, is_urgent, approved_by) VALUES
  (1, 3, 'Water supply disruption on MG Road', 'Municipal work will disrupt water supply from 10am to 2pm tomorrow.', 'alert', 'approved', TRUE, 1),
  (2, 1, 'New community center opening', 'The new center on Station Road opens to the public next month.', 'announcement', 'pending', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Because the rows above use explicit ids instead of letting SERIAL assign
-- them, each table's auto-increment sequence doesn't know these ids were
-- used. Without this step, the NEXT row your app inserts (e.g. someone
-- registering through POST /users) could collide with a seeded id and
-- throw a duplicate key error. This pushes each sequence past the highest
-- seeded id so future inserts continue safely from there.
SELECT setval(pg_get_serial_sequence('business_categories', 'id'), (SELECT MAX(id) FROM business_categories));
SELECT setval(pg_get_serial_sequence('event_types', 'id'), (SELECT MAX(id) FROM event_types));
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('businesses', 'id'), (SELECT MAX(id) FROM businesses));
SELECT setval(pg_get_serial_sequence('posts', 'id'), (SELECT MAX(id) FROM posts));
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
SELECT setval(pg_get_serial_sequence('alerts', 'id'), (SELECT MAX(id) FROM alerts));