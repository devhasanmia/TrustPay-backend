import { model, Schema } from "mongoose";
import { TUser } from "./user.types";

const userSchema = new Schema<TUser>({
    name: { 
        type: String,
        required: true
    },
    pin: { 
        type: Number,
        required: true,
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
        type: Number,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
})

const User = model<TUser>("User", userSchema);

export default User;