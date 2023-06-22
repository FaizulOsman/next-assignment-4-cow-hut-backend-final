import { IGenericErrorMessage } from "../interfaces/error";
import { IGenericErrorResponse } from "../interfaces/common";
import { ZodError, ZodIssue } from "zod";

// This function handles Zod errors and returns a formatted error response
const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path?.length - 1],
      message: issue?.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessage: errors,
  };
};

export default handleZodError;
