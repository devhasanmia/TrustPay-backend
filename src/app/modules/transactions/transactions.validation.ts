// create transaction

import { z } from "zod";

const TransactionSchema = z.object({
  accountNumber: z.string({
    required_error: "Account number is required"
  }),
  amount: z
    .number({
      required_error: "Amount is required"
    })
    .positive("Amount must be a positive number"),
  charge: z.number().default(0),
  transactionType: z.enum(["SendMoney", "CashIn", "CashOut"], {
    required_error: "Transaction type is required"
  }),
  status: z.enum(["Pending", "Success", "Failed"]).default("Pending"),
  pin: z.string().regex(/^\d{5}$/, "PIN must be exactly 5 digits"),
});


export const TransactionValidation = {
    TransactionSchema
}
