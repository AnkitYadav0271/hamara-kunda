import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { getFeedService, postService } from "./posts.services";
import { getFeedRepo } from "./posts.repository";

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

export const getFeedController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Math.min(Number(req.query.limit), 40) : 20;
    console.log("got the request!! and controller");
    const posts = await getFeedService(cursor, limit);
    console.log("posts at controller ::", posts);
    return res
      .status(200)
      .json({ success: true, message: "got the feed", posts });
  } catch (err) {
    next(err);
  }
};
