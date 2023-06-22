import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CowRoutes } from "../modules/cow/cow.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OrderRoutes } from "../modules/order/order.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = express.Router();

// Define routes
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/cows",
    route: CowRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
];

// Mapping routes
moduleRoutes?.forEach((route) => router.use(route?.path, route?.route));

export default router;
