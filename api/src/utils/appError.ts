export class AppError extends Error {
  statusCode: number;
  errors: Record<string, unknown>;

  constructor(
    statusCode: number = 500, // Default status code to 500
    message: string,
    errors: Record<string, unknown> = {}, // Default errors to empty object
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // Validate the status code is within HTTP range (100-599)
    if (statusCode < 100 || statusCode > 599) {
      throw new Error(`Invalid status code: ${statusCode}`);
    }

    // Capture the stack trace if it's not provided
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
