import { RequestHandler } from "express";
import { UserService } from "./user.service";
import AppError from "../../../errors/AppError";

const agentsApprovalRequest: RequestHandler = async (req, res, next) => {
  try {
      const result = await UserService.agentsApprovalRequest();
      res.status(200).json({
          success: true,
          message: 'Agents approval request!',
          data: result,
      });
  } catch (error: any) {
      next(error);
  }
}

const agentsApproval: RequestHandler = async (req, res, next) => {
    try {
        const result = await UserService.agentsApproval(req.params.id, req.body.status);
        res.status(200).json({
            success: true,
            message: `Agent ${result.status} successfully!`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}


export const UserController = {
    agentsApprovalRequest,
    agentsApproval
};