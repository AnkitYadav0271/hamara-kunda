import { pool } from "../../config/db.ts";
import { CreateUserDataRepo, User } from "../../utils/users.types.ts";

//*______________________________________________________//
//* ______________CREATE USER REPO FUNCTION______________//
//*______________________________________________________//

export async function createUser(data: CreateUserDataRepo) {
  const query = `INSERT INTO users(full_name,user_name,email,password_hash)
   VALUES($1,$2,$3,$4)
    RETURNING id, email,full_name,user_name,created_at`;

  const values = [data.fullName, data.userName, data.email, data.passwordHash];

  const result = await pool.query(query, values);

  return result.rows[0];
}

//*______________________________________________________//
//* ___________GET USER BY EMAIL REPO FUNCTION___________//
//*______________________________________________________//

export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  const query = `SELECT * FROM USERS 
                   WHERE email = $1`;
  const values = [email];

  const result = await pool.query(query, values);

  return result.rows[0];
}

//*______________________________________________________//
//* ___________GET USER BY ID FUNCTION___________//
//*______________________________________________________//

export async function findUserById(id: number) {
  try {
    const query = `SELECT * FROM users WHERE id = $1`;
    const values = [id];

    const result = await pool.query(query, values);

    console.log("Query result for findUserById");

    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

//*______________________________________________________//
//* ___________ADD  USER FOLLOWER REPO___________//
//*______________________________________________________//

export async function followUser(data: {
  followingId: number;
  followerId: number;
}) {
  const query =
    "INSERT INTO user_followers(following_id,follower_id) VALUES($1,$2) RETURNING *";
  const values = [data.followerId, data.followerId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*______________________________________________________//
//* ___________UNFOLLOW USER FUNCTION___________//
//*______________________________________________________//

export async function unfollowUser(data: {
  followingId: number;
  followerId: number;
}) {
  const query = `DELETE FROM user_followers WHERE following_id = $1 AND follower_id = $2 RETURNING *`;
  const values = [data.followingId, data.followerId];
  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*______________________________________________________//
//* ___________CHECK IF USER FOLLOWS OR NOT FUNCTION_____//
//*______________________________________________________//

export async function isUserFollowing(data: {
  followingId: number;
  followerId: number;
}) {
  try {
    const query = `SELECT * FROM user_followers WHERE following_id = $1 AND follower_id = $2`;
    const values = [data.followingId, data.followerId];

    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*______________________________________________________//
//* ___________GET FOLLOWING COUNT_____//
//*______________________________________________________//

export async function countFollowers(userId: number) {
  const query = `SELECT COUNT(*) as follower_count FROM user_followers WHERE following_id = $1`;
  const values = [userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*______________________________________________________//
//* ___________CHECK IF USER FOLLOWS OR NOT FUNCTION_____//
//*______________________________________________________//

export async function countFollowing(userId: number) {
  const query = `SELECT COUNT(*) as follower_count FROM user_followers WHERE follower_id = $1`;
  const values = [userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*______________________________________________________//
//* ___________GET OTP by Id FUNCTION_____//
//*______________________________________________________//

export async function getOptByUserId(userId: number) {
  const query = `SELECT * FROM email_verifications where user_id = $1`;
  const values = [userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*______________________________________________________//
//* ___________Verify user email_________________________//
//*______________________________________________________//

export async function verifyUserEmail(userId: number) {
  const query = `UPDATE users SET email_verified_at = CURRENT_TIMESTAMP WHERE id = $1`;
  const values = [userId];
  return pool.query(query, values);
}
