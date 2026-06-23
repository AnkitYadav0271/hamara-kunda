import { pool } from "../../config/db.ts";
import { CreateUserData, User } from "../../utils/users.types.ts";

//*______________________________________________________//
//* ______________CREATE USER REPO FUNCTION______________//
//*______________________________________________________//

export async function createUser(data: CreateUserData) {
  const query = `INSERT INTO users(full_name,user_name,email,password_hash)
   VALUES($1,$2,$3,$4)
    RETURNING *`;

  const values = [data.name, data.userName, data.email, data.passwordHash];

  const result = await pool.query(query, values);

  return result;
}


//*______________________________________________________//
//* ___________GET USER BY EMAIL REPO FUNCTION___________//
//*______________________________________________________//

export async function findUserByEmail(email:string): Promise< User | undefined>{
    const query = `SELECT * FROM USERS 
                   WHERE email = $1`;
    const values = [email];
    
    const result = await pool.query(query,values);

    return result.rows[0];
}

