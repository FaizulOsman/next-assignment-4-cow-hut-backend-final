import { Schema, model } from "mongoose";
import { IAdmin, AdminModel } from "./admin.interface";
import bcrypt from "bcrypt";

// Admin Schema
export const AdminSchema = new Schema<IAdmin>(
  {
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], required: true },
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
  },
  {
    timestamps: true, // It will add createdAt & updatedAt fields
    toJSON: {
      // If we use it, we will get _id as id
      virtuals: true,
    },
  }
);

AdminSchema.pre("save", async function (next) {
  // Hashing Password
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(process.env.bcrypt_salt_rounds)
  );

  next();
});

export const Admin = model<IAdmin, AdminModel>("Admin", AdminSchema);
