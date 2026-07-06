import { pool } from "../../../config/db.ts";

export async function createBusinessFollower(data: {
  businessId: number;
  userId: number;
}) {
  const query = `INSERT INTO business_followers(business_id,user_id) VALUES($1,$2) RETURNING *`;
  const values = [data.businessId, data.userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

export async function getBusinessFollowers(businessId: number) {
  const query = `SELECT COUNT(id) FROM business_followers WHERE business_id = $1`;
  const values = [businessId];

  try {
    const count = (await pool.query(query, values)).rows[0]?.count;
    return count;
  } catch (err) {
    throw err;
  }
}

export async function deleteBusinessFollower(data: {
  businessId: number;
  userId: number;
}) {
  try {
    const query = `DELETE FROM business_followers
                   WHERE business_id = $1
                   AND user_id = $2 RETURNING *`;

    const values = [data.businessId, data.userId];

    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*findFollowerById

export async function findFollowerById(userId: number) {
  const query = `SELECT * FROM business_followers WHERE user_id = $1`;
  const values = [userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}
