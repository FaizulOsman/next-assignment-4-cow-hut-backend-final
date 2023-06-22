import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

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

export const AuthService = {
  createAuth,
};
