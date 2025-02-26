import { NextFunction, Request, Response } from "express";
import { TransactionsService } from "./transactions.service";
import { TAuthPayload } from "../auth/auth.types";

const cashIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobileNumber, amount, pin } = req.body;
    const { AuthorizedUser } = req;
    if (!AuthorizedUser) {
      throw new Error("Unauthorized");
    }
    const result = await TransactionsService.cashIn(mobileNumber, amount, pin, AuthorizedUser as TAuthPayload);
    res.status(200).json({
        success: true,
        message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const sendMoney = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const { AuthorizedUser } = req;
      const result = await TransactionsService.sendMoney(payload, AuthorizedUser as TAuthPayload)
      res.status(200).json({
        success: true,
        message: result.message,
      })
    } catch (error) {
        next(error);
    }
}
const cashOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const { AuthorizedUser } = req;
      const result = await TransactionsService.cashOut(payload, AuthorizedUser as TAuthPayload)
      res.status(200).json({
        success: true,
        message: result.message,
      })
    } catch (error) {
        next(error);
    }
}

const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { AuthorizedUser } = req;
    const result = await TransactionsService.getTransactions(AuthorizedUser as TAuthPayload);
    res.status(200).json({
        success: true,
        message: "Retrive All Transactions Successfully!",
        data: result,
    });
  } catch (error) {
    next(error);
  }
}

export const TransactionsController = {
    cashIn,
    sendMoney,
    getTransactions,cashOut
};