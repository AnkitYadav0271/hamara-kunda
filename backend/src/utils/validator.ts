import { BadRequestError } from "../errors/bad-request-error";
import type { Request, Response, NextFunction } from "express";

export function validateRequired(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (!req.body[field]) {
        throw new BadRequestError(`${field} is required`);
      }
    }

    next();
  };
}
