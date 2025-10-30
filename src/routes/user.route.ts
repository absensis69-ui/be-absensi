import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/", authenticateToken, userController.get);
userRouter.put("/", authenticateToken, userController.updateUser);
userRouter.delete("/", authenticateToken, userController.deleteUser);

export default userRouter;
