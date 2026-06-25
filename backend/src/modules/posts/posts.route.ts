import { Router } from "express";
import {
  deletePostController,
  getFeedController,
  getPostDetailsController,
  postController,
  updatePostController,
} from "./posts.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const router = Router({ mergeParams: true });

router.post("/create-post", authMiddleware, postController);
router.get("/", getFeedController);
router.get("/:postId", getPostDetailsController);
router.patch("/:postId", authMiddleware, updatePostController);
router.delete("/:postId", authMiddleware, deletePostController);

export default router;
