import type { Request, Response, NextFunction } from "express";
import {
  doLikePostService,
  getPostLikesService,
  undoLikeService,
} from "./postLike.services.ts";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotAuthorizedError } from "../../errors/not-authorised-error";

//*do like controller
export const doLikePostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const postId = req.params.postId ? Number(req.params.postId) : null;
  if (!postId) {
    throw new BadRequestError("post is missing");
  }

  if (!userId) {
    throw new NotAuthorizedError();
  }
  try {
    const like = await doLikePostService(postId, userId);
    return res
      .status(201)
      .json({ success: true, message: "liked the post", like });
  } catch (err) {
    next(err);
  }
};

//*getLikes of post

export const getPostLikesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.postId ? Number(req.params.postId) : null;
  if (!postId) {
    throw new BadRequestError("postId missing");
  }

  try {
    const likes = await getPostLikesService(postId);

    return res
      .status(200)
      .json({ success: true, message: "got the post likes", likes });
  } catch (err) {
    next(err);
  }
};

//* undoLikes

export const undoLikesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const postId = req.params.postId ? Number(req.params.postId) : null;
  if (!postId) {
    throw new BadRequestError("postId is missing");
  }
  if (!userId) {
    throw new NotAuthorizedError();
  }
  try {
    const undoLike = await undoLikeService(postId, userId);

    return res
      .status(200)
      .json({ success: true, message: "undoPost Like successfully", undoLike });
  } catch (err) {
    throw err;
  }
};
