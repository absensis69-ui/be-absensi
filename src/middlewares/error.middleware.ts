import { NextFunction, Request, Response } from "express";
import ResponseError from "../errors/response.error";
import { ZodError } from "zod";

export const errorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ResponseError) {
    res.status(error.status).json({
      error: error.message,
    });
  } else if (error instanceof ZodError) {
    res.status(400).json({
      message: "error validation",
      error: error.issues[0]?.message,
      path: error.issues[0]?.path,
    });
  } else {
    res.status(500).json({
      error: error.message,
    });
  }
};
