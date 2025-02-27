import AppError from "../../../errors/AppError";
import { TAuthPayload } from "../auth/auth.types";
import User from "./user.model";

const getAdmin = async ( user: TAuthPayload) => {
    try {
        const admin = await User.findById(user._id).select("-pin -__v")

        if (!admin) {
            throw new AppError(404, "No admin found.");
        }
        return admin;
    } catch (error) {
        throw error;
    }
}

const agentsApprovalRequest = async () => {
    try {
        const result = await User.find({ accountType: "Agent", status: "Pending" }).select("-pin -__v").sort("-createdAt");
        if (result.length === 0) {
            throw new AppError(404, "No agent request found.");
        }
        return result;
    } catch (error) {
        throw error;
    }
};

const agentsApproval = async (id: string, status: string) => {
    try {

        const agent = await User.findById(id);
        if (agent?.accountType !== "Agent") {
            throw new AppError(404, "No agent found.");
        }
     
        const updateData: { status: string; balance?: number } = { 
            status
        };
        if (status === "Approve") {
            updateData.balance = 100000;
        }
        const result = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select("-pin -__v");
        return {
            status: result?.status,
            result,
        };
    } catch (error) {
        throw error;
    }
};

const getAgents = async () => {
    try {
        const result = await User.find({ accountType: "Agent" }).select("-pin -__v").sort("-createdAt");
        return result;
    } catch (error) {
        throw error;
    }
}
const getAuthAgent = async (user: TAuthPayload) => {
    try {
        const authAgent = await User.findById(user._id).select("-pin -__v")
        if (!authAgent) {
            throw new AppError(404, "No authenticated agent found.");
        }
        const result = await User.find({ accountType: "Agent", status: "Approve"}).select("-pin -__v").sort("-createdAt");
        return result;
    } catch (error) {
        throw error;
    }
}

const getUser = async (user: TAuthPayload) => {
    try {
        const result = await User.findById(user._id).select("-pin -__v");
        if (!result) {
            throw new AppError(404, "No user found.");
        }
        return result;
    } catch (error) {
        throw error
    }
}

export const UserService = {
    agentsApprovalRequest,
    agentsApproval,
    getAgents,
    getAdmin,
    getUser,
    getAuthAgent
};