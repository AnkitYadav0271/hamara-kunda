import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.ts";
import { validateRequired } from "../../../utils/validator.ts";
import {
  createRatingController,
  deleteRatingController,
  fetchBusinessRatingController,
  updateRatingController,
} from "./businessRatings.controller.ts";
const router = Router({ mergeParams: true });

router.post(
  "/:businessId/ratings",
  validateRequired(["rating", "review"]),
  authMiddleware,
  createRatingController,
);

router.patch(
  "/rating/:ratingId",
  validateRequired(["rating", "review"]),
  authMiddleware,
  updateRatingController,
);

router.get("/:businessId/ratings", fetchBusinessRatingController);

router.delete("/rating/:ratingId", authMiddleware, deleteRatingController);

export default router;
