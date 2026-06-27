import { Business, BusinessDataIO } from "./business.types";
import { findUserById } from "../users/users.repository.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";
import {
  createBusiness,
  findCategoryIdByCategoryName,
} from "./business.repository";
import { BadRequestError } from "../../errors/bad-request-error.ts";

export async function createBusinessService(
  data: BusinessDataIO,
): Promise<Business | undefined> {
  try {
    const userId = data.userId;
    const category = data.categoryName;

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
