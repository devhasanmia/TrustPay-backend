import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { TransactionsRoute } from "../modules/transactions/transactions.route";
const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoute
  },
  {
    path: "/auth",
    route: authRoute
  },
  {
    path: "/transactions",
    route: TransactionsRoute
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;