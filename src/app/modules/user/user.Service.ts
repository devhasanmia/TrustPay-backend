import User from "./user.model";
import { TUser } from "./user.types";

const Registration = async (data : TUser) => {
    try {
        const result = await User.create(data);
        return result;
    } catch (error: any) {
        throw new Error(error);
    }
};


export const UserService = {
    Registration
}