import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAdmin, ILoginAdmin, ILoginAdminResponse } from "./admin.interface";
import { Admin } from "./admin.model";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

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

// Login Admin
const loginAdmin = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload;

  const adminAllData: any = await Admin.findOne({ phoneNumber });
  const { _id, role } = adminAllData;

  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist");
  }

  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  // create access token
  const { phoneNumber: phone, password: pass } = isAdminExist;
  const accessToken = jwtHelpers.createToken(
    { phone, pass, _id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  // create refresh token
  const refreshToken = jwtHelpers.createToken(
    { phone, pass, _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AdminService = {
  createAdmin,
  loginAdmin,
};
