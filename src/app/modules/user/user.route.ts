import express from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

// Routes
router.get("/my-profile", UserController.getMyProfile);

router.patch("/my-profile", UserController.updateMyProfile);

router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);

router.patch(
  "/:id",
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
