import AppError from "../../../errors/AppError";
import { TAuthPayload } from "../auth/auth.types";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import { TTransaction } from "./transactions.types";
import { ClientSession } from 'mongoose';
import MoneyTransaction from "./transactions.model";

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



const sendMoney = async (payload: TTransaction, AuthorizedUser: TAuthPayload) => {
  let session: ClientSession | null = null;
  try {
    // Start a new session
    session = await User.startSession();
    session.startTransaction();

    // Check Valid User
    const user = await User.findOne({
      mobileNumber: AuthorizedUser.mobileNumber,
      accountType: "User"
    }).session(session);
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (payload.amount < 50) {
      throw new AppError(400, "Minimum amount to send Money is 50. Please try again.");
    }

    // Charge Validation
    let charge = 0;
    if (payload.amount > 100) {
      charge = 5;
    }

    // Check User Balance (including charge)
    if (user.balance < payload.amount + charge) {
      throw new AppError(400, "Insufficient balance.");
    }

    if (user.mobileNumber === payload.accountNumber) {
      throw new AppError(400, "You can't send money to yourself.");
    }

    // Valid Account Number
    const receiverUser = await User.findOne({ mobileNumber: payload.accountNumber }).session(session);
    if (!receiverUser) {
      throw new AppError(404, "Invalid account number.");
    }

    // payload pin exist
    const pin = payload.pin;
    if (!pin) {
      throw new AppError(400, "Pin is required.");
    }

    // Pin Validation
    const agentPinMatch = await bcrypt.compare(pin, user.pin);
    if (!agentPinMatch) {
      throw new AppError(400, "The PIN you entered is incorrect. Please try again.");
    }

    // Deduct charge and amount from user's balance in a single operation
    const totalDeduction = payload.amount + charge;
    await User.findOneAndUpdate(
      { mobileNumber: AuthorizedUser.mobileNumber },
      { $inc: { balance: -totalDeduction } },
      { new: true, session }
    ).select("-pin -__v");

    // Update Receiver User Balance
    await User.findOneAndUpdate(
      { mobileNumber: payload.accountNumber },
      { $inc: { balance: payload.amount } },
      { new: true, session }
    ).select("-pin -__v");

    // Add charge to admin's income
    if (charge > 0) {
      const admin = await User.findOne({ accountType: "Admin" }).session(session);
      if (admin) {
        admin.income += charge;
        await admin.save({ session });
      }
    }

    // Create Transaction
    await MoneyTransaction.create([{
      accountNumber: AuthorizedUser.mobileNumber,
      amount: payload.amount,
      charge: charge,
      transactionType: "Send Money",
      status: "Success",
      from: user._id
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Send Money Successful!"
    };
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const getTransactions = async (AuthorizedUser: TAuthPayload) => {
  try {
    const transactionsOwn = await MoneyTransaction.find({
      $or: [
        { accountNumber: AuthorizedUser.mobileNumber }, 
        { from: AuthorizedUser._id },
      ],
    })
      .sort("-createdAt") 
      .lean();
    return transactionsOwn;
  } catch (error) {
    throw error
  }
};

const cashOut = async (payload: TTransaction, AuthorizedUser: TAuthPayload) => {
  let session: ClientSession | null = null;

  try {
    // Start a new session
    session = await User.startSession();
    session.startTransaction();

    // 1. Validate User
    const user = await User.findOne({
      mobileNumber: AuthorizedUser.mobileNumber,
      accountType: "User"
    }).session(session);
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    // 2. Validate PIN
    if (!payload.pin) {
      throw new AppError(400, "PIN is required.");
    }

    const pinMatch = await bcrypt.compare(payload.pin, user.pin);
    if (!pinMatch) {
      throw new AppError(400, "Invalid PIN.");
    }

    // 3. Calculate Charge and Total Deduction
    const charge = (payload.amount * 1.5) / 100; // 1.5% charge
    const totalDeduction = payload.amount + charge;

    // 4. Check User Balance
    if (user.balance < totalDeduction) {
      throw new AppError(400, "Insufficient balance.");
    }

    // 5. Find Agent
    const agent = await User.findOne({
      mobileNumber: payload.accountNumber,
      accountType: "Agent",
      status: "Approve"
    }).session(session);
    if (!agent) {
      throw new AppError(404, "Agent not found.");
    }

    // 6. Update User Balance
    user.balance -= totalDeduction;
    await user.save({ session });

    // 7. Update Agent Balance and Income
    const agentIncome = (payload.amount * 1) / 100; // 1% agent income
    agent.balance += payload.amount; // Agent receives the full amount
    agent.income += agentIncome; // Agent earns 1% income
    await agent.save({ session });

    // 8. Update Admin Income
    const adminIncome = (payload.amount * 0.5) / 100; // 0.5% admin income
    const admin = await User.findOne({ accountType: "Admin" }).session(session);
    if (admin) {
      admin.income += adminIncome;
      await admin.save({ session });
    }

    // 9. Log the Cash-Out Transaction
    await MoneyTransaction.create([{
      accountNumber: AuthorizedUser.mobileNumber,
      amount: payload.amount,
      charge: charge,
      transactionType: "Cash Out",
      status: "Success",
      from: user._id
    }], { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { message: "Cash-Out Successful!" };
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

export const TransactionsService = {
  cashIn,
  sendMoney,
  getTransactions,
  cashOut
};
