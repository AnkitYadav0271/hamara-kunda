import { findUserById } from "../../users/users.repository.ts";
import { NotFoundError } from "../../../errors/not-found-error.ts";
import { findBusinessById } from "../../businesses/business.repository.ts";
import {
  createBusinessFollower,
  deleteBusinessFollower,
  findFollowerById,
  getBusinessFollowers,
} from "./businessFollower.repository.ts";
import { BadRequestError } from "../../../errors/bad-request-error.ts";

export async function createBusinessFollowerService(data: {
  businessId: number;
  userId: number;
}) {
  const user = await findUserById(data.userId);
  if (!user) {
    throw new NotFoundError("Can not found user with given Id");
  }

  const business = await findBusinessById(data.businessId);

  if (!business) {
    throw new NotFoundError("Can not find business");
  }

  const alreadyFollowed = await findFollowerById(data.userId);

  if (alreadyFollowed) {
    throw new BadRequestError("You have already followed the business");
  }

  return await createBusinessFollower({
    businessId: data.businessId,
    userId: data.userId,
  });
}

//*get Business Followers

export async function fetchBusinessFollowerService(businessId: number) {
  const business = await findBusinessById(businessId);

  if (!business) {
    throw new NotFoundError("Can not find business");
  }
  const count = await getBusinessFollowers(businessId);
  console.log("logging the count :", count);
  return count;
}

//* deleteFollower

export async function deleteBusinessFollowerService(data: {
  businessId: number;
  userId: number;
}) {
  return await deleteBusinessFollower(data);
}
