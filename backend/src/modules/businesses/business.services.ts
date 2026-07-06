import { Business, BusinessDataIO, UpdateBusinessData } from "./business.types";
import { findUserById } from "../users/users.repository.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";
import { NotFoundError } from "../../errors/not-found-error.ts";
import {
  createBusiness,
  deleteBusiness,
  findBusinessById,
  findBusinessByName,
  findCategoryIdByCategoryName,
  getAllBusinesses,
  updateBusiness,
} from "./business.repository.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import { ForbiddenError } from "../../errors/forbidden-error.ts";
import { PostDataService } from "../posts/post.types.ts";
import { createPost } from "../posts/posts.repository.ts";

//*Create Business Service
export async function createBusinessService(
  data: BusinessDataIO,
): Promise<Business | undefined> {
  try {
    const userId = data.userId;
    const category = data.categoryName;

    const businessNameTaken = await findBusinessByName(data.businessName);
    if (businessNameTaken) {
      throw new BadRequestError(
        "Business Name is already taken please try different name",
      );
    }

    const categoryId = await findCategoryIdByCategoryName(category);
    if (!categoryId) {
      throw new BadRequestError("Invalid category name");
    }

    const user = await findUserById(userId);
    if (!user) {
      throw new NotAuthorizedError();
    }

    const business = await createBusiness({ ...data, categoryId });

    return business;
  } catch (err) {
    throw err;
  }
}

//*GetBusinessFeed

export async function getBusinessFeedService(
  limit: number,
  cursor?: number,
): Promise<Business[] | null> {
  if (!limit) {
    throw new BadRequestError("Missing Limit");
  }

  try {
    const businessFeed = await getAllBusinesses(limit, cursor);

    return businessFeed;
  } catch (err) {
    throw err;
  }
}

//*update business

export async function updateBusinessService(data: UpdateBusinessData) {
  //*Checking if business is present or not
  try {
    const business = await findBusinessById(data.id);
    if (!business) {
      throw new NotFoundError("Can't find business");
    }

    //*Checking if user is allowed to update or not
    if (business.user_id != data.userId) {
      throw new ForbiddenError("User is not allowed to update this business");
    }

    //*Checking the business name is available or not
    const isNameTaken = await findBusinessByName(data.businessName);
    console.log("Logging is nameTaken : ", isNameTaken);
    if (isNameTaken && isNameTaken.id != data.id) {
      throw new BadRequestError("Business Name is already used");
    }

    //*finding business_categoryId

    const categoryId = await findCategoryIdByCategoryName(data.categoryName);

    if (!categoryId) {
      throw new BadRequestError("Invalid Category name ");
    }

    const updatedBusiness = await updateBusiness({
      ...data,
      categoryId: categoryId,
    });
    return updatedBusiness;
  } catch (err) {
    throw err;
  }
}

//*Delete Business Service

export async function deleteBusinessService(data: {
  businessId: number;
  userId: number;
}): Promise<Business | null> {
  const business = await findBusinessById(data.businessId);

  if (!business) {
    throw new NotFoundError("Can not find business");
  }

  if (business.user_id != data.userId) {
    throw new ForbiddenError("User is not allowed to perform this operation");
  }

  return await deleteBusiness(data.businessId);
}

//*createBusinessPost Service

export async function createBusinessPostService(data: PostDataService) {
  if (!data.businessId) {
    throw new BadRequestError("Business is not present please post as User");
  }
  const business = await findBusinessById(data.businessId);
  if (!business) {
    throw new NotFoundError("can not found business");
  }

  if (business.user_id != data.userId) {
    throw new ForbiddenError();
  }

  //!yahaan pe photos upload karenge cloudinary se

  const post = await createPost(data);
  return post;
}
