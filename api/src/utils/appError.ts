export class AppError extends Error {
  statusCode: number;
  errors?: Record<string, unknown>;

  constructor(statusCode: number, message: string, errors?: Record<string, unknown>, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
