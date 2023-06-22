import { Schema, model } from "mongoose";
import { IOrder, OrderModel } from "./order.interface";

// Order Schema
const orderSchema = new Schema<IOrder, OrderModel>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      ref: "Cow",
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Order = model<IOrder, OrderModel>("Order", orderSchema);
