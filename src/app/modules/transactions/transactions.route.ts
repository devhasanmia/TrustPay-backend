import express from "express";
import { TransactionsController } from "./transactions.controller";
import auth from "../../middlewares/auth";

const router = express.Router();
router.put("/cashIn", auth("Agent"), TransactionsController.cashIn);


export const TransactionsRoute = router;
