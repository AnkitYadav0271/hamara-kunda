import { pool } from "../../../config/db.ts";
import { BusinessRatingData } from "./businessRatings.types.ts";

//*function create Rating
export async function createRating(data: BusinessRatingData) {
  const query = `INSERT INTO business_ratings(business_id,user_id,rating,review) VALUES($1,$2,$3,$4) RETURNING *`;
  const values = [data.businessId, data.userId, data.rating, data.review];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*updateRating

export async function updateRating(data: {
  ratingId: number;
  userId: number;
  rating: number;
  review: string;
}) {
  const query = `UPDATE business_ratings SET rating = $1 , review = $2 WHERE id = $3 AND user_id = $4 RETURNING *`;
  const values = [data.rating, data.review, data.ratingId, data.userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*deleteRating

export async function deleteRating(data: { ratingId: number; userId: number }) {
  const query = `DELETE from business_ratings WHERE id = $1 AND user_id = $2`;
  const values = [data.ratingId, data.userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*Get business Reviews

export async function fetchBusinessRatings(businessId: number) {
  const query = `
SELECT
    br.id,
    br.business_id,
    br.user_id,
    br.rating,
    br.review,
    br.created_at,

    u.full_name,
    u.user_name,
    u.profile_image

FROM business_ratings br
JOIN users u
    ON br.user_id = u.id
WHERE br.business_id = $1
ORDER BY br.created_at DESC;
`;
  const values = [businessId];

  try {
    return (await pool.query(query, values)).rows;
  } catch (err) {
    throw err;
  }
}

//*findRatingById

export async function findRatingById(ratingId: number) {
  const query = `SELECT * FROM business_ratings WHERE id = $1`;
  const values = [ratingId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}
