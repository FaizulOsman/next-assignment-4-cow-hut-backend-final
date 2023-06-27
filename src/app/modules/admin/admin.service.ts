import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import {
  IAdmin,
  ILoginAdmin,
  ILoginAdminResponse,
  IRefreshTokenResponse,
} from "./admin.interface";
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

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { phone } = verifiedToken;

  // If you deleted from database But your refresh token is exist
  // checking deleted admin's refresh token

  const isAdminExist = await Admin.isAdminExist(phone);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist");
  }

  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      phoneNumber: isAdminExist.phoneNumber,
      password: isAdminExist.password,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

// Get My Profile
const getMyProfile = async (
  verifiedAdmin: any
): Promise<IAdmin[] | null | any> => {
  let result = null;

  if (verifiedAdmin) {
    result = await Admin.find(
      { _id: verifiedAdmin._id },
      { name: 1, phoneNumber: 1, address: 1 }
    );

    if (!result.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "No data found!");
    }
  }

  return result;
};

// Update My Profile
const updateMyProfile = async (
  verifiedAdmin: any,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ _id: verifiedAdmin._id });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin not found");
  }

  const { name, ...AdminData } = payload;

  const updateAdminData: Partial<IAdmin> = { ...AdminData };

  // dynamically handling nested fields
  if (name && Object.keys(name)?.length > 0) {
    Object.keys(name).forEach((key) => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>; // `name.firstName`
      (updateAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate(
    { _id: verifiedAdmin._id },
    updateAdminData,
    {
      new: true,
    }
  );
  return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getMyProfile,
  updateMyProfile,
};
