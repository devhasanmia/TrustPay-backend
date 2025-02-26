import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/agents-approval-request", UserController.agentsApprovalRequest);
router.put("/agents-approval/:id", UserController.agentsApproval);
router.get("/getAgents", UserController.getAgents);

export const UserRoute = router;