import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if (
    err instanceof SyntaxError &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
  }

  
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  console.error(err);

  return res.status(500).send({
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
};
  