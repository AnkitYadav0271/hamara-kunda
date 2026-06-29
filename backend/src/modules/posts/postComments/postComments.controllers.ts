import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../../errors/bad-request-error";
import { NotAuthorizedError } from "../../../errors/not-authorised-error";
import {
  createPostCommentService,
  deletePostCommentService,
  getPostCommentsService,
  updatePostCommentService,
} from "./postComments.services";

//*Create comment Controller
export const createPostCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.postId ? Number(req.params.postId) : null;
  const userId = req.userId ? Number(req.userId) : null;
  const { comment } = req.body;

  if (!comment?.trim()) {
    throw new BadRequestError("comment can't be empty");
  }
  if (!postId) {
    throw new BadRequestError("postId is Missing");
  }

  if (!userId) {
    throw new NotAuthorizedError("User is not authorized");
  }

  try {
    const createdComment = await createPostCommentService(
      postId,
      userId,
      comment,
    );

    if (!createdComment) {
      return res.status(400).json({
        success: false,
        message: "Unable to create comment due to technical reasons",
        createdComment,
      });
    }

    return res.status(200).json({
      success: true,
      message: "created comment successfully",
      comment: createdComment,
    });
  } catch (err) {
    next(err);
  }
};

//*Get comment Post

export const getPostCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.postId ? Number(req.params.postId) : null;
  if (!postId) {
    throw new BadRequestError("postId is missing");
  }

  try {
    const comments = await getPostCommentsService(postId);

    return res
      .status(200)
      .json({ success: true, message: "got the comments", comments });
  } catch (err) {
    next(err);
  }
};

//*updatePostComment

export const updatePostCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const commentId = req.params.commentId ? Number(req.params.commentId) : null;
  const userId = req.userId ? Number(req.userId) : null;

  const { comment } = req.body;

  if (!comment?.trim()) {
    throw new BadRequestError("comment can't be empty");
  }

  if (!commentId) {
    throw new BadRequestError("commentId is Missing");
  }

  if (!userId) {
    throw new NotAuthorizedError();
  }

  try {
    const updatedComment = await updatePostCommentService(
      commentId,
      userId,
      comment,
    );

    return res.status(200).json({
      success: false,
      message: "updated comment successfully",
      comment: updatedComment,
    });
  } catch (err) {
    next(err);
  }
};

//*DeletePostComment

export const deletePostCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const commentId = req.params.commentId ? Number(req.params.commentId) : null;

  if (!commentId) {
    throw new BadRequestError("commentId is missing");
  }

  if (!userId) {
    throw new NotAuthorizedError();
  }

  try {
    const deletedComment = await deletePostCommentService(commentId, userId);

    return res
      .status(200)
      .json({
        success: true,
        message: "comment deleted successfully",
        comment: deletedComment,
      });
  } catch (err) {
    next(err);
  }
};
