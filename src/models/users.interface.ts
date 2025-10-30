import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import {
  loginValidation,
  registerValidation,
  updateValidation,
} from "../validations/users.validation";

export type RegisterRequest = z.infer<typeof registerValidation>;
export type LoginRequest = z.infer<typeof loginValidation>;
export type UpdateRequest = z.infer<typeof updateValidation>;

export interface UserResponse {
  status: number;
  data: {
    email: string;
    name?: string;
    token?: string;
  };
}

export function toUserResponse(user: any): UserResponse {
  return {
    status: 200,
    data: {
      email: user.email,
      name: user.name,
      token: user.token,
    },
  };
}

export interface customJwtPayload extends JwtPayload {
  name?: string;
  email: string;
  id: number;
}

export interface UserRequest extends Request {
  user?: customJwtPayload;
}
