import { Router } from "express";
import {
  currentUserController,
  loginUserController,
  registerUserController,
} from "./users.controllers.ts";
import { validateRequired } from "../../utils/validator.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const router = Router({ mergeParams: true });

router.post(
  "/register",
  validateRequired(["fullName", "userName", "email", "password"]),
  registerUserController,
);
router.post(
  "/login",
  validateRequired(["email", "password"]),
  loginUserController,
);

router.post("/currentUser", authMiddleware, currentUserController);

export default router;
