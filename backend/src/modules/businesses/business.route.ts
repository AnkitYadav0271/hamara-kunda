import { Router } from "express";
import { validateRequired } from "../../utils/validator.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import {
  createBusinessController,
  createBusinessPostController,
  deleteBusinessController,
  getBusinessFeedController,
  updateBusinessController,
} from "./business.controller.ts";
const router = Router({ mergeParams: true });

//*create business route
router.post(
  "/create",
  validateRequired([
    "businessName",
    "categoryName",
    "businessAddress",
    "contactNumber",
  ]),
  authMiddleware,
  createBusinessController,
);

//*get business feed
router.get("/", getBusinessFeedController);

//*update business
router.patch(
  "/:businessId",
  validateRequired([
    "businessName",
    "categoryName",
    "businessAddress",
    "contactNumber",
  ]),
  authMiddleware,
  updateBusinessController,
);

//*delete business
router.delete("/:businessId", authMiddleware, deleteBusinessController);

//*upload businessPost
router.post(
  "/:businessId/post",
  validateRequired(["title"]),
  authMiddleware,
  createBusinessPostController,
);

export default router;
