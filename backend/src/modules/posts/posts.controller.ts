import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { postService } from "./posts.services";

export const postController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, postType, businessId } = req.body;

  const file = req.file;
  const userId = req.userId;

  try {
    if (!title.trim()) {
      throw new BadRequestError("title is Required");
    }

    const post = await postService({
      title,
      description,
      postType,
      userId,
      media: file,
      businessId,
    });

    return res
      .status(201)
      .json({ success: true, message: "post uploaded successfully", post });
  } catch (err) {
    next(err);
  }
};
