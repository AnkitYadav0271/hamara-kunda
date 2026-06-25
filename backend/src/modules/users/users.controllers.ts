import { NextFunction, response, type Request, type Response } from "express";
import {
  currentUserService,
  loginUserService,
  registerUserService,
} from "./users.services.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";

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

  console.log("logging userId:",userId);

  const user = await currentUserService(userId);

  if (!user) {
    throw new NotAuthorizedError("User not found");
  }

  return res
    .status(200)
    .json({ success: true, user: { ...user, password_hash: "" } });
};
