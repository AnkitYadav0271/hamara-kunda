import {Router} from "express";
import {postController} from "./posts.controller.ts";
import {authMiddleware} from "../../middleware/auth.middleware.ts"


const router = Router({mergeParams:true});


router.post("/create-post",authMiddleware,postController);

export default router;