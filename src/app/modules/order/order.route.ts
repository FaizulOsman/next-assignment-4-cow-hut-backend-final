import express from "express";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";
import validateRequest from "../../middlewares/validateRequest";
const router = express.Router();

// Routes
router.post(
  "/",
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);
router.get("/", OrderController.getAllOrders);

export const OrderRoutes = router;
