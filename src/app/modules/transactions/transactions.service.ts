import AppError from "../../../errors/AppError";
import { TAuthPayload } from "../auth/auth.types";
import User from "../user/user.model";
import bcrypt from "bcrypt";

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
const sendMoney = async (
    mobileNumber: string,
    amount: number,
    pin: string,
    user: TAuthPayload
  ) => {
    // Validate input
    if (!mobileNumber || !amount || !pin || !user) {
      throw new AppError(400, "Mobile number, amount, PIN, and user info are required.");
    }
  
    try {
      // Find the authenticated user
      const authUserExist = await User.findById(user._id);
      if (!authUserExist) {
        throw new AppError(404, "Unauthorized user.");
      }
  
      // Validate PIN
      const userPinMatch = await bcrypt.compare(pin, authUserExist.pin);
      if (!userPinMatch) {
        throw new AppError(400, "The PIN you entered is incorrect. Please try again.");
      }
  
      // Check if the user is trying to send money to themselves
      if (authUserExist.mobileNumber === mobileNumber) {
        throw new AppError(400, "You can't send money to yourself.");
      }
  
      // Validate minimum balance and amount
      const MINIMUM_BALANCE = 50;
      if (authUserExist.balance < MINIMUM_BALANCE) {
        throw new AppError(400, `The minimum balance for sending money is ${MINIMUM_BALANCE} taka.`);
      }
      if (authUserExist.balance < amount) {
        throw new AppError(400, "Insufficient balance.");
      }
  
      // Find the recipient user
      const recipientUser = await User.findOne({ mobileNumber, accountType: "User" });
      if (!recipientUser) {
        throw new AppError(404, "Recipient user not found.");
      }
  
      // Calculate fee (if applicable)
      const FEE_THRESHOLD = 100;
      const FEE_AMOUNT = 5;
      let totalDeduction = amount;
  
      if (amount > FEE_THRESHOLD) {
        totalDeduction += FEE_AMOUNT;
        await User.findByIdAndUpdate(authUserExist._id, { $inc: { balance: -FEE_AMOUNT } });
        // Added Admin Balance to the admin account
        
        await User.findOneAndUpdate({ mobileNumber: "01740398196" }, { $inc: { balance: FEE_AMOUNT } });
      }
  
      // Deduct amount from the sender's balance
      await User.findByIdAndUpdate(authUserExist._id, { $inc: { balance: -amount } });
  
      // Add amount to the recipient's balance
      await User.findOneAndUpdate(
        { mobileNumber },
        { $inc: { balance: amount } },
        { new: true }
      );
  
      return {
        message: "Send money successful.",
        data: {
          senderBalance: authUserExist.balance - totalDeduction,
          recipientBalance: recipientUser.balance + amount,
        },
      };
    } catch (error) {
      console.error("Error in sendMoney:", error);
      throw new AppError(500, "An error occurred while sending money. Please try again.");
    }
  };

export const TransactionsService = {
  cashIn,
  sendMoney
};
