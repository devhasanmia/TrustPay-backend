import { model, Schema } from "mongoose";
import { TTransaction } from "./transactions.types";

const transactionSchema = new Schema<TTransaction>({
    accountNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    charge: {
        type: Number,
        default: 0
    },
    transactionType: {
        type: String,
        enum: ["SendMoney", "CashIn", "CashOut"],
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending",
        required: true
    },
    pin: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Transaction = model<TTransaction>("Transaction", transactionSchema);

export default Transaction;