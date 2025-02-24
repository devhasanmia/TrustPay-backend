import express from "express";
import { UserContoller } from "./user.controller";
import { applyValidation } from "../../middlewares/applyValidation";
import { userValidationSchema } from "./user.validation";
const router = express.Router();

router.post(
  "/registration",
  applyValidation(userValidationSchema),
  UserContoller.Registration
);

export const UserRoute = router;