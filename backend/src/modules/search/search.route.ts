import { Router } from "express";
import {getSearchResult} from "./search.controllers.js"
const router = Router({ mergeParams: true });
router.get("/", getSearchResult);
export default router;
