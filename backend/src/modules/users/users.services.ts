import { CreateUserData, loginData, User } from "../../utils/users.types.ts";
import {
  countFollowers,
  countFollowing,
  createUser,
  findUserByEmail,
  findUserById,
  followUser,
  getOptByUserId,
  isUserFollowing,
  unfollowUser,
  verifyUserEmail,
} from "./users.repository.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import bcrypt from "bcrypt";
import { createOrReplaceOtp } from "./users.otp.verification.ts";
import { sendEmailVerification } from "../../utils/email-verification.ts";
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

  await sendEmailVerification(user.email, otp);

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
  if (!user) {
    throw new BadRequestError("User not found please login ");
  }

  return user;
};

//*followUserService

export async function followUserService(data: {
  followingId: number;
  followerId: number;
}) {
  const isUserFollows = await isUserFollowing(data);
  if (isUserFollows) {
    throw new BadRequestError("You are already following this user");
  }

  return await followUser(data);
}

//*unfollowUserService

export async function unfollowUserService(data: {
  followingId: number;
  followerId: number;
}) {
  return await unfollowUser(data);
}

//*countFollowersCountService

export async function countFollowersService(userId: number) {
  return await countFollowers(userId);
}

//*countFollowingCountService
export async function countFollowingService(userId: number) {
  return await countFollowing(userId);
}

//*VerifyEmail Service

export async function verifyEmailService(data: {
  otp: string;
  userId: number;
}) {
  const savedOtp = await getOptByUserId(data.userId);
  if (!savedOtp) {
    throw new BadRequestError("Please signup first");
  }

  if (Date.now() > savedOtp.expires_at) {
    throw new BadRequestError("Otp Expired please regenerate opt");
  }

  const otpMatches = bcrypt.compare(savedOtp.hashed_otp, String(data.otp));
  if (!otpMatches) {
    throw new BadRequestError("Otp did not match");
  }

  await verifyUserEmail(data.userId);

  return { success: true, message: "otp verified successfully" };
}
