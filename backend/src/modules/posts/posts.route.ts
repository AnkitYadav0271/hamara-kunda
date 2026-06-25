import {Router} from "express";
import {getFeedController, getPostController, postController} from "./posts.controller.ts";
import {authMiddleware} from "../../middleware/auth.middleware.ts"


const router = Router({mergeParams:true});


router.post("/create-post",authMiddleware,postController);
router.get("/",getFeedController);
router.get("/:postId",getPostController);

export default router;