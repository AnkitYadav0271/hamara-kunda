import { Router } from "express";
import { registerUserController } from "./users.controllers.ts";

const router = Router({ mergeParams: true });

router.post("/register", registerUserController);

export default router;
