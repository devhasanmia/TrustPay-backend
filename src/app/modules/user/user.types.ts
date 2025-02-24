export type TUser = {
    name: string;
    pin: string;
    mobileNumber: string;
    email: string;
    accountType: "Agent" | "User" | "Admin";
    nid: string;
    balance: number;
    status: "Pending" | "Approve" | "Blocked";
}