import { Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import {
  IAdmin,
  ILoginAdminResponse,
  IRefreshTokenResponse,
} from "./admin.interface";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";

// Create Admin
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;

    const postData: any = await AdminService.createAdmin(adminData);
    postData.set("password", undefined, { strict: false });
    const result = await postData;
    // Send Response
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Created Successfully",
      data: result,
    });
  }
);

// Login Admin
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.loginAdmin(loginData);
  const { refreshToken, ...others } = result;

  // Set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin logged in successfully !",
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AdminService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin logged in successfully !",
    data: result,
  });
});

// Get My Profile
const getMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AdminService.getMyProfile(verifiedUser);

    // Send Response
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin's information retrieved successfully",
      data: result,
    });
  }
);

// Update My Profile
const updateMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedAdmin = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const updateData = req.body;

    const result = await AdminService.updateMyProfile(
      verifiedAdmin,
      updateData
    );

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      data: result,
    });
  }
);

export const AdminController = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getMyProfile,
  updateMyProfile,
};
