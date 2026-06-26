import { pool } from "../../config/db.ts";

export async function doLikePost(postId: number, userId: number) {
  const query = `INSERT INTO post_likes(post_id,user_id) VALUES($1,$2) RETURNING *`;
  const values = [postId, userId];

  try {
    const postLike = await pool.query(query, values);
    return postLike;
  } catch (err) {
    throw err;
  }
}

export async function undoLikes(postId: number, userId: number) {
  const query = `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2 RETURNING *`;
  const values = [postId, userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (error) {
    throw error;
  }
}

export async function findLikesByPost(postId: number) {
  const query = `SELECT COUNT(id) FROM post_likes WHERE post_id = $1 `;
  const values = [postId];

  try {
    const likes = await pool.query(query, values);
    return likes.rows[0];
  } catch (error) {
    throw error;
  }
}
