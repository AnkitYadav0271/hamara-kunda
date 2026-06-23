import type { ValidationError } from "express-validator";
import { CustomError } from "./custom-error.js";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error: any) => ({
      message: error.msg,
      field: error.path,
    }));
  }
}
