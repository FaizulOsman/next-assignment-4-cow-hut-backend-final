import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { ICow, ICowFilters } from "./cow.interface";
import { Cow } from "./cow.model";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { cowSearchableFields } from "./cow.constants";
import { User } from "../user/user.model";

// Create Cow
const createCow = async (payload: ICow): Promise<ICow | null> => {
  payload.label = "for sale";
  // Throw error when seller not found
  const seller = await User.find({ _id: payload.seller });
  if (seller.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");
  }

  const result = (await Cow.create(payload)).populate("seller");
  return result;
};

// Get All Cows (can also filter)
const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<any> => {
  // Try not to use any
  const { searchTerm, ...filtersData } = filters;

  const andConditions: any = []; // Try not to use any

  if (searchTerm) {
    andConditions?.push({
      $or: cowSearchableFields?.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === "maxPrice") {
          return { price: { $lte: value } };
        } else if (field === "minPrice") {
          return { price: { $gte: value } };
        }
        return { [field]: value };
      }),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortCondition: "" | { [key: string]: SortOrder } = sortBy &&
    sortOrder && { [sortBy]: sortOrder };

  const whereCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereCondition)
    .populate("seller")
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get Single Cow
const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findOne({ _id: id }).populate("seller");
  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
  verifiedSeller: any
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cow not found");
  }

  // Verification for seller of the cow
  const cowSeller = await Cow.findOne({
    $and: [{ _id: id }, { seller: verifiedSeller?._id }],
  }).populate("seller");

  if (!cowSeller) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You're not the seller of the cow!"
    );
  }

  const { ...CowData } = payload;

  const updateCowData: Partial<ICow> = { ...CowData };

  const result = await Cow.findOneAndUpdate({ _id: id }, updateCowData, {
    new: true,
  }).populate("seller");
  return result;
};

// Delete Cow
const deleteCow = async (
  id: string,
  verifiedSeller: any
): Promise<ICow | null> => {
  const findCow = await Cow.findOne({ _id: id });

  if (!findCow) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cow Not Found!");
  }

  // Verification for seller of the cow
  const cowSeller = await Cow.findOne({
    seller: verifiedSeller?._id,
  }).populate("seller");

  if (!cowSeller) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You're not the seller of the cow!"
    );
  }

  const result = await Cow.findByIdAndDelete({ _id: id }).populate("seller");

  return result;
};

export const CowService = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
