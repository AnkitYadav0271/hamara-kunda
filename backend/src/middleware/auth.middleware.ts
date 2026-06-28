import type { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorised-error";
import { decodeToken } from "../utils/jwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    throw new NotAuthorizedError("token not found please login");
  }

  const decoded =  decodeToken(token);

  req.userId = decoded;
  next();
};
