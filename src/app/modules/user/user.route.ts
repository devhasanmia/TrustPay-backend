import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/agents-approval-request", UserController.agentsApprovalRequest);
router.put("/agents-approval/:id", UserController.agentsApproval);
router.get("/getAgents", UserController.getAgents);
router.get("/getAdmin", auth("Admin"), UserController.getAdmin);
router.get("/getUser", auth("User"), UserController.getAdmin);

export const UserRoute = router;