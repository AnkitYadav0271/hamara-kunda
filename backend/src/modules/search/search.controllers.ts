import { type NextFunction, type Request, type Response } from "express";
import  {getSearchResultService} from "./search.services.js"

export const getSearchResult = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getSearchResultService(req.query);
    return res.status(200).json({ success: true,message:"search is successful", data });
  } catch (err) {
    next(err);
  }
};