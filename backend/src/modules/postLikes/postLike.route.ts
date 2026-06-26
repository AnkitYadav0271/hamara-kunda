import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import {
  doLikePostController,
  getPostLikesController,
  undoLikesController,
} from "./postLike.controller";
const router = Router({ mergeParams: true });

router.post("/:postId/likes", authMiddleware, doLikePostController);
router.get("/:postId/likes", getPostLikesController);
router.delete("/:postId/likes", authMiddleware, undoLikesController);

export default router;
