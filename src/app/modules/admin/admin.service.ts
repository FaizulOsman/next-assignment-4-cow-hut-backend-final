import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";

// Create Admin
const createAdmin = async (payload: IAdmin): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ phoneNumber: payload.phoneNumber });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, "Phone Number Already Exist");
  }
  if (payload.role !== "admin") {
    throw new ApiError(httpStatus.BAD_GATEWAY, "Role should be admin");
  }

  const result = await Admin.create(payload);
  return result;
};

export const AdminService = {
  createAdmin,
};
