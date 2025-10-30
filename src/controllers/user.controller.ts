import { Request, Response, NextFunction } from "express";
import {
  RegisterRequest,
  LoginRequest,
  UpdateRequest,
  UserRequest,
} from "../models/users.interface";
import userService from "../services/user.service";
import {
  registerValidation,
  loginValidation,
  updateValidation,
} from "../validations/users.validation";
import ResponseError from "../errors/response.error";

class userController {
  async register(request: Request, response: Response, next: NextFunction) {
    const userRequest: RegisterRequest = registerValidation.parse(request.body);
    try {
      const result = await userService.createUser(userRequest);
      response.status(result.status).json({ data: result.data });
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const userRequest: LoginRequest = loginValidation.parse(request.body);
    try {
      const result = await userService.loginUser(userRequest);
      response.cookie("authToken", result.data.token);
      response.status(result.status).json({ data: result.data });
      if (!result.data.token) {
        throw new ResponseError(400, "unauthorized");
      }
    } catch (error) {
      next(error);
    }
  }

  async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userreq = req.user;
      if (!userreq) {
        throw new ResponseError(400, "tidak ada user yang login");
      }
      const result = await userService.getUser(userreq);
      res.status(result.status).json({ data: result.data });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userreq = req.user;
      if (!userreq) {
        throw new ResponseError(400, "tidak ada user yang login");
      }
      const userRequest: UpdateRequest = updateValidation.parse(req.body);
      const result = await userService.updateUser(userreq, userRequest);
      res.status(result.status).json({ data: result.data });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userreq = req.user;
      if (!userreq) {
        throw new ResponseError(400, "tidak ada user yang login");
      }
      const result = await userService.deleteUser(userreq);
      res.status(result.status).json({
        message: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
