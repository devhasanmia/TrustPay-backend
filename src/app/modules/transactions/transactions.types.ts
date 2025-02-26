import { Types } from "mongoose";

export enum TransactionType {
    SendMoney = "Send Money",
    CashIn = "CashIn",
    CashOut = "Cash Out",
}

export enum TransactionStatus {
    Pending = "Pending",
    Success = "Success",
    Failed = "Failed",
}

export type TTransaction = {
    accountNumber: string;
    amount: number; 
    charge?: number; 
    pin?: string; 
    transactionType: TransactionType; 
    status?: TransactionStatus; 
    from?: Types.ObjectId;
};
