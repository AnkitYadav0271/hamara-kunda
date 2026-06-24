import { CreateUserData, User } from "../../utils/users.types.ts";
import { createUser, findUserByEmail } from "./users.repository.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import bcrypt from "bcrypt";
import { createOrReplaceOtp } from "./users.otp.verification.ts";
import { emailVerification } from "../../utils/email-verification.ts";

export async function registerUserService(data: CreateUserData) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  const user = await createUser({
    ...data,
    passwordHash: hashedPassword,
  });

  await createOrReplaceOtp(user.id, hashedOtp);

  await emailVerification(user.email, otp);

  return user;
}
