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
