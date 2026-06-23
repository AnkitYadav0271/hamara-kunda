import { CustomError } from "./custom-error.js";

export class DatabaseError extends CustomError {
  statusCode = 500;

  constructor(public message = "Database error") {
    super(message);

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
