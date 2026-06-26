import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import {
  deletePostService,
  getFeedService,
  getPostDetailsService,
  postService,
  updatePostDetailsService,
} from "./posts.services";
import { getFeedRepo } from "./posts.repository";
import { error } from "node:console";
import { NotAuthorizedError } from "../../errors/not-authorised-error";

export const postController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, postType, businessId } = req.body;

  const file = req.file;
  const userId = req.userId;

  try {
    if (!title?.trim()) {
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

//*getPOstDetails

export const getPostDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postId = req.params.postId ? Number(req.params.postId) : null;
    if (!postId) {
      throw new BadRequestError("PostId is required");
    }

    const post = await getPostDetailsService(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post is not available or not active",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "got the requested post", post });
  } catch (err) {
    next(err);
  }
};

//*updatePostDetails

export const updatePostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postId = req.params.postId ? Number(req.params.postId) : null;
    if (!postId) {
      throw new BadRequestError("missing postId");
    }

    const { title, description } = req.body;

    if (!title?.trim()) {
      return new BadRequestError("title is Required");
    }

    const userId = req.userId ? Number(req.userId) : null;

    if (!userId) {
      throw new NotAuthorizedError();
    }

    const post = await updatePostDetailsService(
      postId,
      userId,
      title,
      description,
    );

    return res
      .status(200)
      .json({ success: true, message: "updated post", post });
  } catch (err) {
    next(err);
  }
};

//*DeletePostController

export const deletePostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.postId ? Number(req.params.postId) : null;
  const userId = req.userId;

  if (!postId) {
    throw new BadRequestError("postId is missing");
  }

  if (!userId) {
    throw new NotAuthorizedError();
  }

  try {
    const post = await deletePostService(postId, userId);

    return res
      .status(200)
      .json({ success: true, message: "post deleted successfully", post });
  } catch (err) {
    next(err);
  }
};
