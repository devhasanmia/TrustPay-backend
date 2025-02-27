import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/agents-approval-request", auth("Admin"), UserController.agentsApprovalRequest);
router.put("/agents-approval/:id",auth("Admin"), UserController.agentsApproval);
router.get("/getAgents", auth("Admin"),UserController.getAgents);
router.get("/getAdmin", auth("Admin"), UserController.getAdmin);
router.get("/getUser", auth("User"), UserController.getAdmin);
router.get("/getAgentown", auth("Agent"), UserController.getAgentown);

export const UserRoute = router;