import { Model } from "mongoose";

type Name = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  password: string;
  role: "admin";
  name: Name;
  phoneNumber: string;
  address: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
};
