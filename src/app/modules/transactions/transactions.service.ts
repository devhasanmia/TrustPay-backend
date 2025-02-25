import AppError from "../../../errors/AppError";
import { TAuthPayload } from "../auth/auth.types";
import User from "../user/user.model";
import bcrypt from "bcrypt";
const cashIn = async (mobileNumber: string, amount: number, pin: string, user:TAuthPayload) => {
    try {
        if (!mobileNumber || !amount) {
            throw new Error("Mobile number and amount are required.");
        }
        // Check User Exist
        const isUserExist = await User.findOne({ mobileNumber, accountType: "User" });
        if (!isUserExist) {
            throw new AppError(404, "User not found.");
        }
        // Cash-in
        await User.findOneAndUpdate(
            { mobileNumber },
            { $inc: { balance: amount } }, 
            { new: true }
        ).select("-pin -__v");

        // Agent Balance Update
        const agent = await User.findOne({ mobileNumber: user.mobileNumber, accountType: "Agent" });
        if (!agent) {
            throw new AppError(404, "Agent not found.");
        }
        // Check Agent PIN
        const agentPinMatch = await bcrypt.compare(pin, agent.pin);
        if (!agentPinMatch) {
            throw new AppError(400, "The PIN you entered is incorrect. Please try again.");
        }
        // Agent Balance Check
        if (agent.balance < amount) {
            throw new AppError(400, "Insufficient balance.");
        }
        // Agent Balance Update
        await User.findOneAndUpdate(
            { mobileNumber: user.mobileNumber },
            { $inc: { balance: -amount } },
            { new: true }
        ).select("-pin -__v");

        return {
            message: "Cash-in successful.",
        };
    } catch (error: any) {
        throw error;
    }
};



export const TransactionsService = {
    cashIn
}