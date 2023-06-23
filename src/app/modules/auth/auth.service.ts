import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  ILoginAuth,
  ILoginAuthResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

// Create User
const createAuth = async (payload: IUser): Promise<IUser | null> => {
  const isExist = await User.findOne({ phoneNumber: payload.phoneNumber });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, "Phone Number Already Exist");
  }
  if (!payload.income) {
    payload.income = 0;
  }
  if (payload.role === "seller") {
    payload.budget = 0;
    payload.income = 0;
  }
  if (payload.role === "buyer") {
    payload.income = 0;
  }

  const result = await User.create(payload);
  return result;
};

// Login Auth
const loginAuth = async (payload: ILoginAuth): Promise<ILoginAuthResponse> => {
  const { phoneNumber, password } = payload;

  const authAllData: any = await User.findOne({ phoneNumber });
  const { _id, role } = authAllData;

  const isAuthExist = await User.isUserExist(phoneNumber);

  if (!isAuthExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Auth does not exist");
  }

  if (
    isAuthExist.password &&
    !(await User.isPasswordMatched(password, isAuthExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  // create access token
  const { phoneNumber: phone, password: pass } = isAuthExist;
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

// Refresh Token
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
  // checking deleted auth's refresh token

  const isAuthExist = await User.isUserExist(phone);

  if (!isAuthExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Auth does not exist");
  }

  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      phoneNumber: isAuthExist.phoneNumber,
      password: isAuthExist.password,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createAuth,
  loginAuth,
  refreshToken,
};
