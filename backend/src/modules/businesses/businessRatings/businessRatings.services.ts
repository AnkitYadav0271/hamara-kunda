import { findBusinessById } from "../../businesses/business.repository.ts";
import { NotFoundError } from "../../../errors/not-found-error.ts";
import { NotAuthorizedError } from "../../../errors/not-authorised-error.ts";
import { findUserById } from "../../users/users.repository.ts";
import { BusinessRatingData } from "./businessRatings.types.ts";
import {
  createRating,
  deleteRating,
  fetchBusinessRatings,
  findRatingById,
  updateRating,
} from "./businessRatings.repository.ts";
import { BadRequestError } from "../../../errors/bad-request-error.ts";
import { ForbiddenError } from "../../../errors/forbidden-error.ts";

//*Create Rating service
export async function createRatingService(data: BusinessRatingData) {
  const business = await findBusinessById(data.businessId);
  if (!business) {
    throw new NotFoundError("Can not find business");
  }

  const user = await findUserById(data.userId);
  if (!user) {
    throw new NotAuthorizedError();
  }

  if (data.rating > 5 || data.rating < 0) {
    throw new BadRequestError("rating should be between 0 and 5");
  }

  return await createRating(data);
}

//*Update rating service

export async function updateRatingService(data: {
  rating: number;
  review: string;
  userId: number;
  ratingId: number;
}) {
  const rating = await findRatingById(data.ratingId);
  if (!rating) {
    throw new NotFoundError("can not find rating with given Rating id");
  }

  if (rating.user_id != data.userId) {
    throw new ForbiddenError();
  }

  if (data.rating > 5 || data.rating < 0) {
    throw new BadRequestError("rating should be greater between 0 and 5");
  }

  return await updateRating(data);
}

//*fetchBusinessRatingServices

export async function fetchBusinessRatingsService(businessId: number) {
  const business = await findBusinessById(businessId);
  if (!business) {
    throw new NotFoundError("Can not found the business");
  }

  return await fetchBusinessRatings(businessId);
}

//*delete Rating services

export async function deleteRatingService(data: {
  ratingId: number;
  userId: number;
}) {
  const rating = await findRatingById(data.ratingId);
  if (!rating) {
    throw new NotFoundError("can not find rating");
  }

  if (rating.user_id != data.userId) {
    throw new ForbiddenError();
  }

  return await deleteRating(data);
}
