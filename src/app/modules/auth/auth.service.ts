import AppError from "../../../errors/AppError";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import { TLogin } from "./auth.types";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { TUser } from "../user/user.types";

const registration = async (data : TUser) => {
  try {
  if (data.accountType === 'User') {
    data.balance = 40;
  }else if (data.accountType === 'Agent') {
    data.status = 'Pending';
    data.balance =0;
    data.income = 0;
  }
   const result = await User.create(data);
   return result;
  } catch (error) {
       throw error
  }
};


export const login = async (payload: TLogin) => {
    if (!payload?.email && !payload?.mobileNumber) {
        throw new AppError(400, 'Email or mobile number is required!');
      }
        if (!payload?.pin) {
            throw new AppError(400, 'Pin is required!');
        }
    const user = await User.findOne({ $or: [{ email: payload.email }, { mobileNumber: payload.mobileNumber }] });
  
    if (!user) {
      throw new AppError(404, 'invalid credentials!');
    }
    // Checking if the user is pending
    const userStatus = user?.status;
    if (userStatus === 'Pending') {
      throw new AppError(403, 'Your agent account is under review. Approval coming soon! Thank you for your patience.');
    }
    // Checking if the user is blocked
    if (userStatus === 'Blocked') {
      throw new AppError(403, 'Your account is blocked. Contact support.');
    }
  
    // checking if the Pin is correct
    const isMatchPin = await bcrypt.compare(payload.pin, user.pin);
    if (!isMatchPin) {
      throw new AppError(400, 'Wrong pin! Please try again.');
    }

    // Generating token
    const jwtPayload = {
      _id: user._id,
      mobileNumber: user.mobileNumber,
      accountType: user.accountType,
    };
    const accessToken = jwt.sign(jwtPayload, config.JWT_SECRET as string, { expiresIn: '30m' });
    return accessToken;
  };

export const AuthServices = {
    login,
    registration
}