import { CreateUserData, User } from "../../utils/users.types.ts";
import { createUser, findUserByEmail } from "./users.repository.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import bcrypt from "bcrypt";
import { createOrReplaceOtp } from "./users.otp.verfication.ts";


export async function registerUserService(data: CreateUserData) {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new BadRequestError(
      "User with this email already exists please login",
    );
  }

  const hashedPassword = await bcrypt.hash(data.passwordHash, 10);

  const newData = {
    email: data.email,
    name: data.name,
    userName: data.userName,
    passwordHash: hashedPassword,
  };
  
  const result = await createUser(newData);

  const otp = createOrReplaceOtp()
  return result;
}
