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

    console.log("Query result for findUserById")

    return result.rows[0];
  } catch (err) {
    throw err;
  }
}
