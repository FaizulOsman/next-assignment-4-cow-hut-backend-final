import { Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAdmin, ILoginAdminResponse } from "./admin.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { userFilterableFields } from "../user/user.constants";
import config from "../../../config";

// Create Admin
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;

    const result = await AdminService.createAdmin(adminData);

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

export const AdminController = {
  createAdmin,
  loginAdmin,
};
