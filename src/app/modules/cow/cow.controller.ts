import { Request, RequestHandler, Response } from "express";
import { CowService } from "./cow.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ICow } from "./cow.interface";
import pick from "../../../shared/pick";
import { cowFilterableFields } from "./cow.constants";
import { paginationFields } from "../../../constants/pagination";

// Create Cow
const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...cowData } = req.body;

    const result = await CowService.createCow(cowData);

    // Send Response
    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow Created Successfully",
      data: result,
    });
  }
);

// Get all cows
const getAllCows: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, cowFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await CowService.getAllCows(filters, paginationOptions);

    // Send Response
    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get All Cows Successfully",
      data: result,
    });
  }
);

// Get single Cow by id
const getSingleCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await CowService.getSingleCow(id);

    // Send Response
    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get Single Cow Successfully",
      data: result,
    });
  }
);

// Update Cow
const updateCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await CowService.updateCow(id, updateData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cow updated successfully",
    data: result,
  });
});

// Delete Cow
const deleteCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await CowService.deleteCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cow deleted successfully",
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
