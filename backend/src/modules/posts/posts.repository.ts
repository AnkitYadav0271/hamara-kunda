import { PostDataRepo } from "./post.types";
import { pool } from "../../config/db.ts";

export async function createPost(data: PostDataRepo) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const query =
      "INSERT INTO posts(user_id,post_title,post_description,post_type,business_id) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const values = [
      data.userId,
      data.title,
      data.description,
      data.postType,
      data.businessId,
    ];

    const post = await client.query(query, values);

    //*uploading media in future we may required a loop for something similar when we have multiple post

    if (data.mediaDetails) {
      const mediaQuery =
        "INSERT INTO post_media(post_id,cloud_id,media_url,media_type) VALUES($1,$2,$3,$4) RETURNING *";
      const mediaValues = [
        post.rows[0].id,
        data.mediaDetails.cloud_id,
        data.mediaDetails.mediaUrl,
        "image",
      ];

      await client.query(mediaQuery, mediaValues);
    }
    await client.query("COMMIT");

    console.log("logging post", post);
    return post.rows[0];
  } catch (err) {
    client.query("ROLLBACK");
    throw err;
  } finally {
    await client.release();
  }
}

export async function getFeedRepo(cursor?: number, limit: number = 20) {
  let query: string;
  let values: any[];

  try {
    console.log("Starting the query ::");
    if (!cursor) {
      query = `
      SELECT
        p.id,
        p.post_title,
        p.post_description,
        p.post_type,
        p.created_at,

        u.id as user_id,
        u.full_name as full_name,
        u.user_name,
        u.profile_image

      FROM posts p
      JOIN users u
      ON p.user_id = u.id

      WHERE p.post_status = 'active'

      ORDER BY p.id DESC

      LIMIT $1
    `;

      values = [limit];
    } else {
      query = `
      SELECT
        p.id,
        p.post_title,
        p.post_description,
        p.post_type,
        p.created_at,

        u.id as user_id,
        u.name as full_name,
        u.user_name,
        u.profile_image

      FROM posts p
      JOIN users u
      ON p.user_id = u.id

      WHERE
        p.post_status = 'active'
        AND p.id < $1

      ORDER BY p.id DESC

      LIMIT $2
    `;

      values = [cursor, limit];
    }

    const result = await pool.query(query, values);

    console.log("this is the result!!", result);

    return result.rows;
  } catch (err) {
    throw err;
  }
}

//* Find postDetails by Id;

export async function getPostDetails(id: number) {
  try {
    const query = `
SELECT
    p.id,
    p.post_title,
    p.post_description,
    p.post_type,
    p.created_at,

    u.id AS user_id,
    u.full_name,
    u.user_name,
    u.profile_image,

    pm.id AS media_id,
    pm.media_url,
    pm.media_type

FROM posts p

JOIN users u
ON u.id = p.user_id

LEFT JOIN post_media pm
ON pm.post_id = p.id

WHERE
    p.id = $1
    AND p.post_status = 'active'
`;
    const values = [id];
    return (await pool.query(query, values)).rows;
  } catch (err) {
    throw err;
  }
}

//* getPostById

export async function findPostById(id: number) {
  try {
    const query = `SELECT * FROM posts WHERE id = $1`;
    const values = [id];

    const post = await pool.query(query, values);
    return post.rows[0];
  } catch (error) {
    throw error;
  }
}

//* updatePost

export async function updatePost(
  id: number,
  title: string,
  description: string,
) {
  try {
    const query = `UPDATE posts SET
                post_title = $1 , post_description = $2 ,updated_at = CURRENT_TIMESTAMP
                WHERE id = $3 RETURNING *`;

    const values = [title, description, id];

    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//* Delete Post

export async function deletePost(id: number) {
  try {
    const query = `UPDATE posts SET post_status = $2 WHERE id = $1 RETURNING *`;
    const value = [id, "deleted"];

    return (await pool.query(query, value)).rows[0];
  } catch (err) {
    throw err;
  }
}
