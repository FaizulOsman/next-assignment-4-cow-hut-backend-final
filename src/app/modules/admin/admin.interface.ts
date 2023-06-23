import { Model } from "mongoose";

export type Name = {
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

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

// Admin Model (Static)
export type AdminModel = {
  isAdminExist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, "phoneNumber" | "password">>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
};
