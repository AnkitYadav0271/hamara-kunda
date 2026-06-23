import { CustomError } from "./custom-error.js";

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(public message = "Access denied") {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
