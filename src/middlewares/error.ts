import { NextFunction, Request, Response } from "express";
import ErorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";
export const errorMiddleware = (
  err: ErorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "internal server error";
  err.statusCode ||= 500;

  if (err.name === "CastError") 
    err.message = "Invalid ID";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const TryCatch = (func: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
};
