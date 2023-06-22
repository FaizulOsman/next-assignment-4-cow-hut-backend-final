import express from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
const router = express.Router();

// Routes
router.get("/:id", UserController.getSingleUser);

router.patch(
  "/:id",
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);

router.delete("/:id", UserController.deleteUser);

router.get("/", UserController.getAllUsers);

export const UserRoutes = router;
