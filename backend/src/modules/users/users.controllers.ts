import { type NextFunction, type Request, type Response } from "express";
import {
  countFollowersService,
  countFollowingService,
  currentUserService,
  followUserService,
  loginUserService,
  registerUserService,
  verifyEmailService,
} from "./users.services.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";
import { unfollowUser } from "./users.repository.ts";

//*register user
export const registerUserController = async (req: Request, res: Response) => {
  const user = await registerUserService(req.body);

  return res.status(201).json({
    success: true,
    message: "User created successfully. Please verify Email",
    user,
  });
};

//*login user

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await loginUserService(req.body);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const currentUserController = async (req: Request, res: Response) => {
  let userId = req.userId;

  if (!userId) {
    throw new BadRequestError("User not found please login");
  }

  userId = Number(userId);

  console.log("logging userId:", userId);

  const user = await currentUserService(userId);

  if (!user) {
    throw new NotAuthorizedError("User not found");
  }

  return res
    .status(200)
    .json({ success: true, user: { ...user, password_hash: "" } });
};

//*followUserController

export const followUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const followerId = req.userId ? Number(req.userId) : null;
  if (!followerId) {
    throw new NotAuthorizedError();
  }

  const followingId = req.params.followingId
    ? Number(req.params.followingId)
    : null;
  if (!followingId) {
    throw new BadRequestError("followingId is missing");
  }

  try {
    const following = await followUserService({ followerId, followingId });
    return res
      .status(200)
      .json({ success: true, message: "following successfully", following });
  } catch (err) {
    next(err);
  }
};

//*unfollowUserController

export const unfollowUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const followerId = req.userId ? Number(req.userId) : null;
  if (!followerId) {
    throw new NotAuthorizedError();
  }

  const followingId = req.params.followingId
    ? Number(req.params.followingId)
    : null;

  if (!followingId) {
    throw new BadRequestError("followingId is missing");
  }

  try {
    const unfollow = await unfollowUser({ followerId, followingId });
    return res
      .status(200)
      .json({ success: true, message: "unfollowedUser", unfollowed: unfollow });
  } catch (err) {
    throw err;
  }
};

//*countFollower

export const countFollowersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.userId ? Number(req.params.userId) : null;
  if (!userId) {
    throw new BadRequestError("userId missing");
  }

  try {
    const followerCount = await countFollowersService(userId);
    return res
      .status(200)
      .json({ success: true, message: "got followers count", followerCount });
  } catch (err) {
    next(err);
  }
};

//*countFollowingController

export const countFollowingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.userId ? Number(req.params.userId) : null;
  if (!userId) {
    throw new BadRequestError("userId missing");
  }

  try {
    const followingCount = await countFollowingService(userId);
    return res
      .status(200)
      .json({ success: false, message: "got following count", followingCount });
  } catch (err) {
    next(err);
  }
};

//*verifyEmailController

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const { otp } = req.body;

  if (!userId) {
    throw new BadRequestError("Please register first");
  }

  try {
    const result = await verifyEmailService({ userId, otp });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
