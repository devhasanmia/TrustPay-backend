import express from "express";
import { TransactionsController } from "./transactions.controller";
import auth from "../../middlewares/auth";
import { applyValidation } from "../../middlewares/applyValidation";
import { TransactionValidation } from "./transactions.validation";

const router = express.Router();
router.post("/cashIn", auth("Agent"), TransactionsController.cashIn);
router.post("/sendMoney", auth("User"), applyValidation(TransactionValidation.TransactionSchema),  TransactionsController.sendMoney);
router.post("/cashOut", auth("User"), applyValidation(TransactionValidation.TransactionSchema),  TransactionsController.cashOut);
router.get("/getTransactions", auth("User", "Admin", "Agent"), TransactionsController.getTransactions);
router.get("/getAllTransactions",auth("Admin") ,TransactionsController.getAllTransactions);


export const TransactionsRoute = router;
