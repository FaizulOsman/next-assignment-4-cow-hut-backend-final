import { Request, RequestHandler, Response } from "express";
import { OrderService } from "./order.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IOrder } from "./order.interface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

// Create Order
const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...orderData } = req.body;

    const result = await OrderService.createOrder(orderData);

    // Send Response
    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Created Successfully",
      data: result,
    });
  }
);

const getAllOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await OrderService.getAllOrders(verifiedUser);

    // Send Response
    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get All Orders Successfully",
      data: result,
    });
  }
);

// Get Single Order
const getSingleOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await OrderService.getSingleOrder(id, verifiedUser);

    // Send Response
    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order information retrieved successfully",
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
