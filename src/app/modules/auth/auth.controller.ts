import { RequestHandler } from "express";
import { AuthServices } from "./auth.service";

const registration: RequestHandler = async (req, res, next) => {
  try {
      const result = await AuthServices.registration(req.body);
      res.status(200).json({
          success: true,
          message: 'Registration successfully!',
          data: result,
      });
  } catch (error: any) {
      next(error);
  }
}

const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.login(req.body);
    res.status(200).json({
        success: true,
        message: "Login successfully!",
        accessToken: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
    login,
    registration
};
