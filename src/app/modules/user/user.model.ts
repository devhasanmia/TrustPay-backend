import { model, Schema } from "mongoose";
import { TUser } from "./user.types";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser>(
  {
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
      enum: ["Agent", "User", "Admin"],
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
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approve", "Blocked", "Rejected"],
      default: "Approve"
    },
    income: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  const data = this;
  try {
    if (data.isModified("pin")) {
      data.pin = await bcrypt.hash(data.pin.toString(), 10);
    }
    next();
  } catch (err) {
    next();
  }
});

const User = model<TUser>("User", userSchema);

export default User;
