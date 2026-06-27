import type { NextFunction, Request, Response } from "express";
import { numberConverter } from "../../utils/number.converter.ts";
import { NotAuthorizedError } from "../../errors/not-authorised-error.ts";
import { createBusinessService } from "./business.services.ts";
import { cloudinaryUploader } from "../../utils/cloudinary-uploader.ts";

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
        userId
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
