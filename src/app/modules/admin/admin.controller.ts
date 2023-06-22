import { Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAdmin } from "./admin.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { userFilterableFields } from "../user/user.constants";

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

// // Get all admins
// const getAllAdmins: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const filters = pick(req.query, userFilterableFields);
//     const paginationOptions = pick(req.query, paginationFields);

//     const result = await AdminService.getAllAdmins(filters, paginationOptions);

//     // Send Response
//     sendResponse<IAdmin>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Get All Admins Successfully",
//       data: result,
//     });
//   }
// );

// // Get single user by id
// const getSingleUser: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const result = await UserService.getSingleUser(id);

//     // Send Response
//     sendResponse<IUser>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Get Single User Successfully",
//       data: result,
//     });
//   }
// );

// // Update User
// const updateUser: RequestHandler = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const updateData = req.body;

//   const result = await UserService.updateUser(id, updateData);

//   sendResponse<IUser>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User updated successfully",
//     data: result,
//   });
// });

// // Delete User
// const deleteUser: RequestHandler = catchAsync(async (req, res) => {
//   const id = req.params.id;

//   const result = await UserService.deleteUser(id);

//   sendResponse<IUser>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User deleted successfully",
//     data: result,
//   });
// });

export const AdminController = {
  createAdmin,
  //   getAllAdmins,
  //   getSingleUser,
  //   updateUser,
  //   deleteUser,
};
