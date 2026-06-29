import type { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../../../errors/not-authorised-error.ts";
import { BadRequestError } from "../../../errors/bad-request-error.ts";
import {
  createRatingService,
  deleteRatingService,
  fetchBusinessRatingsService,
  updateRatingService,
} from "./businessRatings.services.ts";

export const createRatingController = async (
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

  let { rating, review } = req.body;
  rating = Number(rating);

  try {
    const cratedRating = await createRatingService({
      rating,
      review,
      userId,
      businessId,
    });

    return res.status(201).json({
      success: true,
      message: "created rating success fully",
      rating: cratedRating,
    });
  } catch (err) {
    next(err);
  }
};

//*updateRating

export const updateRatingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const ratingId = req.params.ratingId ? Number(req.params.ratingId) : null;

  if (!userId) {
    throw new NotAuthorizedError();
  }

  if (!ratingId) {
    throw new BadRequestError("ratingId is missing");
  }

  let { rating, review } = req.body;
  rating = Number(rating);

  try {
    const updatedRating = await updateRatingService({
      ratingId,
      userId,
      rating,
      review,
    });

    return res.status(200).json({
      success: true,
      message: "updated review successfully",
      rating: updatedRating,
    });
  } catch (err) {
    next(err);
  }
};

//*fetchBusinessRating controller

export const fetchBusinessRatingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const businessId = req.params.businessId
    ? Number(req.params.businessId)
    : null;

  if (!businessId) {
    throw new BadRequestError("businessId is missing");
  }

  try {
    const businessRatings = await fetchBusinessRatingsService(businessId);
    return res.status(200).json({
      success: true,
      message: "got the ratings",
      ratings: businessRatings,
    });
  } catch (err) {
    next(err);
  }
};

//*deleteBusinessRatingController

export const deleteRatingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const ratingId = req.params.ratingId ? Number(req.params.ratingId) : null;

  if (!userId) {
    throw new NotAuthorizedError();
  }

  if (!ratingId) {
    throw new BadRequestError("ratingId is missing");
  }

  try {
    const deleted = await deleteRatingService({ userId, ratingId });

    return res.status(200).json({
      success: true,
      message: "rating deleted successfully",
      deletedRating: deleted,
    });
  } catch (err) {
    next(err);
  }
};
