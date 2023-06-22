import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { IUser } from "../user/user.interface";

// Create Auth
const createAuth: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;

    const result = await AuthService.createAuth(userData);

    // Send Response
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Created Successfully",
      data: result,
    });
  }
);

export const AuthController = {
  createAuth,
};
