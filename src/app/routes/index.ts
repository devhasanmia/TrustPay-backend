import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoute
  },
  {
    path: "/auth",
    route: authRoute
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;