import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import { TAuthPayload } from "../auth/auth.types";

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

const getAgents: RequestHandler = async (req, res, next) => {
    try {
        const result = await UserService.getAgents();
        res.status(200).json({
            success: true,
            message: 'Agents fetched successfully!',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

const getAdmin = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { AuthorizedUser } = req;
        const result = await UserService.getAdmin(AuthorizedUser as TAuthPayload);
        res.status(200).json({
            success: true,
            message: 'Admin fetched successfully!',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { AuthorizedUser } = req;
        const result = await UserService.getUser(AuthorizedUser as TAuthPayload);
        res.status(200).json({
            success: true,
            message: 'User fetched successfully!',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}


export const UserController = {
    agentsApprovalRequest,
    agentsApproval,
    getAgents,
    getAdmin,
    getUser
};