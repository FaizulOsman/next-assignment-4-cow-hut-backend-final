import express from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
// import { AdminValidation } from "./admin.validation";

const router = express.Router();

// Routes
router.post("/create-admin", AdminController.createAdmin);
// router.get('/', AdminController.getAllAdmins);
// router.get('/:id', AdminController.getSingleAdmin);

// router.delete('/:id', AdminController.deleteAdmin);

// router.patch(
//   '/:id',
//   validateRequest(AdminValidation.updateAdminZodSchema),
//   AdminController.updateAdmin
// );

export const AdminRoutes = router;
