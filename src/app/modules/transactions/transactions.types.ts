export type TTransaction = {
    accountNumber: string;
    amount: number;
    charge?: number;
    pin: string;
    transactionType: "SendMoney" | "CashIn" | "CashOut";
    status?: "Pending" | "Success" | "Failed";
};