import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Cow } from "../cow/cow.model";

// Create Order
const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  const [buyer, cow] = await Promise.all([
    User.findById(payload.buyer),
    Cow.findById(payload.cow),
  ]);

  if (!buyer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Buyer not found");
  }
  if (!cow) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cow not found");
  }
  if (cow.label === "sold out") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This cow has already been sold out"
    );
  }

  if (cow.price > buyer.budget) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You need more money to buy this cow"
    );
  }

  const session = await mongoose.startSession();
  let orderData: any = null;
  try {
    session.startTransaction();
    const cowResult = await Cow.findByIdAndUpdate(
      payload.cow,
      {
        label: "sold out",
      },
      { new: true, session }
    );

    const buyerResult = await User.findByIdAndUpdate(
      payload.buyer,
      {
        budget: buyer.budget - cow.price,
      },
      { new: true, session }
    );

    const sellerResult = await User.findByIdAndUpdate(
      cow.seller,
      {
        income: cow.price,
      },
      { new: true, session }
    );

    const updatedDocForOrder = {
      cow: cowResult,
      buyer: buyerResult,
      seller: sellerResult,
      price: cow.price,
    };

    const result = await Order.create([updatedDocForOrder], { session });

    if (!result.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to order");
    }

    orderData = result[0];

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(httpStatus.BAD_REQUEST, "Order creation failed");
  }

  if (orderData) {
    orderData = await Order.findOne({ _id: orderData._id })
      .populate("seller")
      .populate("buyer")
      .populate("cow");
  }

  return orderData;
};

const getAllOrders = async (): Promise<IOrder[] | null | any> => {
  const result = await Order.find({})
    .populate("seller")
    .populate("buyer")
    .populate("cow");

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
};
