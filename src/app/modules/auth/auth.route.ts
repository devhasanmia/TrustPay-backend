import express from "express";
import { AuthController } from "./auth.controller";
import { loginLimiter } from "../../utils/LoginAttemptsLimit";
import { applyValidation } from "../../middlewares/applyValidation";
import { userValidationSchema } from "../user/user.validation";
const router = express.Router();

router.post(
  "/registration",
  applyValidation(userValidationSchema),
  AuthController.registration
);

router.post(
  "/login",
  loginLimiter,
  AuthController.login
);

export const authRoute = router;