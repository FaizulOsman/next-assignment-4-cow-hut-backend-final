import { Request, RequestHandler, Response } from "express";
import { OrderService } from "./order.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IOrder } from "./order.interface";

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
    const result = await OrderService.getAllOrders();

    // Send Response
    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get All Orders Successfully",
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
  getAllOrders,
};
