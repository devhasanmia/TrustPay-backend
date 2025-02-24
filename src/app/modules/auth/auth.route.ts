import express from "express";
import { AuthController } from "./auth.controller";
import { loginLimiter } from "../../utils/LoginAttemptsLimit";
const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  AuthController.login
);

export const authRoute = router;