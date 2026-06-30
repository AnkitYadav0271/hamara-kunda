import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { validateRequired } from "../../utils/validator.ts";
import {
  createEventController,
  deleteEventController,
  FetchEventByIdController,
  fetchEventFeedController,
  updateEventController,
} from "./events.controller.ts";
import { mediaUploadMiddleware } from "../../middleware/mediaUpload.middleware.ts";

const router = Router({ mergeParams: true });

router.post(
  "/",
  mediaUploadMiddleware.single("eventMedia"),
  validateRequired(["eventTitle", "eventType", "isPaid", "startAt", "endAt"]),
  authMiddleware,

  createEventController,
);

router.get("/:eventId", FetchEventByIdController);

router.get("/", fetchEventFeedController);

router.patch(
  "/:eventId",
  mediaUploadMiddleware.none(),
  authMiddleware,

  validateRequired(["eventTitle", "eventType", "isPaid", "startAt", "endAt"]),

  updateEventController,
);

router.delete("/:eventId", authMiddleware, deleteEventController);

export default router;
