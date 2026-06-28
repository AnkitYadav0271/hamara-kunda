import type { NextFunction, Request, Response } from "express";
import { numberConverter } from "../../utils/number.converter.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";
import {
  createBusinessPostService,
  createBusinessService,
  deleteBusinessService,
  getBusinessFeedService,
  updateBusinessService,
} from "./business.services.ts";
import { cloudinaryUploader } from "../../utils/cloudinary-uploader.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";

//*Create business controller
export const createBusinessController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = numberConverter(req.userId);

  if (!userId) {
    throw new NotAuthorizedError();
  }
  let imageUrl;
  if (req.file) {
    imageUrl = await cloudinaryUploader(
      req.file?.Buffer,
      "hamara-kunda/business/profile",
    );
  }

  try {
    let business;
    if (imageUrl) {
      business = await createBusinessService({
        ...req.body,
        userId,
        profileImage: {
          imageUrl: imageUrl.secure_url,
          imagePublicId: imageUrl.public_id,
        },
      });
    } else {
      business = await createBusinessService({
        ...req.body,
        userId,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Business created Successfully",
      business,
    });
  } catch (err) {
    next(err);
  }
};

//* Get BusinessFeed controller

export const getBusinessFeedController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const cursor = req.query.cursor ? Number(req.query.limit) : null;

  if (!limit) {
    throw new BadRequestError("Limit is Missing");
  }

  try {
    const feed = await getBusinessFeedService(limit, cursor!);

    return res
      .status(200)
      .json({ success: true, message: "got the business feed", feed });
  } catch (err) {
    next(err);
  }
};

//*Update Business Controller

export const updateBusinessController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = numberConverter(req.userId);

  const businessId = req.params.businessId
    ? Number(req.params.businessId)
    : null;

  if (!userId) {
    throw new NotAuthorizedError();
  }

  if (!businessId) {
    throw new BadRequestError("businessId is missing");
  }

  const {
    businessName,
    businessAddress,
    businessDescription,
    categoryName,
    email,
    website,
    contactNumber,
  } = req.body;

  try {
    const updatedBusiness = await updateBusinessService({
      businessName,
      businessAddress,
      businessDescription,
      categoryName,
      contactNumber,
      email,
      website,
      id: businessId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "update the business",
      business: updatedBusiness,
    });
  } catch (err) {
    next(err);
  }
};

//*Delete Business Controller

export const deleteBusinessController = async (
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
    throw new BadRequestError("businessId is missing");
  }

  try {
    const deletedBusiness = await deleteBusinessService({ businessId, userId });
    return res.status(200).json({
      success: true,
      message: "business deleted successfully",
      business: deletedBusiness,
    });
  } catch (err) {
    next(err);
  }
};

//* businessPost is here

export const createBusinessPostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId ? Number(req.userId) : null;
    const businessId = req.params.businessId
      ? Number(req.params.businessId)
      : null;

    if (!userId) {
      throw new NotAuthorizedError();
    }

    if (!businessId) {
      throw new BadRequestError("Business id is Missing");
    }

    const businessPost = await createBusinessPostService({
      ...req.body,
      postType:"business",
      businessId,
      userId,
    });

    return res
      .status(201)
      .json({ success: false, message: "created Post", post: businessPost });
  } catch (err) {
    next(err);
  }
};
