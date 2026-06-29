import { pool } from "../../../config/db.ts";
import { Comment } from "./postComments.types.ts";

//*Create post comments
export async function createPostComment(
  postId: number,
  userId: number,
  comment: string,
): Promise<Comment | null | undefined> {
  const query = `INSERT INTO post_comments(post_id,user_id,comment) VALUES($1,$2,$3) RETURNING *`;
  const values = [postId, userId, comment];
  try {
    const comment = await pool.query(query, values);
    return comment.rows[0];
  } catch (err) {
    throw err;
  }
}

//*GetPostComments

export async function getPostComments(
  postId: number,
): Promise<Comment[] | any[]> {
  const query = `SELECT * FROM post_comments WHERE post_id = $1 AND comment_status =$2 `;
  const value = [postId, "active"];
  try {
    return (await pool.query(query, value)).rows;
  } catch (err) {
    throw err;
  }
}

//*Edit postComment

export async function updatePostComment(
  commentId: number,
  userId: number,
  comment: string,
): Promise<Comment | undefined | null> {
  const query = `UPDATE post_comments SET comment = $1 , updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND user_id = $3 RETURNING *`;

  const values = [comment, commentId, userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*DeletePostComment

export async function deletePostComment(commentId: number, userId: number) {
  const query = `UPDATE  post_comments SET comment_status = $3 WHERE id = $1 AND user_id = $2 RETURNING *`;
  const values = [commentId, userId, "deleted"];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*FindPostById

export async function findPostCommentById(
  postId: number,
): Promise<Comment | undefined | null> {
  try {
    const query = `SELECT * FROM post_comments WHERE id = $1`;
    const values = [postId];

    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}
