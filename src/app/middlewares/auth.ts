import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { TAccountType } from "../modules/user/user.types";


declare module "express" {
  interface Request {
    AuthorizedUser?: JwtPayload;
  }
}

const auth = (...requiredAccountType: TAccountType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(401, "Unauthorized");
      }

      // Verify token
      jwt.verify(token, config.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          return next(new AppError(401, "Unauthorized"));
        }

        if (!requiredAccountType.includes((decoded as JwtPayload).accountType)) {
          return next(new AppError(403, "Access Denied"));
        }

        const user = decoded as JwtPayload;
        req.AuthorizedUser = user;
        next();
      });
    } catch (error) {
      next(error);
    }
  };
};

export default auth;