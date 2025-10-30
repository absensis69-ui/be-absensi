import { Router } from "express";
import absensiController from "../controllers/absensi.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const absensiRouter = Router();

absensiRouter.post("/", authenticateToken, absensiController.create);
absensiRouter.get("/", authenticateToken, absensiController.getDetail);
absensiRouter.put("/", authenticateToken, absensiController.update);

export default absensiRouter;
