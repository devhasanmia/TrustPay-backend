import { model, Schema } from "mongoose";
import { TUser } from "./user.types";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ["Agent", "User"],
    default: "User"
  },
  nid: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  }
});

userSchema.pre("save", async function(next) {
  const data = this;
//   Check User Data Available or Not

  try {
   
    // Hashing the pin
    if (data.isModified("pin")) {
      data.pin = await bcrypt.hash(data.pin.toString(), 10);
    }
    if (data.accountType === "Agent") {
      data.balance = 100000;
    } else if (data.accountType === "User") {
      data.balance = 40;
    } else {
      data.balance = 0;
    }
    next();
  } catch (err) {
    next();
  }
});

const User = model<TUser>("User", userSchema);

export default User;
