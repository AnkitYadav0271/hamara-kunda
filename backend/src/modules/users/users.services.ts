import { CreateUserData, loginData, User } from "../../utils/users.types.ts";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "./users.repository.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import bcrypt from "bcrypt";
import { createOrReplaceOtp } from "./users.otp.verification.ts";
import { emailVerification } from "../../utils/email-verification.ts";
import { jwtTokenSign } from "../../utils/jwt.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";

//*Register User
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

//*Login user

export async function loginUserService(data: loginData) {
  const existingUser = await findUserByEmail(data.email);

  if (!existingUser) {
    throw new NotAuthorizedError("Email or password is Incorrect");
  }

  const match = await bcrypt.compare(data.password, existingUser.password_hash);

  if (!match) {
    throw new NotAuthorizedError("Email or password is Incorrect");
  }

  const accessToken = await jwtTokenSign(existingUser.id, "60d");

  return {
    accessToken,
    user: {
      id: existingUser.id,
      fullName: existingUser.full_name,
      userName: existingUser.user_name,
      profilePicture: existingUser.profile_image,
    },
  };
}

//*Get currentUserService

export const currentUserService = async (id: number) => {
  const user = await findUserById(id);
  if(!user){
    throw new BadRequestError("User not found please login ");
  }

  return user;
};
