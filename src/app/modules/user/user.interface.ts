import { Model } from "mongoose";

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  password: string;
  role: "seller" | "buyer";
  name: UserName;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

// User Model
export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
};
