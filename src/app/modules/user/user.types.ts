export type TUser = {
    name: string;
    pin: string;
    mobileNumber: string;
    email: string;
    accountType: "Agent" | "User";
    nid: string;
    balance: number;
}