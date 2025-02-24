import User from "./user.model";
import { TUser } from "./user.types";

const Registration = async (data : TUser) => {
       try {
        const result = await User.create(data);
        return result;
       } catch (error) {
            throw error
       }
};


export const UserService = {
    Registration
}