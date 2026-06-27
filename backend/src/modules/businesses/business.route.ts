import { Router } from "express";
import { validateRequired } from "../../utils/validator.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { createBusinessController } from "./business.controller.ts";
const router = Router({ mergeParams: true });

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

export default router;
