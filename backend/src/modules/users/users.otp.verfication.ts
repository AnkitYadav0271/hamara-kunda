import { pool } from "../../config/db";


export async function createOrReplaceOtp(userId: number, otpHash: string) {
  await pool.query(
    `DELETE FROM otp_verification
     WHERE user_id = $1`,
    [userId],
  );

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return pool.query(
    `
    INSERT INTO otp_verification(
      user_id,
      otp_code_hash,
      purpose,
      expires_at
    )
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [userId, otpHash, "email_verification", expiresAt],
  );
}
