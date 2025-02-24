import { RequestHandler } from "express";
import { UserService } from "./user.Service";
import { userValidationSchema } from "./user.validation";

const Registration: RequestHandler = async (req, res) => {
    try {
        const validate = userValidationSchema.parse(req.body);
        const result = await UserService.Registration(validate);
        res.status(200).json({
            success: true,
            message: 'Registration successfully!',
            data: result,
          });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
          });
    }
    }


export const UserContoller = {
    Registration
}