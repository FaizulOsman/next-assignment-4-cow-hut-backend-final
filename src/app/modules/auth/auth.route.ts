import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { AuthController } from "./auth.controller";
const router = express.Router();

// Routes
router.post(
  "/signup",
  validateRequest(UserValidation.createUserZodSchema),
  AuthController.createAuth
);

export const AuthRoutes = router;
