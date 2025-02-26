export type TUser = {
    name: string;
    pin: string;
    mobileNumber: string;
    email: string;
    accountType: "Agent" | "User" | "Admin";
    nid: string;
    balance: number;
    status?: "Pending" | "Approve" | "Blocked" | "Rejected";
}

export type TAgentApprovalRequest = {
    status: "Pending" | "Approve" | "Blocked" | "Rejected";
}

export type TAccountType = "Agent" | "User" | "Admin";
