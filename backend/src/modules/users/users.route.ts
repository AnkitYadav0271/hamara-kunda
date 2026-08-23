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

/* 
Register route

user should only register if fullName, username,email,and password are provided
*/

router.post(
  "/register",
  validateRequired(["fullName", "userName", "email", "password"]),
  registerUserController,
);

/* 
Register route

user should only login if email,and password are provided
*/

router.post(
  "/login",
  validateRequired(["email", "password"]),
  loginUserController,
);

//*currentUser Route

/** 
 * Authentication is required to get current logged in user
 * 
 */
router.get("/currentUser", authMiddleware, currentUserController);

//*follow user Route
/**
 * Authentication is required to follow user
 */
router.post("/:followingId/follow", authMiddleware, followUserController);

// Unfollow User Route
/**
 * Authentication is Required to unfollow user
 */
router.delete("/:followingId", authMiddleware, unfollowUserController);

// Followers count Route

router.get("/:userId/followers/count", countFollowersController);
router.get("/:userId/following/count", countFollowingController);

//verify-email-route
/**
 * Authentication is required.
 * Should be able to verify if opt is provided
 */
router.post(
  "/verify-email",
  authMiddleware,
  validateRequired(["otp"]),
  verifyEmailController,
);

export default router;
