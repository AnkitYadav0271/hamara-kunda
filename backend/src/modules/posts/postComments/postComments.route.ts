import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.ts";
import {
  createPostCommentController,
  deletePostCommentController,
  getPostCommentController,
  updatePostCommentController,
} from "./postComments.controllers.ts";

const router = Router({ mergeParams: true });

router.post("/:postId/comment", authMiddleware, createPostCommentController);
router.get("/:postId/comments", getPostCommentController);
router.patch(
  "/comment/:commentId",
  authMiddleware,
  updatePostCommentController,
);
router.delete(
  "/comment/:commentId",
  authMiddleware,
  deletePostCommentController,
);

export default router;