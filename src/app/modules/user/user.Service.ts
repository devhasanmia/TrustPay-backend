import AppError from "../../../errors/AppError";
import User from "./user.model";

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

export const UserService = {
    agentsApprovalRequest,
    agentsApproval,
    getAgents
};