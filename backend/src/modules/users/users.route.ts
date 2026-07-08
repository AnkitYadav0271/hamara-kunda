import { Router } from "express";
import {
  countFollowersController,
  countFollowingController,
  currentUserController,
  followUserController,
  loginUserController,
  registerUserController,
  unfollowUserController,
  verifyEmailController,
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

router.get("/currentUser", authMiddleware, currentUserController);

router.post("/:followingId/follow", authMiddleware, followUserController);
router.delete("/:followingId", authMiddleware, unfollowUserController);
router.get("/:userId/followers/count", countFollowersController);
router.get("/:userId/following/count", countFollowingController);

//verify-email-route

router.post(
  "/verify-email",
  authMiddleware,
  validateRequired(["otp"]),
  verifyEmailController,
);

export default router;
