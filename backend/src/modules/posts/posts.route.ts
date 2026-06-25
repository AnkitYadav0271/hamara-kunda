import {Router} from "express";
import {getFeedController, postController} from "./posts.controller.ts";
import {authMiddleware} from "../../middleware/auth.middleware.ts"


const router = Router({mergeParams:true});


router.post("/create-post",authMiddleware,postController);
router.get("/",getFeedController)

export default router;