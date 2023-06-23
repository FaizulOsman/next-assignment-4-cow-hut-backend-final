import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { IUser } from "../user/user.interface";
import config from "../../../config";
import { ILoginAuthResponse, IRefreshTokenResponse } from "./auth.interface";

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

// Login Auth
const loginAuth = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginAuth(loginData);
  const { refreshToken, ...others } = result;

  // Set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAuthResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Auth logged in successfully !",
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Auth logged in successfully !",
    data: result,
  });
});

export const AuthController = {
  createAuth,
  loginAuth,
  refreshToken,
};
