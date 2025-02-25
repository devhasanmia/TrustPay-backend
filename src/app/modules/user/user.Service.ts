import AppError from "../../../errors/AppError";
import User from "./user.model";

const agentsApprovalRequest = async () => {
    try {
        const result = await User.find({ accountType: "Agent", status: "Pending" }).select("-pin -__v");
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
        if (!id || !status) {
            throw new AppError(400, "Id and status are required.");
        }
        if (status !== "Approve" && status !== "Blocked" && status !== "Rejected") {
            throw new AppError(400, "Invalid status.");
        }
        const agent = await User.findById(id);
        if (agent?.accountType !== "Agent") {
            throw new AppError(404, "No agent found.");
        }
        if (status === "Approve") {
            if (agent.status !== "Pending") {
                throw new AppError(400, "Agent already approved.");
            }
        } else if (status === "Blocked") {
            if (agent.status === "Blocked") {
                throw new AppError(400, "Agent already blocked.");
            }
        } else if (status === "Rejected") {
            if (agent.status === "Rejected") {
                throw new AppError(400, "Agent already rejected.");
            }
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


export const UserService = {
    agentsApprovalRequest,
    agentsApproval,
};