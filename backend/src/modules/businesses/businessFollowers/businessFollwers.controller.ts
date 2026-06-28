import type { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../../../errors/not-authorised-error.ts";
import { BadRequestError } from "../../../errors/bad-request-error.ts";
import {
  createBusinessFollowerService,
  deleteBusinessFollowerService,
  fetchBusinessFollowerService,
} from "./businessFollowers.services.ts";

export const createBusinessFollowerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const businessId = req.params.businessId
    ? Number(req.params.businessId)
    : null;

  if (!userId) {
    throw new NotAuthorizedError();
  }

  if (!businessId) {
    throw new BadRequestError("Business id is missing");
  }

  try {
    const follower = await createBusinessFollowerService({
      businessId,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "created follower successfully",
      follower,
    });
  } catch (err) {
    next(err);
  }
};

//*fetchBusinessFollowers

export const fetchBusinessFollowersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const businessId = req.params.businessId
    ? Number(req.params.businessId)
    : null;

  if (!businessId) {
    return new BadRequestError("Business id is missing");
  }

  try {
    const followers = await fetchBusinessFollowerService(businessId);

    return res
      .status(200)
      .json({ success: true, message: "got the follower count", followers });
  } catch (err) {
    next(err);
  }
};

//*deleteBusinessFollowerController

export const deleteBusinessFollowerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const businessId = req.params.businessId
    ? Number(req.params.businessId)
    : null;

  if (!userId) {
    throw new NotAuthorizedError();
  }

  if (!businessId) {
    throw new BadRequestError("Business Id is missing");
  }

  try {
    const deletedFollower = await deleteBusinessFollowerService({
      businessId,
      userId,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "unfollowed business",
        follower: deletedFollower,
      });
  } catch (err) {
    next(err);
  }
};
