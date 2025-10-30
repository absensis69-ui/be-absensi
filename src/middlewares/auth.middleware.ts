import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ResponseError from "../errors/response.error";
import { customJwtPayload, UserRequest } from "../models/users.interface";

export const authenticateToken = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;

  if (token == null) {
    throw new ResponseError(401, "unauthorized");
  }
  const user = jwt.verify(token, process.env.JWT_SECRET!) as customJwtPayload;
  req.user = user;
  next();
};
