import { Router } from "express";
import {
  createBusinessFollowerController,
  deleteBusinessFollowerController,
  fetchBusinessFollowersController,
} from "./businessFollwers.controller";
import { authMiddleware } from "../../../middleware/auth.middleware.ts";

const router = Router({ mergeParams: true });

router.post(
  "/:businessId/follow",
  authMiddleware,
  createBusinessFollowerController,
);

router.get("/:businessId/follow", fetchBusinessFollowersController);

router.delete(
  "/:businessId/follow",
  authMiddleware,
  deleteBusinessFollowerController,
);

export default router;
