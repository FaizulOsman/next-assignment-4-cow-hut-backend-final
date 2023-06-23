import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import { role } from "./user.constants";
import bcrypt from "bcrypt";

// User Schema
export const UserSchema = new Schema<IUser>(
  {
    password: { type: String, required: true },
    role: { type: String, enum: role, required: true },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    phoneNumber: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true, // It will add createdAt & updatedAt fields
    toJSON: {
      // If we use it, we will get _id as id
      virtuals: true,
    },
  }
);

UserSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, "phoneNumber" | "password"> | null> {
  return await User.findOne({ phoneNumber }, { phoneNumber: 1, password: 1 });
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre("save", async function (next) {
  // Hashing Password
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(process.env.bcrypt_salt_rounds)
  );

  next();
});

export const User = model<IUser, UserModel>("User", UserSchema);
