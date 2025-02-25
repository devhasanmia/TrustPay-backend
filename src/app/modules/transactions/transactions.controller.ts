import { NextFunction, Request, Response } from "express";
import { TransactionsService } from "./transactions.service";
import { TAuthPayload } from "../auth/auth.types";

const cashIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobileNumber, amount, pin } = req.body;
    const { user } = req;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const result = await TransactionsService.cashIn(mobileNumber, amount, pin, user as TAuthPayload);
    res.status(200).json({
        success: true,
        message: result.message,
    });
  } catch (error) {
    next(error);
  }
};


export const TransactionsController = {
    cashIn
};