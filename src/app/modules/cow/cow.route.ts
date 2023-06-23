import express from "express";
import { CowController } from "./cow.controller";
import { CowValidation } from "./cow.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

// Routes
router.post(
  "/",
  validateRequest(CowValidation.createCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.createCow
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  CowController.getSingleCow
);

router.patch(
  "/:id",
  validateRequest(CowValidation.updateCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.updateCow
);

router.delete("/:id", auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  CowController.getAllCows
);

export const CowRoutes = router;
