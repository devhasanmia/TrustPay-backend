import AppError from "../../../errors/AppError";
import { TAuthPayload } from "../auth/auth.types";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import { TTransaction } from "./transactions.types";

const cashIn = async (
  mobileNumber: string,
  amount: number,
  pin: string,
  user: TAuthPayload
) => {
  try {
    if (!mobileNumber || !amount || !pin || !user) {
      throw new Error("Mobile number Amount PIN and User Info are required.");
    }
    // Check User Exist
    const isUserExist = await User.findOne({
      mobileNumber,
      accountType: "User"
    });
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
    const agent = await User.findOne({
      mobileNumber: user.mobileNumber,
      accountType: "Agent"
    });
    if (!agent) {
      throw new AppError(404, "Agent not found.");
    }
    // Check Agent PIN
    const agentPinMatch = await bcrypt.compare(pin, agent.pin);
    if (!agentPinMatch) {
      throw new AppError(
        400,
        "The PIN you entered is incorrect. Please try again."
      );
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
      message: "Cash-in successful."
    };
  } catch (error) {
    throw error;
  }
};

const sendMoney = async (payload: TTransaction, AuthorizedUser:TAuthPayload ) => {
  try {
    // Check User Exist 
    return {
      message: "Send Mony Su"
    }
  } catch (error) {
    throw error;
  }
};

export const TransactionsService = {
  cashIn,
  sendMoney
};
