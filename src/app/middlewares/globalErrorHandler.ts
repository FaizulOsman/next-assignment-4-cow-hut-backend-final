import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { IGenericErrorMessage } from "../../interfaces/error";
import handleValidationError from "../../errors/handleValidationError";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { errorLogger } from "../../shared/logger";
import { ZodError } from "zod";
import handleZodError from "../../errors/handleZodError";
import handleCastError from "../../errors/handleCastError";

// Global error handler middleware
const globalErrorHandler: ErrorRequestHandler = (
  error, // Error object representing a validation error
  req: Request, // Express request object
  res: Response, // Express response object
  next: NextFunction // Express next (Don't remove)
) => {
  // Log errors in production environment otherwise log in console
  config.env === "development"
    ? console.log("🔥 GlobalErrorHandler => ", error)
    : console.log("🔥 GlobalErrorHandler => ", error);

  let statusCode = 500; // Default status code for internal server errors
  let message = "Something went wrong!"; // Default error message
  let errorMessage: IGenericErrorMessage[] = []; // Array to store detailed error messages

  // Check if the error is a validation error
  if (error?.name === "ValidationError") {
    // Handle the validation error
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
  // Check if the error is an instance of the custom ZodError class
  else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
  // Check if the error is an CastError
  else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
  // Check if the error is an instance of the custom ApiError class
  else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessage = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }
  // Check if the error is a generic Error object
  else if (error instanceof Error) {
    message = error?.message;
    errorMessage = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
