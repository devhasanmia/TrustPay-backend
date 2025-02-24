import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const applyValidation = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};