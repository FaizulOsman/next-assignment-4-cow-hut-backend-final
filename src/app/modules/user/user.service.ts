import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { IUser, IUserFilters } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constants";

// Get All Users (can also filter)
const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<any> => {
  // Try not to use any
  const { searchTerm, ...filtersData } = filters;

  const andConditions: any = []; // Try not to use any

  if (searchTerm) {
    andConditions?.push({
      $or: userSearchableFields?.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortCondition: "" | { [key: string]: SortOrder } = sortBy &&
    sortOrder && { [sortBy]: sortOrder };

  const whereCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get Single User
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findOne({ _id: id });
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const { name, ...UserData } = payload;

  const updateUserData: Partial<IUser> = { ...UserData };

  // dynamically handling nested fields
  if (name && Object.keys(name)?.length > 0) {
    Object.keys(name).forEach((key) => {
      const nameKey = `name.${key}` as keyof Partial<IUser>; // `name.firstName`
      (updateUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updateUserData, {
    new: true,
  });
  return result;
};

// Delete User
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete({ _id: id });
  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
