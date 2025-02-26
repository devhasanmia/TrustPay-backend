import express from "express";
import { TransactionsController } from "./transactions.controller";
import auth from "../../middlewares/auth";
import { applyValidation } from "../../middlewares/applyValidation";
import { TransactionValidation } from "./transactions.validation";

const router = express.Router();
router.put("/cashIn", auth("Agent"), TransactionsController.cashIn);
router.put("/sendMoney", applyValidation(TransactionValidation.TransactionSchema),  TransactionsController.sendMoney);


export const TransactionsRoute = router;
