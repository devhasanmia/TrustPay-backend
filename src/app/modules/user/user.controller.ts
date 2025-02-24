import { RequestHandler } from "express";
import { UserService } from "./user.service";

const Registration: RequestHandler = async (req, res, next) => {
    try {
        const result = await UserService.Registration(req.body);
        res.status(200).json({
            success: true,
            message: 'Registration successfully!',
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
}

export const UserContoller = {
    Registration
}