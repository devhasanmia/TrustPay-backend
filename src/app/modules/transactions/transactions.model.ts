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
        enum: ["Send Money", "CashIn", "Cash Out"],
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending",
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const MoneyTransaction = model<TTransaction>("Transaction", transactionSchema);

export default MoneyTransaction;